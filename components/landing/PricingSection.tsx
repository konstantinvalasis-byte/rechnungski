"use client";
import FadeIn from "@/components/ui/FadeIn";
import { PLANS } from "@/lib/landing-data";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface Props {
  billing: "monthly" | "yearly";
  setBilling: (v: "monthly" | "yearly") => void;
}

export default function PricingSection({ billing, setBilling }: Props) {
  return (
    <FadeIn id="preise" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">Preise</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Einfach. Fair. Transparent.</h2>

          {/* Billing Toggle — animierte Sliding-Pille */}
          <div className="relative inline-flex items-center bg-slate-100 rounded-xl p-1 mt-6 border border-slate-200/60">
            {/* Gleitende Pille */}
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-brand-600 shadow-md shadow-brand-600/25 transition-all duration-300"
              style={{
                width: "calc(50% - 4px)",
                transform: billing === "yearly" ? "translateX(calc(100% + 4px))" : "translateX(0px)",
              }}
            />
            <button
              onClick={() => setBilling("monthly")}
              className={`relative z-10 px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                billing === "monthly" ? "text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monatlich
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`relative z-10 px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                billing === "yearly" ? "text-white" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Jährlich
              <span className={`ml-1.5 text-[10px] font-bold transition-colors duration-200 ${billing === "yearly" ? "text-emerald-300" : "text-emerald-500"}`}>-20%</span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-white border-2 border-brand-600 shadow-xl shadow-brand-100/50 ring-1 ring-brand-200/30"
                  : "bg-white border border-slate-200/80 hover:shadow-lg hover:shadow-slate-200/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-brand-600/25">
                  Empfohlen
                </div>
              )}
              <div className="text-xs font-bold text-brand-600 uppercase tracking-wide">{plan.name}</div>
              <div className="flex items-baseline gap-1 mt-2 mb-1">
                <span className="text-3xl font-extrabold tracking-tight">
                  {plan.price === 0 ? "0" : (billing === "yearly" ? plan.priceYearly : plan.price).toFixed(2).replace(".", ",")}€
                </span>
                <span className="text-xs text-slate-400 font-medium">/Mo</span>
              </div>
              <div className="text-xs text-slate-500 mb-5">{plan.desc}</div>

              <div className="flex-1 space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckIcon className="w-3.5 h-3.5 text-success-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <a
                href={`/registrieren?plan=${plan.name.toLowerCase()}`}
                className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-600/40"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                {plan.price === 0 ? "Kostenlos starten" : "Auswählen"}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise-Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Für Teams & Agenturen:{" "}
          <a href="/kontakt" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
            Kontakt aufnehmen →
          </a>
        </p>
      </div>
    </FadeIn>
  );
}
