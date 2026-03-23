"use client";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/60 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
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
          <div className="flex flex-wrap gap-8 sm:gap-16">
            {[
              { title: "Produkt", links: [
                { label: "Features", href: "/#features" },
                { label: "Preise", href: "/#preise" },
                { label: "Changelog", href: "/changelog" },
              ]},
              { title: "Rechtliches", links: [
                { label: "Impressum", href: "/impressum" },
                { label: "Datenschutz", href: "/datenschutz" },
                { label: "AGB", href: "/agb" },
              ]},
              { title: "Support", links: [
                { label: "Hilfe-Center", href: "/hilfe" },
                { label: "Kontakt", href: "/kontakt" },
                { label: "Status", href: "/status" },
              ]},
            ].map((col) => (
              <div key={col.title}>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mb-3">
                  {col.title}
                </div>
                <div className="space-y-2">
                  {col.links.map((link) => (
                    <a key={link.label} href={link.href} className="block text-xs text-slate-400 hover:text-slate-900 transition-colors">
                      {link.label}
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
  );
}
