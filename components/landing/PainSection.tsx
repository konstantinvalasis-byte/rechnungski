"use client";
import FadeIn from "@/components/ui/FadeIn";

const PAIN_POINTS = [
  {
    emoji: "🕐",
    title: "Samstags Rechnungen tippen",
    desc: "Word öffnen, Vorlage suchen, Positionen manuell eintippen, MwSt von Hand nachrechnen. Jede Woche dasselbe.",
    stat: "∅ 2–3 Std./Woche",
  },
  {
    emoji: "🧮",
    title: "Excel-Chaos mit Fehlerrisiko",
    desc: "Falsche Zelle überschrieben, falsche Steuer berechnet, falsche Rechnungsnummer. Ein Fehler kostet mehr als deine Miete.",
    stat: "§14-Fehler → Bußgeld",
  },
  {
    emoji: "💸",
    title: "Unbezahlte Verwaltungszeit",
    desc: "Zeit, die du nicht verrechnen kannst. Stunden, die du lieber auf der Baustelle oder mit der Familie verbringst.",
    stat: "∅ 10 Std./Monat verloren",
  },
];

export default function PainSection() {
  return (
    <FadeIn className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      {/* Subtiler Hintergrund-Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-900/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Headline */}
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-bold text-red-400 uppercase tracking-[0.14em] mb-3">
            Das kennt jeder Handwerker & Freelancer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Rechnungen schreiben kostet dich<br className="hidden sm:block" />{" "}
            <span className="text-red-400">Zeit, Nerven — und echtes Geld.</span>
          </h2>
          <p className="mt-5 text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Der durchschnittliche Selbstständige verliert{" "}
            <span className="text-slate-200 font-semibold">10 Stunden pro Monat</span> mit
            Buchhaltung und Rechnungsstellung. Stunden, die nicht auf der Rechnung stehen.
          </p>
        </div>

        {/* Pain Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {PAIN_POINTS.map((p) => (
            <div
              key={p.title}
              className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 hover:border-red-900/50 transition-colors duration-200 group"
            >
              <div className="text-3xl mb-4">{p.emoji}</div>
              <h3 className="font-bold text-white mb-2 text-sm leading-snug">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="inline-flex items-center gap-1.5 bg-red-950/60 border border-red-900/40 rounded-lg px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-red-300 text-[11px] font-semibold">{p.stat}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transition zur Lösung */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 border border-slate-700/60 rounded-2xl px-6 py-4">
            <span className="text-slate-300 text-sm">Das muss nicht so sein.</span>
            <span className="hidden sm:block text-slate-700">|</span>
            <span className="text-brand-400 text-sm font-semibold">
              RechnungsKI erledigt das in 2 Minuten — nicht 2 Stunden.
            </span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
