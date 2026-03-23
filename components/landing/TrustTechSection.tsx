"use client";
import FadeIn from "@/components/ui/FadeIn";

const TRUST_ITEMS = [
  {
    label: "Vercel Edge Network",
    desc: "Weltweit schnell",
    icon: (
      <svg viewBox="0 0 76 65" className="w-4 h-4 fill-current">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
    ),
  },
  {
    label: "Supabase EU-Frankfurt",
    desc: "Daten in Deutschland",
    icon: (
      <svg viewBox="0 0 109 113" className="w-4 h-4 fill-current">
        <path d="M63.708 110.284c-2.86 3.601-8.953 1.628-9.045-2.97l-1.338-57.814h38.33c6.957 0 10.84 8.12 6.454 13.395l-34.4 47.389z" />
        <path d="M45.317 2.071c2.86-3.601 8.953-1.628 9.045 2.97l1.338 57.814H17.37c-6.957 0-10.84-8.12-6.454-13.395l34.4-47.389z" />
      </svg>
    ),
  },
  {
    label: "AES-256 Verschlüsselt",
    desc: "Bankniveau-Sicherheit",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    label: "DSGVO-konform",
    desc: "Nach deutschem Recht",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Made in Germany",
    desc: "100% europäisch",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export default function TrustTechSection() {
  return (
    <FadeIn className="py-16 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.14em]">
            Infrastruktur & Sicherheit — auf dem Niveau großer SaaS-Anbieter
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 hover:border-slate-300 hover:bg-white transition-all duration-150"
            >
              <span className="text-slate-500 shrink-0">{item.icon}</span>
              <div>
                <div className="text-xs font-semibold text-slate-900 leading-tight">{item.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
