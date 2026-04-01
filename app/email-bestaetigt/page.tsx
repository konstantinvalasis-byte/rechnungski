import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-Mail bestätigt – RechnungsKI',
  description: 'Deine E-Mail-Adresse wurde erfolgreich bestätigt.',
}

export default function EmailBestaetigt() {
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
      {/* Hintergrund-Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-brand-800/6 rounded-full blur-[100px]" />
        {/* Grüner Glow passend zur Bestätigung */}
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-success-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[400px] text-center relative animate-fade-up">
        {/* Check-Icon mit Ring-Animation */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          {/* Äußerer Ring */}
          <div className="absolute inset-0 rounded-full border border-success-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          {/* Mittlerer Ring */}
          <div className="absolute inset-1 rounded-full border border-success-500/15" />
          {/* Icon-Container */}
          <div className="absolute inset-2 bg-gradient-to-br from-success-500/20 to-success-600/10 border border-success-500/30 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.3)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">RechnungsKI</span>
        </div>

        {/* Titel & Text */}
        <h1 className="text-[24px] font-bold text-white tracking-tight mb-3">
          E-Mail bestätigt!
        </h1>
        <p className="text-[14px] text-slate-400 leading-relaxed mb-2">
          Dein Konto ist jetzt aktiv und bereit.
        </p>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-10">
          Melde dich an, um loszulegen.
        </p>

        {/* CTA */}
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-3 rounded-xl text-[14px] transition-all duration-200 hover:shadow-[0_0_28px_rgba(99,102,241,0.4)] hover:-translate-y-[1px] active:translate-y-0"
        >
          Jetzt anmelden
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {/* Hinweis */}
        <p className="text-[11px] text-slate-600 mt-6">
          Du wirst nicht automatisch eingeloggt — deine Sicherheit hat Priorität.
        </p>
      </div>
    </div>
  )
}
