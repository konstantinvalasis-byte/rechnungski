'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function PasswortVergessenSeite() {
  const [email, setEmail] = useState('')
  const [laden, setLaden] = useState(false)
  const [gesendet, setGesendet] = useState(false)
  const [fehler, setFehler] = useState('')

  async function zuruecksetzen(e: React.FormEvent) {
    e.preventDefault()
    setFehler('')
    setLaden(true)

    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (error) {
      setFehler('Fehler beim Senden der E-Mail. Bitte versuche es erneut.')
      setLaden(false)
      return
    }

    setGesendet(true)
  }

  if (gesendet) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-brand-800/6 rounded-full blur-[100px]" />
        </div>
        <div className="w-full max-w-[400px] text-center relative animate-fade-up">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-brand-400">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-white mb-3 tracking-tight">E-Mail gesendet</h1>
          <p className="text-[13px] text-slate-400 leading-relaxed mb-2">
            Wir haben eine E-Mail an <span className="text-white font-medium">{email}</span> gesendet.
          </p>
          <p className="text-[13px] text-slate-400 leading-relaxed mb-8">
            Klicke auf den Link darin, um dein Passwort zurückzusetzen.
          </p>
          <p className="text-[11px] text-slate-600 mb-8">
            Keine Mail erhalten? Schau auch im Spam-Ordner nach.
          </p>
          <Link
            href="/login"
            className="text-[13px] text-brand-400 hover:text-brand-300 transition-colors font-medium"
          >
            ← Zurück zum Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
      {/* Hintergrund-Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-brand-800/6 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[400px] relative">
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
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-sm shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_48px_rgba(0,0,0,0.4)]">
          <div className="w-10 h-10 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-brand-400">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">Passwort zurücksetzen</h1>
          <p className="text-[13px] text-slate-500 mb-6">
            Gib deine E-Mail-Adresse ein. Wir schicken dir einen Link zum Zurücksetzen.
          </p>

          <form onSubmit={zuruecksetzen} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5 tracking-wide uppercase">E-Mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="max@beispiel.de"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200"
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
                  Senden…
                </>
              ) : 'Link zusenden'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-[12px] mt-5">
          <Link href="/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            ← Zurück zum Login
          </Link>
        </p>
      </div>
    </div>
  )
}
