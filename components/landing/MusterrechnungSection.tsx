"use client";
import FadeIn from "@/components/ui/FadeIn";

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

interface Props {
  onOpenModal: () => void;
}

export default function MusterrechnungSection({ onOpenModal }: Props) {
  return (
    <FadeIn className="py-20 md:py-28 bg-gradient-to-b from-slate-50/60 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">Live-Vorschau</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">So sieht Ihre Rechnung aus</h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Professionell, §14-konform, mit Ihrem Logo. Hier ist ein echtes Beispiel — zum Ansehen und als PDF.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {/* Teaser card */}
          <div className="relative w-full max-w-xl">
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-400/15 via-violet-400/8 to-transparent rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 overflow-hidden">
              {/* Invoice header */}
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-3">
                      <span className="text-[11px] font-extrabold text-white tracking-tight">ME</span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm">Müller Elektrotechnik</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Hans Müller · Schillerstraße 18 · 80336 München</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-brand-600 uppercase tracking-tight">Rechnung</div>
                    <div className="text-[11px] text-slate-400 mt-1">Nr. RE-2026-0047</div>
                    <div className="text-[11px] text-slate-400">Datum: 10.03.2026</div>
                    <div className="text-[11px] text-slate-400">Fällig: 24.03.2026</div>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-b border-slate-100">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Rechnungsempfänger</div>
                <div className="font-semibold text-sm text-slate-800">Weber Hausverwaltung GmbH</div>
                <div className="text-[11px] text-slate-400">Maximilianstraße 42, 80538 München</div>
              </div>

              {/* Line items */}
              <div className="px-4 sm:px-5 pt-4 pb-2">
                <div className="space-y-1">
                  {([
                    { desc: "Elektroinstallation – Stundenlohn", menge: "8 Std", preis: "680,00\u00a0€", typ: "Arbeit" },
                    { desc: "Wanddose & Schalterdose montieren", menge: "3 Stk", preis: "135,00\u00a0€", typ: "Arbeit" },
                    { desc: "LED-Einbaustrahler (dimmbar)", menge: "12 Stk", preis: "336,00\u00a0€", typ: "Material" },
                  ] as { desc: string; menge: string; preis: string; typ: string }[]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <div>
                        <div className="text-xs font-medium text-slate-700">{item.desc}</div>
                        <div className="text-[10px] text-slate-400">{item.menge} · <span className={item.typ === "Arbeit" ? "text-brand-500" : "text-amber-500"}>{item.typ}</span></div>
                      </div>
                      <div className="font-semibold text-sm text-slate-800 tabular-nums ml-4">{item.preis}</div>
                    </div>
                  ))}
                </div>

                {/* Faded remaining rows */}
                <div className="relative">
                  <div className="opacity-25 select-none pointer-events-none space-y-1 pt-1">
                    {[
                      { desc: "Installationskabel NYM-J 3×1,5mm²", preis: "80,00\u00a0€" },
                      { desc: "Sicherungsautomat B16", preis: "88,00\u00a0€" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50">
                        <div className="text-xs font-medium text-slate-700">{item.desc}</div>
                        <div className="font-semibold text-sm text-slate-800">{item.preis}</div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
                </div>
              </div>

              {/* Total bar + CTA overlay */}
              <div className="relative px-4 sm:px-5 pt-2 pb-5 sm:pb-6 bg-white border-t border-slate-100">
                <div className="flex justify-end opacity-20 select-none pointer-events-none">
                  <div className="w-52 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500"><span>Netto</span><span>1.319,00\u00a0€</span></div>
                    <div className="flex justify-between text-slate-500"><span>MwSt 19%</span><span>250,61\u00a0€</span></div>
                    <div className="flex justify-between font-bold text-sm text-slate-900 border-t-2 border-slate-800 pt-1.5 mt-1">
                      <span>Brutto</span><span>1.569,61\u00a0€</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[2px]">
                  <button
                    onClick={onOpenModal}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all duration-200 shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Vollständige Rechnung ansehen
                    <ArrowIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center max-w-xs">
            Echtes PDF · alle §14 UStG-Pflichtangaben · Ihr Logo, Ihre Daten
          </p>
        </div>
      </div>
    </FadeIn>
  );
}
