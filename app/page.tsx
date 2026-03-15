"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";

// ─── Data ────────────────────────────────────────────────
const BRANCHES = [
  { name: "Elektriker", icon: "⚡", gradient: "from-amber-100 to-amber-300" },
  { name: "Grafikdesign", icon: "🎨", gradient: "from-pink-100 to-pink-300" },
  { name: "Fotografie", icon: "📸", gradient: "from-indigo-100 to-indigo-300" },
  { name: "IT-Beratung", icon: "💻", gradient: "from-emerald-100 to-emerald-300" },
  { name: "Personal Training", icon: "💪", gradient: "from-red-100 to-red-300" },
  { name: "Catering", icon: "🍽️", gradient: "from-orange-100 to-orange-300" },
  { name: "Gartenbau", icon: "🌿", gradient: "from-green-100 to-green-300" },
  { name: "Massage", icon: "💆", gradient: "from-violet-100 to-violet-300" },
  { name: "Webentwicklung", icon: "🌐", gradient: "from-blue-100 to-blue-300" },
  { name: "DJ & Events", icon: "🎵", gradient: "from-fuchsia-100 to-fuchsia-300" },
  { name: "Reinigung", icon: "✨", gradient: "from-teal-100 to-teal-300" },
  { name: "+ 20 weitere", icon: "→", gradient: "from-slate-100 to-slate-300" },
];

const STEPS = [
  { title: "Branche wählen", desc: "30+ Branchen mit passenden KI-Preisen", icon: "🎯", color: "bg-brand-600" },
  { title: "Positionen hinzufügen", desc: "KI schlägt branchenübliche Preise vor", icon: "⚡", color: "bg-amber-500" },
  { title: "Vorschau prüfen", desc: "Professionelles Layout, §14-konform", icon: "👁️", color: "bg-success-600" },
  { title: "PDF exportieren", desc: "Download, drucken oder per Mail", icon: "📄", color: "bg-danger-500" },
];

const FEATURES = [
  { title: "§14 UStG-konform", desc: "Automatische Validierung aller Pflichtangaben." },
  { title: "Angebote → Rechnungen", desc: "Ein Klick konvertiert Angebote in Rechnungen." },
  { title: "DATEV CSV-Export", desc: "Im richtigen Format für deinen Steuerberater." },
  { title: "Material & Arbeit getrennt", desc: "Transparente Aufschlüsselung für Kunden." },
  { title: "3-Stufen-Mahnwesen", desc: "Professionelle Mahntexte, 1 Klick versenden." },
  { title: "Logo & Branding", desc: "Dein Logo auf jeder Rechnung." },
];

const FAQS = [
  { q: "Ist RechnungsKI §14 UStG-konform?", a: "Ja. Automatische Validierung aller Pflichtangaben: Name, Adresse, Steuernummer, fortlaufende Nummer, Datum, Steuersatz." },
  { q: "Für welche Branchen?", a: "30+ Branchen: Handwerk, IT, Kreativ, Beratung, Gesundheit, Events, Transport, Reinigung, Bildung und mehr." },
  { q: "DATEV-Export möglich?", a: "Ab dem Pro-Plan: 1-Klick CSV-Export im DATEV-Format." },
  { q: "Funktioniert es mobil?", a: "Ja. Vollständig responsive — auf jedem Gerät, jeder Bildschirmgröße." },
  { q: "Vertragsbindung?", a: "Nein. Monatlich kündbar. Jährlich sparst du 20%." },
  { q: "Was ist mit meinen Daten?", a: "DSGVO-konform, deutsche Server, keine Weitergabe an Dritte. Deine Daten gehören dir." },
];

const PLANS = [
  { name: "Free", price: 0, priceYearly: 0, desc: "Zum Ausprobieren", features: ["5 Rechnungen/Mo", "3 Kunden", "KI-Vorschläge", "MwSt-Automatik"] },
  { name: "Starter", price: 9.99, priceYearly: 7.99, desc: "Einzelunternehmer", features: ["50 Rechnungen", "25 Kunden", "Logo & Branding", "PDF-Export", "Angebote", "Material/Arbeit", "Rabattfunktion"], popular: true },
  { name: "Pro", price: 24.99, priceYearly: 19.99, desc: "Wachsende Betriebe", features: ["500 Rechnungen", "Unbegr. Kunden", "Alles aus Starter", "3-Stufen-Mahnung", "DATEV Export", "§14 Validierung"] },
  { name: "Enterprise", price: 49.99, priceYearly: 39.99, desc: "Teams & Agenturen", features: ["Unbegrenzt", "Multi-User", "API-Zugang", "DATEV direkt", "PDF-Mailversand", "Eigener Support"] },
];

// ─── Icons ───────────────────────────────────────────────
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

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Scroll-animated section ─────────────────────────────
function FadeIn({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((s) => (s + 1) % 4), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (email.includes("@")) {
      setSubmitted(true);
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ═══ NAVIGATION ═══ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/25" />
            <span className="text-lg font-extrabold tracking-tight">RechnungsKI</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">So geht&apos;s</a>
            <a href="#branchen" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Branchen</a>
            <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#preise" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Preise</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Anmelden
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5"
            >
              Kostenlos starten
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-4 space-y-3 animate-fade-in">
            {["So geht's", "Branchen", "Features", "Preise"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/[^a-z]/g, "")}`}
                className="block text-sm font-medium text-slate-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a href="/dashboard" className="block w-full text-center px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl mt-2">
              Kostenlos starten
            </a>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background art */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-brand-400/10 blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-violet-400/10 blur-3xl animate-pulse-soft [animation-delay:1.5s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-300/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-200/60 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-semibold text-brand-700 tracking-wide">
                Für Dienstleister · Handwerker · Freelancer
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.08] tracking-[-0.04em] text-slate-950">
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

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {["Keine Kreditkarte", "5 Rechnungen gratis", "DSGVO-konform"].map((text) => (
                <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <CheckIcon className="w-3.5 h-3.5 text-success-500" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right — App Mockup */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute -inset-8 bg-gradient-to-br from-brand-400/20 via-violet-400/10 to-transparent rounded-3xl blur-2xl" />

              <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl shadow-slate-950/40 w-full max-w-[460px] border border-slate-800/50">
                {/* Window bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="ml-3 px-3 py-1 bg-slate-800 rounded-md">
                    <span className="text-[10px] text-slate-500 font-mono">app.rechnungski.de</span>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-2 p-3">
                  {[
                    { label: "Umsatz", value: "€ 47.380", color: "border-l-emerald-500" },
                    { label: "Offen", value: "€ 5.240", color: "border-l-amber-500" },
                    { label: "Kunden", value: "23", color: "border-l-brand-500" },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`bg-slate-900/80 rounded-lg p-3 border-l-[3px] ${kpi.color}`}>
                      <div className="text-[9px] text-slate-500 uppercase tracking-wider font-medium">{kpi.label}</div>
                      <div className="text-base font-bold text-slate-100 mt-0.5">{kpi.value}</div>
                    </div>
                  ))}
                </div>

                {/* Table rows */}
                <div className="px-3 pb-3 space-y-0.5">
                  {[
                    { name: "Müller Bau GmbH", amount: "€ 3.480", status: "Bezahlt", statusColor: "bg-emerald-500/10 text-emerald-400" },
                    { name: "Lisa Weber Design", amount: "€ 1.250", status: "Offen", statusColor: "bg-amber-500/10 text-amber-400" },
                    { name: "Schmidt IT", amount: "€ 4.200", status: "Bezahlt", statusColor: "bg-emerald-500/10 text-emerald-400" },
                    { name: "Berger Events", amount: "€ 890", status: "Überfällig", statusColor: "bg-red-500/10 text-red-400" },
                  ].map((row) => (
                    <div key={row.name} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">{row.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-500">{row.amount}</span>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <FadeIn>
        <div className="border-y border-slate-100 bg-slate-50/50 py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 items-center">
              {[
                { value: "30+", label: "Branchen" },
                { value: "§14", label: "UStG-konform" },
                { value: "2 Min", label: "zur Rechnung" },
                { value: "DATEV", label: "Export-ready" },
                { value: "100%", label: "DSGVO-konform" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5 text-center">
                  <span className="text-xl font-extrabold text-brand-600">{stat.value}</span>
                  <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ═══ BRANCHEN ═══ */}
      <FadeIn id="branchen" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">30+ Branchen</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Eine App. Jede Branche.</h2>
            <p className="mt-3 text-slate-500 max-w-md mx-auto">
              Handwerk, IT, Kreativ, Gesundheit, Events — RechnungsKI kennt deine Preise.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {BRANCHES.map((branch) => (
              <div
                key={branch.name}
                className={`group relative bg-gradient-to-br ${branch.gradient} rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer border border-transparent hover:border-white/60 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{branch.icon}</span>
                <span className="text-sm font-bold text-slate-700">{branch.name}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ═══ HOW IT WORKS ═══ */}
      <FadeIn id="how" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
            <div className="text-center mb-10">
              <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">So funktioniert&apos;s</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">4 Schritte. 2 Minuten. Fertig.</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Steps */}
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
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 ${
                        activeStep === i ? `${step.color} text-white shadow-lg` : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {activeStep === i ? step.icon : i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{step.title}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{step.desc}</div>
                    </div>
                    {activeStep === i && (
                      <div className={`absolute bottom-0 left-0 h-0.5 ${step.color} animate-bar-fill`} />
                    )}
                  </button>
                ))}
              </div>

              {/* Demo Preview */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-slate-950 rounded-2xl p-6 min-h-[280px] shadow-xl shadow-slate-950/10 border border-slate-800/50">
                  {activeStep === 0 && (
                    <div className="animate-fade-in">
                      <div className="text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-4">Branche wählen</div>
                      <div className="grid grid-cols-3 gap-2">
                        {BRANCHES.slice(0, 6).map((b, i) => (
                          <div
                            key={b.name}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                              i === 0
                                ? "border-brand-500 bg-brand-500/10 text-brand-200"
                                : "border-slate-800 bg-slate-900 text-slate-500 hover:border-slate-700"
                            }`}
                          >
                            <span className="text-xl">{b.icon}</span>
                            <span className="text-[11px] font-medium">{b.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeStep === 1 && (
                    <div className="animate-fade-in">
                      <div className="text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-4">KI-Vorschläge: Webdesign</div>
                      <div className="space-y-2">
                        {[
                          ["Website (One-Pager)", "1.500 €"],
                          ["WordPress Setup", "800 €"],
                          ["Wartung/Monat", "120 €"],
                        ].map(([name, price], i) => (
                          <div
                            key={name}
                            className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 text-sm text-slate-200 animate-slide-right"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <span>{name}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold font-mono text-xs text-brand-300">{price}</span>
                              <span className="text-[10px] text-brand-400 font-semibold">+ Hinzufügen</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className="animate-fade-in">
                      <div className="text-[11px] font-bold text-brand-400 uppercase tracking-widest mb-4">Rechnungsvorschau</div>
                      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="h-2 w-16 bg-slate-700 rounded" />
                            <div className="h-2 w-24 bg-slate-800 rounded mt-1.5" />
                          </div>
                          <span className="text-base font-extrabold text-brand-400">RECHNUNG</span>
                        </div>
                        <div className="h-px bg-slate-800 my-3" />
                        {[
                          ["Website erstellen", "1.500,00 €"],
                          ["WordPress Setup", "800,00 €"],
                          ["Wartung (1 Mo.)", "120,00 €"],
                        ].map(([desc, amount]) => (
                          <div key={desc} className="flex justify-between py-1.5 text-xs">
                            <span className="text-slate-300">{desc}</span>
                            <span className="font-semibold text-slate-200">{amount}</span>
                          </div>
                        ))}
                        <div className="flex justify-between mt-3 pt-3 border-t-2 border-slate-700 text-sm font-extrabold text-brand-400">
                          <span>Gesamt (brutto)</span>
                          <span>2.879,80 €</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div className="animate-fade-in flex flex-col items-center justify-center py-8 gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-success-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CheckIcon className="w-7 h-7 text-white" />
                      </div>
                      <span className="font-bold text-lg text-slate-100">PDF bereit zum Download</span>
                      <button className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25">
                        Herunterladen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ═══ FEATURES ═══ */}
      <FadeIn id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Alles was du brauchst</h2>
          </div>

          {/* Hero Features */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Mobile Feature */}
            <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-brand-50 via-violet-50 to-brand-100 flex items-center justify-center relative overflow-hidden">
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
                <h3 className="text-lg font-bold mb-1.5">Mobil-optimiert</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Erstelle Rechnungen auf der Baustelle, im Café oder zwischen zwei Terminen. Jedes Gerät, jede Größe.
                </p>
              </div>
            </div>

            {/* AI Feature */}
            <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex flex-col items-center justify-center gap-2 px-8">
                {[
                  { dot: "bg-emerald-500", name: "Website erstellen", price: "1.500 €" },
                  { dot: "bg-brand-500", name: "Logo-Design", price: "500 €" },
                  { dot: "bg-amber-500", name: "Wartung/Monat", price: "120 €" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 w-full px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-xl text-xs font-medium">
                    <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                    <span className="text-slate-700">{item.name}</span>
                    <span className="ml-auto font-bold font-mono text-brand-600">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1.5">KI-Preisvorschläge</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Wähle deine Branche — die KI kennt Preise, Einheiten und Positionen. Ein Klick, fertig.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/30 transition-all duration-300"
              >
                <h4 className="font-bold text-sm mb-1 group-hover:text-brand-600 transition-colors">{feature.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ═══ BEFORE / AFTER ═══ */}
      <FadeIn className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
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
                  <span className="absolute bottom-2 right-4 text-xl">✏️</span>
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

      {/* ═══ PRICING ═══ */}
      <FadeIn id="preise" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">Preise</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Einfach. Fair. Transparent.</h2>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 mt-6 border border-slate-200/60">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  billing === "monthly" ? "bg-brand-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Monatlich
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  billing === "yearly" ? "bg-brand-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Jährlich
                <span className="ml-1.5 text-[10px] font-bold text-emerald-500">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    {billing === "yearly" ? plan.priceYearly : plan.price}€
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
                  href="/dashboard"
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
        </div>
      </FadeIn>

      {/* ═══ FAQ ═══ */}
      <FadeIn className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Häufige Fragen</h2>
          </div>
          <div className="divide-y divide-slate-200/80">
            {FAQS.map((faq, i) => (
              <div key={faq.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown open={openFaq === i} />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    openFaq === i ? "max-h-40 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-brand-950">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-violet-600/20 blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
            Bereit loszulegen?
          </h2>
          <p className="text-brand-200 text-base mb-8">
            Kostenlos starten. Keine Kreditkarte. 30 Sekunden Setup.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 text-base font-bold rounded-2xl hover:bg-brand-50 transition-all duration-200 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Jetzt kostenlos starten
            <ArrowIcon />
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-200/60 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700" />
                <span className="text-sm font-extrabold tracking-tight">RechnungsKI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                KI-Rechnungssoftware für Dienstleister, Handwerker und Freelancer im DACH-Raum.
              </p>
            </div>
            <div className="flex gap-16">
              {[
                { title: "Produkt", links: ["Features", "Preise", "Changelog"] },
                { title: "Rechtliches", links: ["Impressum", "Datenschutz", "AGB"] },
                { title: "Support", links: ["Hilfe-Center", "Kontakt", "Status"] },
              ].map((col) => (
                <div key={col.title}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-3">
                    {col.title}
                  </div>
                  <div className="space-y-2">
                    {col.links.map((link) => (
                      <a key={link} className="block text-xs text-slate-400 hover:text-slate-900 transition-colors cursor-pointer">
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 py-6">
          <p className="text-center text-[11px] text-slate-300">
            © 2026 RechnungsKI · Made in Deutschland
          </p>
        </div>
      </footer>
    </div>
  );
}
