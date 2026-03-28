"use client";

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

export default function HeroSection({ email, setEmail, submitted, handleSubmit, onOpenMusterrechnung, onOpenLogin }: { email: string; setEmail: (v: string) => void; submitted: boolean; handleSubmit: () => void; onOpenMusterrechnung: () => void; onOpenLogin: () => void }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* #25: Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mesh-Gradients: mehrere überlappende radiale Gradienten */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 60% at 0% -10%, rgba(99,102,241,0.22) 0%, transparent 60%),
              radial-gradient(ellipse 70% 50% at 100% 110%, rgba(139,92,246,0.18) 0%, transparent 60%),
              radial-gradient(ellipse 55% 40% at 50% 85%, rgba(236,72,153,0.07) 0%, transparent 55%),
              radial-gradient(ellipse 45% 35% at 75% 15%, rgba(99,102,241,0.10) 0%, transparent 50%)
            `,
          }}
        />
        {/* Animierte Glow-Orbs */}
        <div
          className="absolute -top-20 right-[8%] w-[550px] h-[550px] rounded-full animate-pulse-soft"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute bottom-0 left-[3%] w-[420px] h-[420px] rounded-full animate-pulse-soft [animation-delay:1.8s]"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        {/* Noise-Textur Overlay */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
        {/* Dot-Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Links — Copy */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200/60 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-semibold text-brand-700 tracking-wide">
              Für Dienstleister · Handwerker · Freelancer
            </span>
          </div>

          {/* #24: Typografie mit clamp() + tighter tracking */}
          <h1
            className="font-black leading-[1.05] tracking-[-0.05em] text-slate-950"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            Professionelle
            <br />
            Rechnungen.
            <br />
            <span className="bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
              In unter 2 Minuten.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-md">
            Die Rechnungssoftware mit KI-Vorschlägen für 30+ Branchen. §14-konform, PDF-Export, DATEV-ready. Schluss mit Papierkram.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {!submitted ? (
              <>
                <input
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-100 transition-all w-full sm:w-64"
                />
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Kostenlos starten
                  <ArrowIcon />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 px-5 py-3.5 bg-success-50 border border-emerald-200 rounded-xl text-success-700 font-semibold text-sm animate-fade-up">
                <CheckIcon className="w-5 h-5 text-success-600" />
                Perfekt — check dein Postfach!
              </div>
            )}
          </div>

          {/* Trust Signals */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            {["Keine Kreditkarte", "5 Rechnungen gratis", "DSGVO-konform"].map((text) => (
              <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <CheckIcon className="w-3.5 h-3.5 text-success-500" />
                {text}
              </span>
            ))}
            <span className="text-slate-300/40 hidden sm:inline">·</span>
            <button
              onClick={onOpenLogin}
              className="text-xs text-slate-400 hover:text-brand-600 transition-colors font-medium underline underline-offset-2 decoration-slate-300 hover:decoration-brand-500"
            >
              Schon ein Konto? Anmelden
            </button>
          </div>

          <button
            onClick={onOpenMusterrechnung}
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 transition-colors group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span className="group-hover:underline underline-offset-2">Musterrechnung ansehen</span>
            <ArrowIcon />
          </button>

          {/* LP-01: Mobile Mockup — nur auf kleinen Screens sichtbar */}
          <div className="mt-10 md:hidden">
            <div className="relative mx-auto max-w-sm">
              {/* Glow */}
              <div
                className="absolute -inset-6 rounded-3xl blur-2xl"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,102,241,0.18) 0%, transparent 80%)" }}
              />
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/60 shadow-xl shadow-slate-950/40">
                {/* Schmale Titelleiste */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border-b border-slate-800/80">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/70" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                    <div className="w-2 h-2 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="text-[9px] text-slate-500 font-mono">app.rechnungski.de</span>
                  </div>
                </div>

                <div className="p-3 space-y-2.5">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "Umsatz", value: "€ 47.380", sub: "+12% ↑", border: "border-l-emerald-500", subColor: "text-emerald-400" },
                      { label: "Offen", value: "€ 5.240", sub: "3 offen", border: "border-l-amber-500", subColor: "text-amber-400" },
                      { label: "Kunden", value: "23", sub: "+2 neu", border: "border-l-brand-500", subColor: "text-brand-400" },
                    ].map((kpi) => (
                      <div key={kpi.label} className={`bg-slate-900/80 rounded-lg p-2 border-l-[3px] ${kpi.border}`}>
                        <div className="text-[7px] text-slate-500 uppercase tracking-wider">{kpi.label}</div>
                        <div className="text-[11px] font-bold text-slate-100 leading-tight mt-0.5">{kpi.value}</div>
                        <div className={`text-[7px] font-medium mt-0.5 ${kpi.subColor}`}>{kpi.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Rechnungsliste */}
                  <div className="rounded-xl overflow-hidden border border-slate-800/60">
                    <div className="px-2.5 py-1.5 bg-slate-800/40 border-b border-slate-800/60">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Letzte Rechnungen</span>
                    </div>
                    {[
                      { name: "Müller Bau GmbH", amount: "€ 3.480", status: "Bezahlt", color: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
                      { name: "Lisa Weber Design", amount: "€ 1.250", status: "Offen", color: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20" },
                      { name: "Berger Events", amount: "€ 890", status: "Überfällig", color: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20" },
                    ].map((row) => (
                      <div key={row.name} className="flex items-center justify-between py-2 px-2.5 border-b border-slate-800/40 last:border-0">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-slate-700/60 flex items-center justify-center text-[7px] font-bold text-slate-300">
                            {row.name.charAt(0)}
                          </div>
                          <span className="text-[10px] font-semibold text-slate-200">{row.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-400">{row.amount}</span>
                          <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${row.color}`}>{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2.5 py-1 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="text-[9px] font-bold text-white">§14 UStG-konform</span>
              </div>
            </div>
          </div>
        </div>

        {/* #21/#23: App-Mockup — ab md: sichtbar */}
        <div className="hidden md:flex justify-center">
          <div className="relative">
            {/* Glow hinter dem Mockup — stärker als vorher */}
            <div
              className="absolute -inset-10 rounded-3xl blur-3xl"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 50%, transparent 80%)",
              }}
            />
            {/* Zweiter Glow-Ring für Tiefe */}
            <div
              className="absolute -inset-4 rounded-2xl blur-xl opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)",
              }}
            />

            {/* Browser-Frame */}
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/50 w-full max-w-[480px] border border-slate-700/50 ring-1 ring-white/5">
              {/* Fensterleiste */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800/80">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-md border border-slate-700/40">
                    <svg className="w-3 h-3 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                    </svg>
                    <span className="text-[10px] text-slate-500 font-mono">app.rechnungski.de</span>
                    <svg className="w-2.5 h-2.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 space-y-3">
                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Umsatz", value: "€ 47.380", sub: "+12% ↑", borderColor: "border-l-emerald-500", subColor: "text-emerald-400" },
                    { label: "Offen", value: "€ 5.240", sub: "3 Rechnungen", borderColor: "border-l-amber-500", subColor: "text-amber-400" },
                    { label: "Kunden", value: "23", sub: "+2 neu", borderColor: "border-l-brand-500", subColor: "text-brand-400" },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`bg-slate-900/80 rounded-xl p-3 border-l-[3px] ${kpi.borderColor}`}>
                      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-medium">{kpi.label}</div>
                      <div className="text-sm font-bold text-slate-100 mt-0.5 leading-tight">{kpi.value}</div>
                      <div className={`text-[8px] font-medium mt-0.5 ${kpi.subColor}`}>{kpi.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Neue Rechnung Button */}
                <div className="flex items-center justify-between px-3 py-2 bg-brand-600/15 border border-brand-500/20 rounded-xl">
                  <span className="text-xs text-brand-300 font-semibold">Neue Rechnung</span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 rounded-lg shadow-lg shadow-brand-600/30">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className="text-[10px] text-white font-bold">Erstellen</span>
                  </div>
                </div>

                {/* Rechnungsliste */}
                <div className="rounded-xl overflow-hidden border border-slate-800/60">
                  <div className="px-3 py-2 bg-slate-800/40 border-b border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Letzte Rechnungen</span>
                    <span className="text-[9px] text-brand-400 font-semibold">Alle ansehen →</span>
                  </div>
                  {[
                    { name: "Müller Bau GmbH", amount: "€ 3.480", status: "Bezahlt", statusColor: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
                    { name: "Lisa Weber Design", amount: "€ 1.250", status: "Offen", statusColor: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20" },
                    { name: "Schmidt IT", amount: "€ 4.200", status: "Bezahlt", statusColor: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" },
                    { name: "Berger Events", amount: "€ 890", status: "Überfällig", statusColor: "bg-red-500/10 text-red-400 ring-1 ring-red-500/20" },
                  ].map((row, i) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-800/40 transition-colors group border-b border-slate-800/40 last:border-0"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-700/60 flex items-center justify-center text-[8px] font-bold text-slate-300">
                          {row.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{row.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{row.amount}</span>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Badge oben-rechts */}
            <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 animate-float">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white">§14 UStG-konform</span>
            </div>

            {/* Floating AI Badge unten-links */}
            <div className="absolute -bottom-3 -left-3 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700/50 rounded-full shadow-xl animate-float [animation-delay:1s]">
              <span className="text-[10px]">✨</span>
              <span className="text-[10px] font-semibold text-slate-200">KI-Preisvorschläge aktiv</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
