"use client";
import FadeIn from "@/components/ui/FadeIn";
import { BRANCHES, STEPS } from "@/lib/landing-data";
import { Target, Zap, Eye, FileText } from "lucide-react";

const STEP_ICONS = [Target, Zap, Eye, FileText];

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Schritt 0: Branche wählen ─── */
function PreviewBranche() {
  return (
    <div className="animate-fade-in">
      {/* App-Chrome */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 bg-slate-800 rounded-md px-3 py-1 text-[11px] text-slate-500 font-mono truncate">
          rechnungski.de/onboarding
        </div>
      </div>
      {/* Inhalt */}
      <div className="text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-1">Schritt 1 / 4</div>
      <div className="text-slate-200 text-sm font-semibold mb-4">Welche Branche passt zu dir?</div>
      <div className="grid grid-cols-3 gap-2">
        {BRANCHES.slice(0, 9).map((b, i) => {
          const BIcon = b.icon;
          const isSelected = i === 0;
          return (
            <div
              key={b.name}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-brand-500 bg-brand-500/15 ring-1 ring-brand-500/30"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <BIcon
                className={`w-4 h-4 stroke-[1.75] ${isSelected ? "text-brand-300" : "text-slate-500"}`}
              />
              <span className={`text-[10px] font-medium text-center leading-tight ${isSelected ? "text-brand-200" : "text-slate-500"}`}>
                {b.name}
              </span>
            </div>
          );
        })}
      </div>
      <button className="mt-4 w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl py-2.5 transition-colors shadow-lg shadow-brand-600/20">
        Weiter →
      </button>
    </div>
  );
}

/* ─── Schritt 1: KI-Positionen ─── */
function PreviewKI() {
  const positionen = [
    { name: "Elektroinstallation (8h)", preis: "960,00 €", ki: true },
    { name: "Material & Kabel", preis: "184,50 €", ki: true },
    { name: "Sicherungskasten tauschen", preis: "320,00 €", ki: true },
    { name: "Anfahrtspauschale", preis: "45,00 €", ki: false },
  ];
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 bg-slate-800 rounded-md px-3 py-1 text-[11px] text-slate-500 font-mono truncate">
          rechnungski.de/rechnung/neu
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-slate-200 text-sm font-semibold">Positionen hinzufügen</div>
          <div className="text-[11px] text-brand-400 mt-0.5">✨ KI schlägt Branchenpreise vor</div>
        </div>
        <span className="text-[10px] bg-brand-900/60 text-brand-300 border border-brand-800 rounded-full px-2.5 py-1 font-semibold">Elektriker</span>
      </div>
      <div className="space-y-1.5">
        {positionen.map((p, i) => (
          <div
            key={p.name}
            className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800 animate-slide-right"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-2 min-w-0">
              {p.ki && (
                <span className="shrink-0 w-4 h-4 rounded bg-brand-900/80 border border-brand-800 flex items-center justify-center">
                  <span className="text-[9px] text-brand-400">KI</span>
                </span>
              )}
              <span className="text-slate-300 text-[11px] truncate">{p.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-brand-300 font-bold font-mono text-[11px]">{p.preis}</span>
              <span className="text-[10px] text-emerald-400 font-semibold cursor-pointer">+ Add</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        <div className="flex-1 h-px bg-slate-800" />
        <span>oder eigene Position eingeben</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>
    </div>
  );
}

/* ─── Schritt 2: Rechnungsvorschau ─── */
function PreviewRechnung() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 bg-slate-800 rounded-md px-3 py-1 text-[11px] text-slate-500 font-mono truncate">
          rechnungski.de/vorschau
        </div>
        <div className="flex items-center gap-1 bg-emerald-900/40 border border-emerald-800/60 rounded-md px-2 py-0.5">
          <CheckIcon className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] text-emerald-400 font-semibold">§14-konform</span>
        </div>
      </div>
      {/* Rechnungs-Mockup */}
      <div className="bg-white rounded-xl p-4 text-slate-900">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-bold text-[11px] text-slate-900">Max Mustermann</div>
            <div className="text-[10px] text-slate-400 leading-relaxed">
              Musterstr. 1 · 12345 Berlin<br />
              St.-Nr. 123/456/7890
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-brand-700 tracking-wide">RECHNUNG</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Nr. 2024-0042</div>
            <div className="text-[10px] text-slate-400">15.03.2024</div>
          </div>
        </div>
        <div className="h-px bg-slate-200 my-2.5" />
        {[
          ["Elektroinstallation (8h)", "960,00 €"],
          ["Material & Kabel", "184,50 €"],
          ["Sicherungskasten", "320,00 €"],
          ["Anfahrt", "45,00 €"],
        ].map(([desc, amount]) => (
          <div key={desc} className="flex justify-between py-1 text-[10px]">
            <span className="text-slate-600">{desc}</span>
            <span className="font-semibold text-slate-800">{amount}</span>
          </div>
        ))}
        <div className="h-px bg-slate-200 my-2" />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Netto</span><span>1.268,48 €</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
          <span>MwSt. 19%</span><span>241,02 €</span>
        </div>
        <div className="flex justify-between mt-1.5 pt-1.5 border-t-2 border-slate-200 text-xs font-black text-brand-700">
          <span>Gesamt (brutto)</span>
          <span>1.509,50 €</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Schritt 3: PDF-Export ─── */
function PreviewPDF() {
  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 bg-slate-800 rounded-md px-3 py-1 text-[11px] text-slate-500 font-mono truncate">
          rechnungski.de/rechnung/2024-0042
        </div>
      </div>

      {/* Erfolgs-State */}
      <div className="flex flex-col items-center justify-center py-4 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-600/30">
            <CheckIcon className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 border-2 border-slate-950 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">PDF</span>
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold text-slate-100 text-sm">Rechnung 2024-0042</div>
          <div className="text-slate-400 text-[11px] mt-0.5">Erstellt in 1:43 min · 1.509,50 € · §14-konform</div>
        </div>

        {/* Aktions-Buttons */}
        <div className="flex gap-2 w-full">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 text-white text-[11px] font-semibold rounded-xl py-2.5 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            PDF laden
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 text-slate-200 text-[11px] font-semibold rounded-xl py-2.5 hover:bg-slate-700 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Per Mail senden
          </button>
        </div>

        {/* Status-Zeile */}
        <div className="w-full bg-slate-900 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Zahlungsstatus</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Offen · Fällig 29.03.2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = [PreviewBranche, PreviewKI, PreviewRechnung, PreviewPDF];

export default function HowItWorksSection({
  activeStep,
  setActiveStep,
}: {
  activeStep: number;
  setActiveStep: (s: number) => void;
}) {
  const ActivePreview = PREVIEWS[activeStep];

  return (
    <FadeIn id="how" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-3xl p-5 sm:p-8 md:p-12 border border-slate-100">
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">
              So funktioniert&apos;s
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">4 Schritte. 2 Minuten. Fertig.</h2>
            <p className="mt-3 text-slate-500 text-sm max-w-md mx-auto">
              Klick auf einen Schritt und sieh das echte Produkt in Aktion.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Step-Buttons */}
            <div className="space-y-2">
              {STEPS.map((step, i) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 relative overflow-hidden ${
                    activeStep === i
                      ? "bg-white shadow-md shadow-slate-200/50 border border-slate-200/80"
                      : "hover:bg-white/60 border border-transparent"
                  }`}
                >
                  {/* Schritt-Nummer / Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 ${
                      activeStep === i ? `${step.color} text-white shadow-lg` : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {activeStep === i ? (() => { const Icon = STEP_ICONS[i]; return <Icon className="w-4 h-4" />; })() : i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{step.title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{step.desc}</div>
                  </div>

                  {/* Zeitanzeige */}
                  {activeStep === i && (
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">~30 Sek.</span>
                  )}

                  {/* Fortschrittsbalken */}
                  {activeStep === i && (
                    <div className={`absolute bottom-0 left-0 h-0.5 ${step.color} animate-bar-fill`} />
                  )}
                </button>
              ))}

              {/* Gesamt-CTA unter den Steps */}
              <div className="pt-3">
                <a
                  href="/registrieren"
                  className="flex items-center justify-center gap-2 w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl py-3 transition-colors shadow-lg shadow-brand-600/20"
                >
                  Jetzt selbst ausprobieren — kostenlos
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Produkt-Vorschau / Browser-Mockup */}
            <div className="lg:sticky lg:top-24">
              {/* Browser-Frame */}
              <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/20 border border-slate-800/60 ring-1 ring-white/5">
                {/* Browser-Topbar */}
                <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center gap-2">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  </div>
                  {/* Schritt-Tabs */}
                  <div className="flex gap-1 flex-1 justify-center">
                    {STEPS.map((s, i) => (
                      <button
                        key={s.title}
                        onClick={() => setActiveStep(i)}
                        className={`text-[10px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                          activeStep === i
                            ? "bg-slate-700 text-slate-200"
                            : "text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-600 shrink-0 font-mono">●</div>
                </div>

                {/* Inhalt */}
                <div className="p-4 sm:p-5 min-h-[320px] sm:min-h-[340px]">
                  <ActivePreview key={activeStep} />
                </div>
              </div>

              {/* Unter-Mockup: Beweis-Zeile */}
              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckIcon className="w-3 h-3 text-emerald-500" />
                  DSGVO-konform
                </span>
                <span className="flex items-center gap-1">
                  <CheckIcon className="w-3 h-3 text-emerald-500" />
                  §14 UStG validiert
                </span>
                <span className="flex items-center gap-1">
                  <CheckIcon className="w-3 h-3 text-emerald-500" />
                  Keine Kreditkarte nötig
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
