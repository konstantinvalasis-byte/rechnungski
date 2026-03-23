"use client";
import Link from "next/link";

interface Props {
  show: boolean;
  onClose: () => void;
  loginEmail: string;
  setLoginEmail: (v: string) => void;
  loginPasswort: string;
  setLoginPasswort: (v: string) => void;
  loginLaden: boolean;
  loginFehler: string;
  handleLogin: (e: React.FormEvent) => void;
}

export default function LoginModal({
  show, onClose,
  loginEmail, setLoginEmail,
  loginPasswort, setLoginPasswort,
  loginLaden, loginFehler,
  handleLogin,
}: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[400px] animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hintergrund-Glow */}
        <div className="absolute top-[-30%] left-[10%] w-[300px] h-[300px] bg-brand-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[5%] w-[250px] h-[250px] bg-brand-800/8 rounded-full blur-[60px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          aria-label="Schließen"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="13" y2="17"/>
            </svg>
          </div>
          <span className="text-[18px] font-bold text-white tracking-tight">RechnungsKI</span>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.5)]">
          <h2 className="text-[22px] font-bold text-white tracking-tight mb-1">Willkommen zurück</h2>
          <p className="text-[13px] text-slate-500 mb-6">Melde dich in deinem Konto an</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Honeypot */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5 tracking-wide uppercase">E-Mail</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="max@beispiel.de"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-medium text-slate-400 tracking-wide uppercase">Passwort</label>
                <Link href="/passwort-vergessen" className="text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
                  Vergessen?
                </Link>
              </div>
              <input
                type="password"
                required
                value={loginPasswort}
                onChange={e => setLoginPasswort(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200"
              />
            </div>

            {loginFehler && (
              <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 rounded-xl px-3.5 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger-400 shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="text-danger-400 text-[12px]">{loginFehler}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLaden}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all duration-200 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-1 cursor-pointer"
            >
              {loginLaden ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Anmelden…
                </>
              ) : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-[12px] mt-5">
          Noch kein Konto?{' '}
          <Link href="/registrieren" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Kostenlos registrieren
          </Link>
        </p>
      </div>
    </div>
  );
}
