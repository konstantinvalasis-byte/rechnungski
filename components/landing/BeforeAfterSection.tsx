"use client";
import FadeIn from "@/components/ui/FadeIn";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function BeforeAfterSection() {
  return (
    <FadeIn className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-3xl p-5 sm:p-8 md:p-12 border border-slate-100">
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">Warum wechseln?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Vorher vs. Nachher</h2>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
            {/* Before */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
              <div className="h-28 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center relative mb-5">
                <div className="w-12 h-16 bg-white border border-red-200 rounded shadow-sm absolute -rotate-3" />
                <div className="w-12 h-16 bg-white border border-red-200 rounded shadow-sm absolute rotate-6 left-1/2 ml-2" />
                {/* Chaotische Dokument-Illustration */}
                <svg className="absolute bottom-2 right-3 w-8 h-8 text-red-300/70" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" transform="rotate(-8 4 2)" />
                  <line x1="7" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-8 7 8)" />
                  <line x1="7" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-8 7 12)" />
                  <rect x="13" y="10" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" transform="rotate(6 13 10)" />
                  <line x1="16" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(6 16 16)" />
                  <line x1="16" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform="rotate(6 16 20)" />
                </svg>
              </div>
              <h3 className="font-bold text-base mb-3">Ohne RechnungsKI</h3>
              <ul className="space-y-2">
                {["Samstags 2-3 Stunden Rechnungen", "Word-Vorlage, manuell tippen", "MwSt von Hand ausrechnen", "Excel für alles", "Unsicher ob §14-konform"].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-slate-500">
                    <span className="text-red-500 font-bold mt-0.5 text-xs shrink-0">✗</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/25">
                <ArrowIcon />
              </div>
            </div>
            <div className="flex md:hidden items-center justify-center py-1">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-600/25 rotate-90">
                <ArrowIcon />
              </div>
            </div>

            {/* After */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200/60 shadow-sm ring-1 ring-emerald-100/50">
              <div className="h-28 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center relative mb-5">
                <div className="animate-float">
                  <div className="w-16 bg-slate-950 rounded-xl p-2 space-y-1">
                    <div className="h-1 bg-slate-700 rounded-full" />
                    <div className="h-1.5 bg-slate-900 rounded-full" />
                    <div className="h-1.5 bg-slate-900 rounded-full w-3/4" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-4 w-7 h-7 rounded-full bg-success-600 flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-base mb-3 text-success-700">Mit RechnungsKI</h3>
              <ul className="space-y-2">
                {["2 Minuten, fertig", "KI schlägt Positionen vor", "MwSt automatisch", "Ein Dashboard für alles", "§14-Validierung warnt"].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-slate-900 font-medium">
                    <span className="text-success-600 mt-0.5 shrink-0">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
