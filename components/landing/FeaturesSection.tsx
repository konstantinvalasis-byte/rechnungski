"use client";
import FadeIn from "@/components/ui/FadeIn";
import { FEATURES } from "@/lib/landing-data";
import { Scale, ArrowRightLeft, FileSpreadsheet, Hammer, Bell, Palette } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Icon-Mapping für die Feature-Karten
const FEATURE_META: Record<string, { icon: LucideIcon; bg: string; text: string }> = {
  "§14 UStG-konform":           { icon: Scale,           bg: "bg-brand-50",   text: "text-brand-600" },
  "Angebote → Rechnungen":      { icon: ArrowRightLeft,  bg: "bg-violet-50",  text: "text-violet-600" },
  "DATEV CSV-Export":            { icon: FileSpreadsheet, bg: "bg-emerald-50", text: "text-emerald-600" },
  "Material & Arbeit getrennt":  { icon: Hammer,          bg: "bg-amber-50",   text: "text-amber-600" },
  "3-Stufen-Mahnwesen":          { icon: Bell,            bg: "bg-red-50",     text: "text-red-600" },
  "Logo & Branding":             { icon: Palette,         bg: "bg-pink-50",    text: "text-pink-600" },
};

export default function FeaturesSection() {
  return (
    <FadeIn id="features" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Alles was du brauchst</h2>
        </div>

        {/* Hero Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Mobile Feature */}
          <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 hover:border-slate-300/60">
            <div className="h-48 bg-gradient-to-br from-brand-50 via-violet-50 to-brand-100 flex items-center justify-center relative overflow-hidden">
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-100/0 to-violet-100/0 group-hover:from-brand-100/40 group-hover:to-violet-100/30 transition-all duration-500" />
              <div className="relative animate-float">
                <div className="w-20 bg-slate-950 rounded-2xl border-2 border-slate-800 p-2.5 space-y-1.5">
                  <div className="h-1.5 bg-slate-700 rounded-full" />
                  <div className="flex gap-1">
                    <div className="flex-1 bg-slate-900 rounded border-l-2 border-emerald-500 p-1.5">
                      <span className="text-[7px] font-bold text-slate-200">€12k</span>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded border-l-2 border-amber-500 p-1.5">
                      <span className="text-[7px] font-bold text-slate-200">€2k</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full" />
                  <div className="h-1.5 bg-slate-900 rounded-full w-3/4" />
                  <div className="h-1.5 bg-slate-900 rounded-full w-1/2" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-1.5 group-hover:text-brand-700 transition-colors duration-200">Mobil-optimiert</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Erstelle Rechnungen auf der Baustelle, im Café oder zwischen zwei Terminen. Jedes Gerät, jede Größe.
              </p>
            </div>
          </div>

          {/* AI Feature */}
          <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 hover:border-slate-300/60">
            <div className="h-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex flex-col items-center justify-center gap-2 px-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/0 to-cyan-100/0 group-hover:from-blue-100/40 group-hover:to-cyan-100/30 transition-all duration-500" />
              {[
                { dot: "bg-emerald-500", name: "Website erstellen", price: "1.500 €" },
                { dot: "bg-brand-500", name: "Logo-Design", price: "500 €" },
                { dot: "bg-amber-500", name: "Wartung/Monat", price: "120 €" },
              ].map((item) => (
                <div key={item.name} className="relative flex items-center gap-3 w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-xl text-xs font-medium group-hover:bg-white/90 transition-colors duration-300">
                  <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                  <span className="text-slate-700">{item.name}</span>
                  <span className="ml-auto font-bold font-mono text-brand-600">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-1.5 group-hover:text-brand-700 transition-colors duration-200">KI-Preisvorschläge</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Wähle deine Branche — die KI kennt Preise, Einheiten und Positionen. Ein Klick, fertig.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid — mit Icons und Micro-Interactions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feature) => {
            const meta = FEATURE_META[feature.title];
            const Icon = meta?.icon;
            return (
              <div
                key={feature.title}
                className="group relative p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-200/80 hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient-Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-violet-50/0 group-hover:from-brand-50/60 group-hover:to-violet-50/30 transition-all duration-500 rounded-2xl" />

                <div className="relative flex items-start gap-3">
                  {Icon && (
                    <div className={`shrink-0 w-8 h-8 rounded-lg ${meta.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`w-4 h-4 ${meta.text}`} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm mb-1 group-hover:text-brand-700 transition-colors duration-200">{feature.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>

                {/* Arrow hint bei Hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                  <svg className={`w-3.5 h-3.5 ${meta?.text ?? "text-brand-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
