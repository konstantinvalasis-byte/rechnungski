import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICES, type Plan, type Period } from "@/lib/stripe";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

// ═══════════════════════════════════════════════════════════
// POST /api/stripe/checkout
// Erstellt eine Stripe Checkout-Session und leitet weiter.
// Body: { plan: "starter"|"pro", period: "monthly"|"yearly" }
// ═══════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    // Nutzer authentifizieren
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const { plan, period = "monthly" } = await req.json() as { plan: Plan; period?: Period };

    if (plan === "free" || !(plan in STRIPE_PRICES)) {
      return NextResponse.json({ error: "Ungültiger Plan" }, { status: 400 });
    }

    const priceId = STRIPE_PRICES[plan as keyof typeof STRIPE_PRICES][period];

    // Bestehende stripe_customer_id laden oder neu anlegen
    const admin = createSupabaseAdmin();
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      // Customer-ID sofort speichern
      await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url:  `${baseUrl}/dashboard?checkout=cancel`,
      allow_promotion_codes: true,
      metadata: {
        supabase_user_id: user.id,
        plan,
        period,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
