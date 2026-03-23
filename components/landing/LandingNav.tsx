"use client";

export default function LandingNav({ scrolled, mobileMenuOpen, setMobileMenuOpen, onLoginClick }: { scrolled: boolean; mobileMenuOpen: boolean; setMobileMenuOpen: (v: boolean) => void; onLoginClick: () => void }) {
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
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
          <button
            onClick={onLoginClick}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
          >
            Anmelden
          </button>
          <a
            href="/registrieren"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all duration-200 shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5"
          >
            <span className="relative flex items-center justify-center w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
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
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 sm:px-6 py-4 space-y-3 animate-fade-in">
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
          <button
            onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
            className="block w-full text-center px-5 py-2 text-slate-600 text-sm font-medium"
          >
            Anmelden
          </button>
          <a href="/dashboard" className="block w-full text-center px-5 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl mt-1">
            Kostenlos starten
          </a>
        </div>
      )}
    </nav>
  );
}
