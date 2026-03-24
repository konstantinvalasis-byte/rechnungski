import Link from 'next/link'

export const metadata = {
  title: 'Impressum — RechnungsKI',
  description: 'Impressum der RechnungsKI Rechnungssoftware gemäß §5 TMG.',
}

export default function ImpressumSeite() {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-300">
      {/* Hintergrund-Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-brand-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/[0.06] bg-white/[0.01] backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-white">RechnungsKI</span>
          </Link>
          <Link href="/login" className="text-[12px] text-slate-500 hover:text-slate-300 transition-colors">
            Zum Login →
          </Link>
        </div>
      </header>

      {/* Inhalt */}
      <main className="max-w-3xl mx-auto px-6 py-12 relative">
        <div className="mb-10">
          <div className="text-[11px] font-semibold text-brand-400 tracking-widest uppercase mb-3">Rechtliches</div>
          <h1 className="text-[32px] font-bold text-white tracking-tight mb-2">Impressum</h1>
          <p className="text-[13px] text-slate-500">Angaben gemäß §5 TMG</p>
        </div>

        <div className="flex flex-col gap-8 text-[14px] leading-relaxed">

          <Section titel="Anbieter">
            <div className="text-slate-400 leading-relaxed">
              <strong className="text-slate-200">RechnungsKI</strong><br />
              Konstantin Valasis<br />
              Darmstädter Straße 7<br />
              70376 Stuttgart<br />
              Deutschland
            </div>
          </Section>

          <Section titel="Kontakt">
            <div className="flex flex-col gap-1.5 text-slate-400">
              <div>
                <span className="text-slate-500">Telefon:</span>{' '}
                <a href="tel:+4915679799879" className="text-brand-400 hover:text-brand-300 transition-colors">
                  +49 156 79799879
                </a>
              </div>
              <div>
                <span className="text-slate-500">E-Mail:</span>{' '}
                <a href="mailto:info@rechnungs-ki.de" className="text-brand-400 hover:text-brand-300 transition-colors">
                  info@rechnungs-ki.de
                </a>
              </div>
            </div>
          </Section>

          <Section titel="Umsatzsteuer">
            <p className="text-slate-400">
              Konstantin Valasis ist Kleinunternehmer im Sinne von §19 UStG. Es wird daher keine Umsatzsteuer ausgewiesen.
            </p>
          </Section>

          <Section titel="Verantwortlich für den Inhalt (§18 Abs. 2 MStV)">
            <div className="text-slate-400 leading-relaxed">
              Konstantin Valasis<br />
              Darmstädter Straße 7<br />
              70376 Stuttgart
            </div>
          </Section>

          <Section titel="Streitschlichtung">
            <p className="text-slate-400">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 underline"
              >
                ec.europa.eu/consumers/odr
              </a>
            </p>
            <p className="mt-2 text-slate-400">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>

          <Section titel="Haftung für Inhalte">
            <p className="text-slate-400">
              Als Diensteanbieter sind wir gemäß §7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mt-2 text-slate-400">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </Section>

          <Section titel="Haftung für Links">
            <p className="text-slate-400">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
            <p className="mt-2 text-slate-400">
              Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px] text-slate-600">© 2026 RechnungsKI</p>
          <div className="flex gap-5">
            <Link href="/datenschutz" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors">Datenschutz</Link>
            <Link href="/login" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
      <h2 className="text-[16px] font-bold text-white mb-3 tracking-tight">{titel}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}
