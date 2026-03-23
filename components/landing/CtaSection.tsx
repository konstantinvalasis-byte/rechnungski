"use client";

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function CtaSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-brand-950">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-violet-600/20 blur-3xl" />
      </div>
      <div className="relative z-10 text-center max-w-xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
          Deine erste Rechnung in 90 Sekunden.
          <br className="hidden sm:block" /> Jetzt — kostenlos.
        </h2>
        <p className="text-brand-200 text-base mb-8">
          Schon 847 Handwerker haben sich angemeldet. Keine Kreditkarte. Kein Risiko.
        </p>
        <a
          href="/registrieren"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-4 bg-white text-brand-700 text-base font-bold rounded-2xl hover:bg-brand-50 transition-all duration-200 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5"
        >
          Jetzt kostenlos starten
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
