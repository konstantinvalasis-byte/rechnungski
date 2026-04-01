"use client";
import { useState } from "react";
import { IC } from "@/lib/dashboard-icons";
import type { Plan, Period } from "@/lib/stripe";

// BILLING_DISABLED: Auf true setzen wenn Stripe reaktiviert werden soll
const BILLING_ENABLED = process.env.NEXT_PUBLIC_BILLING_ENABLED === 'true';

const pls = [
  { id: "free" as Plan,    n: "Free",    p: "0",     feat: ["3 Rechnungen & Angebote/Monat", "3 Kunden", "KI-Preisvorschläge", "PDF-Export", "§14-konforme Rechnungen"] },
  { id: "starter" as Plan, n: "Starter", p: "7,90",  feat: ["100 Rechnungen & Angebote/Monat", "100 Kunden", "Alles aus Free", "Firmenlogo auf PDFs", "E-Mail-Versand", "Wiederkehrende Rechnungen", "Mahnwesen"], pop: true },
  { id: "pro" as Plan,     n: "Pro",     p: "17,90", feat: ["Unbegrenzte Rechnungen & Kunden", "Alles aus Starter", "3-Stufen-Mahnwesen", "DATEV CSV-Export", "Angebote → Rechnungen (1 Klick)", "Prioritäts-Support"] },
];

const ALL_FEATURES = [
  "Unbegrenzte Rechnungen & Angebote",
  "Unbegrenzte Kunden",
  "Firmenlogo auf PDFs",
  "E-Mail-Versand direkt aus der App",
  "Wiederkehrende Rechnungen",
  "3-Stufen-Mahnwesen",
  "DATEV CSV-Export",
  "Angebote → Rechnungen (1 Klick)",
  "§14-konforme Rechnungen",
  "PDF-Export",
];

export default function AboPage({ plan, period = "monthly" }: { plan: string; period?: Period }) {
  const [loading, setLoading] = useState<Plan | null>(null);

  // ── Launch-Modus: Billing deaktiviert ──────────────────────────────────────
  if (!BILLING_ENABLED) {
    return (
      <div className="p-6 px-7 max-md:p-4 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-success-500/10 border border-success-500/20 text-success-400 text-[12px] font-semibold px-3.5 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse" />
            Launch-Angebot aktiv
          </div>
          <h1 className="text-[28px] font-extrabold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Aktuell kostenlos</h1>
          <p className="text-[14px] text-slate-400 mt-2 max-w-md mx-auto">
            RechnungsKI ist während der Einführungsphase komplett kostenlos — alle Funktionen inklusive.
          </p>
        </div>

        <div className="max-w-sm mx-auto rounded-2xl p-6 bg-gradient-to-b from-brand-500/10 to-brand-600/5 border-2 border-brand-500/40 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
          <div className="text-[12px] font-semibold text-brand-400 mb-1">Dein aktueller Zugang</div>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-[36px] font-extrabold tracking-tight">0 €</span>
            <span className="text-[13px] text-slate-500">/Monat</span>
          </div>
          <div className="flex flex-col gap-2">
            {ALL_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <span className="text-success-500 flex">{IC.check}</span>{f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[12px] text-slate-600 mt-6">
          Bezahlpläne kommen bald. Du wirst rechtzeitig informiert.
        </p>
      </div>
    );
  }

  // ── Normaler Modus: Stripe aktiv ───────────────────────────────────────────
  async function handleUpgrade(planId: Plan) {
    if (planId === "free" || planId === plan) return;
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, period }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Fehler: " + (data.error ?? "Unbekannter Fehler"));
      }
    } catch {
      alert("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading("free"); // Platzhalter um Ladestate zu zeigen
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-extrabold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Wähle deinen Plan</h1>
        <p className="text-[14px] text-slate-500 mt-2">Starte kostenlos. Upgrade jederzeit.</p>
      </div>

      <div className="grid grid-cols-3 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-3">
        {pls.map(p => (
          <div key={p.id} className={`rounded-2xl p-5 flex flex-col relative transition-all duration-200 ${p.pop ? "bg-gradient-to-b from-brand-500/10 to-brand-600/5 border-2 border-brand-500/40 shadow-[0_0_40px_rgba(99,102,241,0.08)]" : "bg-[#0a0a1a]/80 border border-white/[0.06] hover:border-white/[0.1]"}`}>
            {p.pop && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[9px] font-bold px-3.5 py-0.5 rounded-full tracking-wider shadow-[0_0_16px_rgba(99,102,241,0.3)]">BELIEBT</div>}
            <div className="text-[12px] font-semibold text-brand-400">{p.n}</div>
            <div className="flex items-baseline gap-[3px] my-1.5">
              <span className="text-[32px] font-extrabold tracking-tight">{p.p}€</span>
              <span className="text-[12px] text-slate-500">/Mo</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 my-3 mb-5">
              {p.feat.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <span className="text-success-500 flex">{IC.check}</span>{f}
                </div>
              ))}
            </div>
            <button
              disabled={plan === p.id || loading !== null}
              onClick={() => handleUpgrade(p.id)}
              className={`w-full justify-center transition-all duration-200 ${
                plan === p.id
                  ? "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-xl text-[12px] cursor-default"
                  : p.pop
                  ? "flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px] disabled:opacity-60"
                  : "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] disabled:opacity-60"
              }`}
            >
              {loading === p.id ? "Wird geladen…" : plan === p.id ? "Aktuell" : p.id === "free" ? "Kostenlos" : (["free","starter","pro"].indexOf(p.id) < ["free","starter","pro"].indexOf(plan)) ? "Downgraden" : "Upgraden"}
            </button>
          </div>
        ))}
      </div>

      {/* Abo verwalten — nur anzeigen wenn kein Free-Plan */}
      {plan !== "free" && (
        <div className="mt-6 text-center">
          <button
            onClick={handlePortal}
            className="text-[13px] text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
          >
            Abo verwalten / kündigen
          </button>
        </div>
      )}
    </div>
  );
}
