import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import type Stripe from "stripe";

// ═══════════════════════════════════════════════════════════
// POST /api/stripe/webhook
// Empfängt Stripe-Events und synct Abo-Status nach Supabase.
// Stripe sendet Events bei: Kauf, Update, Kündigung, Fehlschlag.
// ═══════════════════════════════════════════════════════════

// Next.js darf den Body nicht parsen — Stripe braucht den Raw-Body für die Signaturprüfung
export const config = { api: { bodyParser: false } };

// Stripe-Plan-Name auf internen Plan mappen
function mapPlanFromPriceId(priceId: string): string {
  const starterIds = [
    process.env.STRIPE_PRICE_STARTER_MONTHLY,
    process.env.STRIPE_PRICE_STARTER_YEARLY,
  ];
  const proIds = [
    process.env.STRIPE_PRICE_PRO_MONTHLY,
    process.env.STRIPE_PRICE_PRO_YEARLY,
  ];

  if (starterIds.includes(priceId)) return "starter";
  if (proIds.includes(priceId)) return "pro";
  return "free";
}

function mapPeriodFromPriceId(priceId: string): string {
  const yearlyIds = [
    process.env.STRIPE_PRICE_STARTER_YEARLY,
    process.env.STRIPE_PRICE_PRO_YEARLY,
  ];
  return yearlyIds.includes(priceId) ? "yearly" : "monthly";
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const admin = createSupabaseAdmin();
  const customerId = subscription.customer as string;

  const priceId = subscription.items.data[0]?.price.id ?? "";
  const plan = mapPlanFromPriceId(priceId);
  const period = mapPeriodFromPriceId(priceId);
  const status = subscription.status; // active, past_due, canceled, ...

  await admin
    .from("profiles")
    .update({
      stripe_subscription_id: subscription.id,
      plan: status === "active" || status === "trialing" ? plan : "free",
      subscription_status: status,
      plan_period: period,
    })
    .eq("stripe_customer_id", customerId);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signaturprüfung fehlgeschlagen:", err);
    return NextResponse.json({ error: "Ungültige Signatur" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Subscription-ID ist erst nach checkout bekannt — per sub-ID nachladen
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await syncSubscription(sub);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
      case "customer.subscription.deleted": {
        // Abo gekündigt → auf Free downgraden
        const sub = event.data.object as Stripe.Subscription;
        const admin = createSupabaseAdmin();
        await admin
          .from("profiles")
          .update({ plan: "free", subscription_status: "canceled", stripe_subscription_id: null })
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const admin = createSupabaseAdmin();
        await admin
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("stripe_customer_id", invoice.customer as string);
        break;
      }
    }
  } catch (err) {
    console.error("[webhook] Verarbeitung fehlgeschlagen:", err);
    return NextResponse.json({ error: "Verarbeitungsfehler" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
