'use client'

import { useState, Suspense } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginFormular() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlFehler = searchParams.get('fehler')
  const [email, setEmail] = useState('')
  const [passwort, setPasswort] = useState('')
  const [laden, setLaden] = useState(false)
  const [fehler, setFehler] = useState('')

  const systemFehlerText = urlFehler === 'bestaetigung'
    ? 'E-Mail-Bestätigung fehlgeschlagen. Bitte fordere einen neuen Bestätigungslink an oder versuche es erneut.'
    : null

  async function anmelden(e: React.FormEvent) {
    e.preventDefault()
    setFehler('')
    setLaden(true)

    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password: passwort })

    if (error) {
      setFehler('E-Mail oder Passwort falsch.')
      setLaden(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
      {/* Hintergrund-Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-brand-800/6 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[400px] relative">
        {/* Zurück zur Startseite */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300 transition-colors mb-8 group"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Zurück zur Startseite
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
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
        <div className="bg-[#0d0d22] md:bg-white/[0.03] border border-white/[0.12] md:border-white/[0.08] rounded-2xl p-7 md:backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.5)] md:shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.4)]">
          <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Willkommen zurück</h1>
          <p className="text-[13px] text-slate-500 mb-6">Melde dich in deinem Konto an</p>

          {systemFehlerText && (
            <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 rounded-xl px-3.5 py-2.5 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger-400 shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span className="text-danger-400 text-[12px]">{systemFehlerText}</span>
            </div>
          )}

          <form onSubmit={anmelden} className="flex flex-col gap-4">
            {/* Honeypot */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5 tracking-wide uppercase">E-Mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="max@beispiel.de"
                className="w-full bg-white/[0.08] border border-white/[0.18] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200"
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
                value={passwort}
                onChange={e => setPasswort(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.08] border border-white/[0.18] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-500 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200"
              />
            </div>

            {fehler && (
              <div className="flex items-center gap-2 bg-danger-500/10 border border-danger-500/20 rounded-xl px-3.5 py-2.5 animate-error-shake">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger-400 shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="text-danger-400 text-[12px]">{fehler}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={laden}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold py-2.5 rounded-xl text-[13px] transition-all duration-200 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:-translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-1 cursor-pointer"
            >
              {laden ? (
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
  )
}

export default function LoginSeite() {
  return (
    <Suspense>
      <LoginFormular />
    </Suspense>
  )
}
