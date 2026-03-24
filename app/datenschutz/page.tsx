import Link from 'next/link'

export const metadata = {
  title: 'Datenschutzerklärung — RechnungsKI',
  description: 'Datenschutzerklärung der RechnungsKI Rechnungssoftware gemäß DSGVO.',
}

export default function DatenschutzSeite() {
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
          <h1 className="text-[32px] font-bold text-white tracking-tight mb-2">Datenschutzerklärung</h1>
          <p className="text-[13px] text-slate-500">Stand: März 2026 · Gemäß DSGVO, BDSG und TMG</p>
        </div>

        <div className="flex flex-col gap-8 text-[14px] leading-relaxed">

          <Section titel="1. Verantwortlicher">
            <p>Verantwortlicher im Sinne der DSGVO für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
            <Adresse />
          </Section>

          <Section titel="2. Erhobene Daten und Zweck der Verarbeitung">
            <p>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienste erforderlich ist. Im Einzelnen:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
              <li><strong className="text-slate-200">Registrierungs- und Kontodaten:</strong> E-Mail-Adresse und Passwort (verschlüsselt) zur Authentifizierung.</li>
              <li><strong className="text-slate-200">Firmendaten:</strong> Name, Adresse, Steuernummer, Bankdaten — ausschließlich für die Erstellung von Rechnungen im Auftrag des Nutzers.</li>
              <li><strong className="text-slate-200">Kundendaten:</strong> Vom Nutzer selbst eingegebene Kundendaten für Rechnungsstellung.</li>
              <li><strong className="text-slate-200">Nutzungsdaten:</strong> Server-Logs (IP-Adresse, Zeitstempel) für technischen Betrieb und Sicherheit.</li>
            </ul>
          </Section>

          <Section titel="3. Rechtsgrundlagen">
            <p>Die Verarbeitung erfolgt auf Grundlage von:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
              <li><strong className="text-slate-200">Art. 6 Abs. 1 lit. b DSGVO</strong> — Vertragserfüllung (Bereitstellung des Dienstes)</li>
              <li><strong className="text-slate-200">Art. 6 Abs. 1 lit. c DSGVO</strong> — Gesetzliche Verpflichtungen (z.B. Aufbewahrungspflichten)</li>
              <li><strong className="text-slate-200">Art. 6 Abs. 1 lit. f DSGVO</strong> — Berechtigte Interessen (Sicherheit, Missbrauchsprävention)</li>
            </ul>
          </Section>

          <Section titel="4. Einsatz von Supabase (Hosting & Datenbank)">
            <p>Wir nutzen <strong className="text-slate-200">Supabase</strong> (Supabase Inc., 970 Toa Payoh North, #07-04, Singapur) als Backend-Infrastruktur. Supabase verarbeitet Daten in unserer Datenbank und stellt Authentifizierungsdienste bereit.</p>
            <p className="mt-2">Die Daten werden in Rechenzentren der Amazon Web Services (AWS) in der EU (Frankfurt) gespeichert. Es gelten die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).</p>
            <p className="mt-2">Datenschutzerklärung Supabase: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline">supabase.com/privacy</a></p>
          </Section>

          <Section titel="5. Einsatz von Vercel (Webhosting)">
            <p>Diese Website wird über <strong className="text-slate-200">Vercel Inc.</strong> (340 S Lemon Ave #4133, Walnut, CA 91789, USA) gehostet. Beim Aufruf der Website werden Zugriffsprotokolle (IP-Adresse, Zeitstempel, aufgerufene URL) an Vercel übertragen.</p>
            <p className="mt-2">Für Datenübertragungen in die USA gelten die Standardvertragsklauseln gem. Art. 46 DSGVO. Datenschutzerklärung Vercel: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline">vercel.com/legal/privacy-policy</a></p>
          </Section>

          <Section titel="6. E-Mail-Versand (Resend)">
            <p>Für den Versand von Rechnungen und Mahnungen per E-Mail nutzen wir den Dienst <strong className="text-slate-200">Resend</strong> (Resend Inc., USA). Dabei werden E-Mail-Adresse des Empfängers und der Rechnungsinhalt übertragen.</p>
            <p className="mt-2">Der Versand erfolgt nur auf ausdrückliche Anforderung des Nutzers. Datenschutzerklärung Resend: <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline">resend.com/legal/privacy-policy</a></p>
          </Section>

          <Section titel="7. Fehler-Monitoring (Sentry)">
            <p>Zur Erkennung und Behebung technischer Fehler setzen wir <strong className="text-slate-200">Sentry</strong> (Functional Software Inc., 45 Fremont Street, San Francisco, CA 94105, USA) ein. Im Fehlerfall werden technische Diagnosedaten (Stack Trace, betroffene URL, Browsertyp, anonymisierte IP-Adresse) an Sentry übermittelt.</p>
            <p className="mt-2">Es werden keine personenbezogenen Inhaltsdaten (z.B. Rechnungsinhalte oder Kundendaten) übertragen. Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses an der Stabilität und Sicherheit des Dienstes (Art. 6 Abs. 1 lit. f DSGVO). Für Übertragungen in die USA gelten die Standardvertragsklauseln gem. Art. 46 DSGVO.</p>
            <p className="mt-2">Datenschutzerklärung Sentry: <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline">sentry.io/privacy</a></p>
          </Section>

          <Section titel="9. Speicherdauer">
            <p>Personenbezogene Daten werden gelöscht, sobald der Zweck der Verarbeitung entfällt:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
              <li>Kontodaten: Unmittelbar nach Löschung des Nutzerkontos.</li>
              <li>Rechnungs- und Buchhaltungsdaten: Entsprechend gesetzlicher Aufbewahrungsfristen (in der Regel 10 Jahre gemäß §147 AO).</li>
              <li>Server-Logs: Nach 30 Tagen.</li>
            </ul>
          </Section>

          <Section titel="10. Deine Rechte">
            <p>Du hast als betroffene Person folgende Rechte:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 mt-2">
              <li><strong className="text-slate-200">Auskunft</strong> (Art. 15 DSGVO): Welche Daten wir über dich verarbeiten.</li>
              <li><strong className="text-slate-200">Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten.</li>
              <li><strong className="text-slate-200">Löschung</strong> (Art. 17 DSGVO): Löschung deiner Daten im Rahmen des rechtlich Zulässigen.</li>
              <li><strong className="text-slate-200">Einschränkung</strong> (Art. 18 DSGVO): Einschränkung der Verarbeitung.</li>
              <li><strong className="text-slate-200">Datenübertragbarkeit</strong> (Art. 20 DSGVO): Herausgabe deiner Daten in maschinenlesbarem Format.</li>
              <li><strong className="text-slate-200">Widerspruch</strong> (Art. 21 DSGVO): Widerspruch gegen die Verarbeitung.</li>
            </ul>
            <p className="mt-3">Du hast außerdem das Recht, dich bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist der Landesbeauftragte für den Datenschutz Baden-Württemberg.</p>
          </Section>

          <Section titel="11. Cookies">
            <p>Diese Website verwendet ausschließlich technisch notwendige Session-Cookies für die Authentifizierung (Supabase Auth Token). Es werden keine Tracking-Cookies oder Drittanbieter-Cookies eingesetzt.</p>
            <p className="mt-2">Da keine Analyse- oder Marketing-Cookies verwendet werden, ist kein Cookie-Banner erforderlich.</p>
          </Section>

          <Section titel="12. Datensicherheit">
            <p>Alle Datenübertragungen erfolgen über HTTPS (TLS-Verschlüsselung). Passwörter werden ausschließlich als bcrypt-Hashwerte gespeichert. Datenbankzugriffe sind über Row-Level-Security (RLS) abgesichert — jeder Nutzer kann nur auf seine eigenen Daten zugreifen.</p>
          </Section>

          <Section titel="13. Kontakt">
            <p>Für Fragen zum Datenschutz oder zur Ausübung deiner Rechte wende dich an:</p>
            <Adresse />
          </Section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] mt-16">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px] text-slate-600">© 2026 RechnungsKI</p>
          <div className="flex gap-5">
            <Link href="/login" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors">Login</Link>
            <Link href="/registrieren" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors">Registrieren</Link>
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
      <div className="text-slate-400 flex flex-col gap-2">{children}</div>
    </section>
  )
}

function Adresse() {
  return (
    <div className="mt-3 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06] text-[13px] text-slate-400 leading-relaxed">
      <strong className="text-slate-300">RechnungsKI</strong><br />
      Konstantin Valasis<br />
      Darmstädter Straße 7<br />
      70376 Stuttgart<br />
      Deutschland<br />
      <br />
      E-Mail: <a href="mailto:info@rechnungs-ki.de" className="text-brand-400 hover:text-brand-300 transition-colors">info@rechnungs-ki.de</a><br />
      Telefon: <a href="tel:+4915679799879" className="text-brand-400 hover:text-brand-300 transition-colors">+49 156 79799879</a>
    </div>
  )
}
