"use client";
import { useState } from "react";
import { IC } from "@/lib/dashboard-icons";

const HILFE: { kategorie: string; ico: React.ReactNode; farbe: string; fragen: { f: string; a: string }[] }[] = [
  {
    kategorie: "Erste Schritte",
    ico: IC.star,
    farbe: "text-brand-400",
    fragen: [
      {
        f: "Wie erstelle ich meine erste Rechnung?",
        a: 'Klicke auf „Neue Rechnung" oben rechts im Dashboard. Wähle einen Kunden oder lege direkt einen neuen an, füge Positionen hinzu und klicke auf „Speichern & PDF". Die Rechnungsnummer wird automatisch vergeben.',
      },
      {
        f: "Wie füge ich einen Kunden hinzu?",
        a: 'Gehe zu „Kunden" und klicke auf „Neuer Kunde". Name und Adresse sind Pflichtfelder – E-Mail und Telefon optional. Gespeicherte Kunden stehen beim nächsten Auftrag direkt zur Auswahl.',
      },
      {
        f: "Wie richte ich meine Firmendaten ein?",
        a: 'Unter „Einstellungen" trägst du Name, Adresse, Steuernummer und Bankverbindung ein. Diese Daten erscheinen auf jeder PDF-Rechnung. Fehlende Pflichtangaben nach §14 UStG werden im Dashboard mit einer Warnung angezeigt.',
      },
      {
        f: "Wo fange ich am besten an?",
        a: 'Am schnellsten startest du so: (1) Firmendaten in den Einstellungen ausfüllen, (2) ersten Kunden anlegen, (3) erste Rechnung erstellen. Das ganze dauert unter 5 Minuten. Alternativ kannst du im Dashboard eine Musterrechnung laden, um die App erstmal zu erkunden.',
      },
    ],
  },
  {
    kategorie: "Rechnungen & Angebote",
    ico: IC.doc,
    farbe: "text-purple-400",
    fragen: [
      {
        f: "Was ist der Unterschied zwischen Rechnung und Angebot?",
        a: "Ein Angebot ist unverbindlich, hat keine Rechnungsnummer und erscheint nicht in deiner Umsatzauswertung. Sobald der Kunde zusagt, wandelst du es mit einem Klick in eine Rechnung um – Nummer wird automatisch vergeben.",
      },
      {
        f: "Wie lade ich eine Rechnung als PDF herunter?",
        a: 'In der Rechnungsliste klicke auf den „PDF"-Button bei der jeweiligen Rechnung. Du kannst zwischen normalem PDF, ZUGFeRD-PDF und XRechnung-XML wählen. Das PDF enthält alle Pflichtangaben nach §14 UStG.',
      },
      {
        f: 'Wie setze ich eine Rechnung auf „Bezahlt"?',
        a: 'In der Rechnungsliste klicke bei der Rechnung auf „Bezahlt". Es erscheint ein Bestätigungsdialog. Nach Bestätigung wird der Betrag sofort im Umsatz und in der Steuerübersicht berücksichtigt.',
      },
      {
        f: "Wie bearbeite ich eine bereits erstellte Rechnung?",
        a: 'Klicke in der Rechnungsliste auf das Stift-Symbol (✏️) bei der Rechnung. Bezahlte und stornierte Rechnungen können aus buchhalterischen Gründen nicht mehr bearbeitet werden – dafür kannst du sie duplizieren.',
      },
      {
        f: "Wie kopiere ich eine bestehende Rechnung?",
        a: 'Klicke in der Rechnungsliste auf das Kopier-Symbol bei der Rechnung. Eine neue Rechnung mit identischen Positionen und Kundendaten wird erstellt – nur Datum und Nummer werden automatisch aktualisiert. Ideal für Folgeaufträge.',
      },
      {
        f: "Wie storniere ich eine Rechnung?",
        a: 'Klicke in der Rechnungsliste auf „Storno". Die Rechnung wird als storniert markiert und aus allen Umsatzauswertungen ausgeschlossen. Bezahlte Rechnungen können nicht storniert werden. Stornierte Rechnungen können endgültig gelöscht werden.',
      },
      {
        f: "Wie füge ich einen Rabatt hinzu?",
        a: 'Beim Erstellen oder Bearbeiten einer Rechnung gibt es ein Rabatt-Feld. Der Rabatt wird in Prozent angegeben und auf den Gesamtbetrag angerechnet. Er erscheint als eigene Zeile auf dem PDF.',
      },
      {
        f: "Was ist der Leistungszeitraum und muss ich ihn angeben?",
        a: 'Der Leistungszeitraum (z.B. „01.03.2026 – 31.03.2026") ist für Rechnungen über mehrere Zeiträume relevant, z.B. Monatsleistungen oder Wartungsverträge. Er ist optional, aber steuerlich empfehlenswert wenn die Leistung nicht am Rechnungsdatum erbracht wurde.',
      },
      {
        f: "Wie ändere ich das Zahlungsziel?",
        a: 'Das Zahlungsziel (in Tagen) stellst du beim Erstellen der Rechnung ein. Der Standard sind 14 Tage. Das Fälligkeitsdatum wird automatisch berechnet und erscheint auf dem PDF.',
      },
      {
        f: 'Was bedeutet die rote Zahl neben „Rechnungen" in der Navigation?',
        a: 'Die rote Zahl zeigt wie viele Rechnungen aktuell den Status „Offen" haben – also noch nicht bezahlt wurden. Sie verschwindet sobald alle offenen Rechnungen als bezahlt markiert oder storniert sind.',
      },
      {
        f: 'Was bedeutet „Gemahnt" als Status?',
        a: 'Gemahnt bedeutet, dass für diese Rechnung mindestens eine Mahnung erstellt oder versendet wurde. Der Status wird beim Mahnen automatisch gesetzt. Im Dashboard sind gemahnte Rechnungen separat sichtbar.',
      },
    ],
  },
  {
    kategorie: "E-Mail & Versand",
    ico: IC.mail,
    farbe: "text-cyan-400",
    fragen: [
      {
        f: "Wie versende ich eine Rechnung per E-Mail?",
        a: 'Klicke in der Rechnungsliste auf das E-Mail-Symbol (📧) bei der Rechnung. Trage die Empfängeradresse ein, passe Betreff an und klicke auf „Jetzt senden". Das PDF wird automatisch als Anhang beigefügt. Diese Funktion ist ab dem Starter-Plan verfügbar.',
      },
      {
        f: "Kann ich mir selbst eine Kopie der E-Mail senden?",
        a: 'Ja. Im E-Mail-Dialog gibt es die Option „Kopie an mich senden". Dann bekommst du dieselbe E-Mail auch an deine in den Einstellungen hinterlegte Adresse.',
      },
      {
        f: "Kann ich eine Mahnung direkt per E-Mail versenden?",
        a: 'Ja. Im E-Mail-Dialog kannst du zwischen „Rechnung" und „Mahnung" wählen. Bei Mahnung wählst du zusätzlich die Mahnstufe (1., 2. oder 3. Mahnung). Das entsprechende Mahnschreiben wird als PDF angehängt.',
      },
      {
        f: "Die E-Mail wurde nicht zugestellt – was kann ich tun?",
        a: 'Prüfe zunächst ob die E-Mail-Adresse des Kunden korrekt ist. Schau auch in deinem Spam-Ordner nach (falls du eine Kopie angefordert hast). Manche Firmen-Firewalls blockieren automatische E-Mails – dann lade das PDF herunter und sende es manuell aus deinem E-Mail-Programm.',
      },
    ],
  },
  {
    kategorie: "Mahnungen",
    ico: IC.alert,
    farbe: "text-danger-400",
    fragen: [
      {
        f: "Wie erstelle ich eine Mahnung?",
        a: 'Überfällige Rechnungen erscheinen rot im Dashboard mit einem „Mahnen"-Button. Alternativ klickst du in der Rechnungsliste auf das 🔔-Symbol. RechnungsKI erstellt automatisch den Mahntext mit Forderungsbetrag. Du kannst ihn kopieren, als PDF herunterladen oder direkt per E-Mail versenden.',
      },
      {
        f: "Wie viele Mahnstufen gibt es?",
        a: 'Es gibt 3 Mahnstufen. Normalerweise beginnt man mit einer freundlichen Zahlungserinnerung (1. Mahnung), dann einer 2. und schließlich einer 3. Mahnung mit Inkasso-Androhung. Jede Stufe hat einen eigenen angepassten Text.',
      },
      {
        f: "Wann ist eine Rechnung überfällig?",
        a: 'Eine Rechnung gilt als überfällig wenn das Fälligkeitsdatum (Datum + Zahlungsziel) überschritten ist. Im Dashboard werden überfällige Rechnungen automatisch erkannt und mit Anzahl überfälliger Tage angezeigt.',
      },
      {
        f: "Kann ich Mahngebühren berechnen?",
        a: 'Ja. Der automatisch generierte Mahntext enthält einen Hinweis auf anfallende Mahngebühren und Verzugszinsen. Der gesetzliche Verzugszinssatz für Verbraucher beträgt 5 % über dem Basiszinssatz, für Unternehmen 9 %.',
      },
      {
        f: "Was mache ich wenn der Kunde trotz Mahnung nicht zahlt?",
        a: 'Nach der 3. Mahnung kannst du ein Inkassobüro beauftragen oder einen gerichtlichen Mahnbescheid beantragen. Den Mahnbescheid kannst du online über das Zentrale Mahngericht beantragen (ca. 30–40 € Kosten bei Beträgen bis 1.000 €).',
      },
    ],
  },
  {
    kategorie: "E-Rechnung (ZUGFeRD / XRechnung)",
    ico: IC.shield,
    farbe: "text-teal-400",
    fragen: [
      {
        f: "Was ist eine E-Rechnung und brauche ich sie?",
        a: 'Eine E-Rechnung ist eine strukturierte digitale Rechnung (nicht nur ein PDF). Ab 2025 sind B2B-Unternehmen in Deutschland verpflichtet, E-Rechnungen empfangen zu können. Ab 2028 müssen Rechnungen an andere Unternehmen als E-Rechnung ausgestellt werden. Für Rechnungen an Privatpersonen bleibt das normale PDF erlaubt.',
      },
      {
        f: "Was ist der Unterschied zwischen ZUGFeRD und XRechnung?",
        a: 'ZUGFeRD ist ein hybrides Format: ein normales PDF mit eingebetteten XML-Daten – der Empfänger sieht ein lesbares PDF, die Software liest die XML-Daten. XRechnung ist ein reines XML-Format, das vor allem für Rechnungen an Behörden und öffentliche Auftraggeber vorgeschrieben ist.',
      },
      {
        f: "Wie aktiviere ich E-Rechnungen?",
        a: 'Trage in den Einstellungen deine Steuernummer oder USt-ID ein. Danach erscheint in der Rechnungsliste beim PDF-Button automatisch die Option „ZUGFeRD PDF" und „XRechnung XML".',
      },
      {
        f: "Muss ich ZUGFeRD oder XRechnung an Behörden schicken?",
        a: 'An Bundesbehörden ist XRechnung seit 2020 Pflicht. An Landesbehörden und Kommunen gelten unterschiedliche Fristen je nach Bundesland. Für normale Geschäftskunden (B2B) reicht aktuell noch ZUGFeRD.',
      },
    ],
  },
  {
    kategorie: "Wiederkehrende Rechnungen",
    ico: IC.copy,
    farbe: "text-blue-400",
    fragen: [
      {
        f: "Was sind wiederkehrende Rechnungen?",
        a: 'Wiederkehrende Rechnungen sind Vorlagen für regelmäßige Leistungen – z.B. monatliche Wartungsverträge, Mieten oder Pauschalleistungen. Du legst die Vorlage einmal an und RechnungsKI zeigt dir an, wenn eine neue Rechnung fällig ist.',
      },
      {
        f: "Wie richte ich eine wiederkehrende Rechnung ein?",
        a: 'Gehe zu „Wiederkehrend" in der Navigation und klicke auf „Neue Vorlage". Wähle Kunde, Intervall (monatlich/quartalsweise/jährlich) und erstes Fälligkeitsdatum. Du kannst auch eine bestehende Rechnung als Basis importieren.',
      },
      {
        f: "Wann wird die wiederkehrende Rechnung erstellt?",
        a: 'RechnungsKI erstellt die Rechnung nicht vollautomatisch – es zeigt dir an, wenn eine Vorlage fällig ist. Du bestätigst mit einem Klick und die Rechnung wird mit dem aktuellen Datum und der nächsten freien Rechnungsnummer erstellt.',
      },
      {
        f: "Wie ändere ich das Intervall einer Vorlage?",
        a: 'Klicke in der Übersicht der wiederkehrenden Rechnungen auf den Bearbeiten-Button der Vorlage. Dort kannst du Intervall, Fälligkeitsdatum, Positionen und Kundendaten anpassen.',
      },
      {
        f: "Wie deaktiviere oder lösche ich eine Vorlage?",
        a: 'In der Übersicht kannst du eine Vorlage pausieren (sie bleibt erhalten, wird aber nicht mehr als fällig angezeigt) oder endgültig löschen. Bereits erstellte Rechnungen aus dieser Vorlage bleiben unberührt.',
      },
    ],
  },
  {
    kategorie: "Steuer & Buchhaltung",
    ico: IC.euro,
    farbe: "text-success-400",
    fragen: [
      {
        f: "Welchen Mehrwertsteuersatz soll ich verwenden?",
        a: 'In Deutschland gilt für die meisten Handwerksleistungen und Dienstleistungen der Regelsteuersatz von 19 %. Für bestimmte Leistungen (z.B. Renovierungsarbeiten an Wohngebäuden) gilt der ermäßigte Satz von 7 %. Im Zweifelsfall frag deinen Steuerberater.',
      },
      {
        f: "Ich bin Kleinunternehmer – was muss ich beachten?",
        a: 'Aktiviere in den Einstellungen die Option „Kleinunternehmer (§19 UStG)". Dann wird keine Mehrwertsteuer auf Rechnungen ausgewiesen und der Pflichthinweis gemäß §19 UStG erscheint automatisch auf deinen PDFs. Als Kleinunternehmer darfst du keine MwSt ausweisen.',
      },
      {
        f: "Was zeigt mir die Steuerübersicht im Dashboard?",
        a: 'Die Quartalsübersicht zeigt Nettoumsatz, MwSt-Schuld und Bruttobetrag für das aktuelle Quartal – ausschließlich auf Basis bezahlter Rechnungen (Ist-Versteuerung). Offene Rechnungen fließen erst ein wenn sie als bezahlt markiert werden.',
      },
      {
        f: "Was ist der Unterschied zwischen Netto und Brutto auf der Rechnung?",
        a: 'Netto ist der Betrag ohne Mehrwertsteuer, Brutto ist der Betrag inklusive MwSt. Als Rechnungsersteller weist du Netto, MwSt-Betrag und Brutto separat aus. Dein Kunde zahlt den Bruttobetrag. Die MwSt führst du ans Finanzamt ab.',
      },
      {
        f: "Wie funktioniert der DATEV-Export?",
        a: 'Unter „Rechnungen" findest du den DATEV-Button (ab Pro-Plan). Der Export erstellt eine CSV-Datei im DATEV-Format mit allen Rechnungen. Diese kannst du direkt an deinen Steuerberater schicken oder in DATEV importieren.',
      },
      {
        f: "Wo finde ich meine Steuernummer?",
        a: 'Deine Steuernummer findest du auf dem Steuerbescheid vom Finanzamt (Format: 12/345/67890, variiert je nach Bundesland). Die USt-ID (Format: DE123456789) erhältst du beim Finanzamt auf Antrag – sie ist Pflicht bei EU-Auslandsgeschäften.',
      },
      {
        f: "Welche Angaben sind nach §14 UStG Pflicht auf der Rechnung?",
        a: 'Vollständiger Name und Adresse beider Parteien, Steuernummer oder USt-ID, Rechnungsdatum, fortlaufende Rechnungsnummer, Leistungsbeschreibung und -zeitraum, Nettobetrag, Steuersatz, MwSt-Betrag, Bruttobetrag. RechnungsKI prüft automatisch ob alle Pflichtfelder ausgefüllt sind.',
      },
    ],
  },
  {
    kategorie: "Einstellungen & Datensicherung",
    ico: IC.gear,
    farbe: "text-slate-400",
    fragen: [
      {
        f: "Wie füge ich mein Firmenlogo hinzu?",
        a: 'Unter „Einstellungen → Logo" kannst du ein PNG oder JPEG hochladen (max. 2 MB). Das Logo erscheint auf allen PDF-Rechnungen oben links. Die Logo-Funktion ist ab dem Starter-Plan verfügbar.',
      },
      {
        f: "Was ist die Gewerke-Angabe?",
        a: 'Das Gewerk (z.B. „Elektriker", „Maler", „Sanitär") erscheint auf deinen Rechnungen und wird als Standard vorbelegt wenn du eine neue Rechnung erstellst. Es ist kein Pflichtfeld, hilft aber beim schnellen Ausfüllen.',
      },
      {
        f: "Wie sichere ich meine Daten?",
        a: 'Unter „Einstellungen → Datensicherung" kannst du alle Daten als JSON-Backup herunterladen. Die Datei enthält Firmendaten, alle Rechnungen, Kunden und Vorlagen. Wir empfehlen regelmäßige Backups, da alle Daten lokal in deinem Browser gespeichert werden.',
      },
      {
        f: "Wo werden meine Daten gespeichert?",
        a: 'RechnungsKI speichert deine Daten lokal in deinem Browser (IndexedDB). Die Daten verlassen deinen Computer nicht automatisch. Das bedeutet: kein Cloud-Sync zwischen Geräten, aber maximale Datenschutz-Kontrolle. Regelmäßige Backups sind daher wichtig.',
      },
      {
        f: "Meine Daten sind weg – was kann ich tun?",
        a: 'Das kann passieren wenn du den Browser-Cache geleert oder einen anderen Browser/ein anderes Gerät verwendet hast. Importiere ein vorhandenes Backup unter „Einstellungen → Datensicherung → Import". Hast du kein Backup, können die Daten leider nicht wiederhergestellt werden.',
      },
      {
        f: "Wie importiere ich ein Backup?",
        a: 'Unter „Einstellungen → Datensicherung" klicke auf „Import" und wähle deine JSON-Backup-Datei aus. Nach einer Sicherheitsabfrage werden alle aktuellen Daten überschrieben und durch das Backup ersetzt. Die Seite lädt anschließend automatisch neu.',
      },
      {
        f: "Kann ich Daten auf ein neues Gerät übertragen?",
        a: 'Ja. Erstelle auf dem alten Gerät ein Backup (Einstellungen → Export). Öffne RechnungsKI auf dem neuen Gerät und importiere die Backup-Datei (Einstellungen → Import). Fertig.',
      },
    ],
  },
  {
    kategorie: "Abo & Limits",
    ico: IC.crown,
    farbe: "text-warning-400",
    fragen: [
      {
        f: "Was ist im Free-Plan enthalten?",
        a: 'Der Free-Plan erlaubt bis zu 3 Rechnungen und 3 Kunden pro Monat – kostenlos, ohne Kreditkarte. PDFs werden ohne dein Logo erstellt. E-Mail-Versand, DATEV-Export und Mahnfunktion sind im Free-Plan nicht verfügbar.',
      },
      {
        f: "Was bietet der Starter-Plan?",
        a: 'Der Starter-Plan schaltet Logo auf PDFs, E-Mail-Versand direkt aus der App und mehr Rechnungen/Kunden frei. Ideal für Soloselbstständige mit regelmäßigen Aufträgen.',
      },
      {
        f: "Was bietet der Pro-Plan?",
        a: 'Pro enthält alles aus Starter plus: unbegrenzte Rechnungen und Kunden, DATEV-Export, Mahnfunktion (alle 3 Stufen) und alle zukünftigen Premium-Features. Monatlich kündbar.',
      },
      {
        f: "Wie upgrade ich auf Pro?",
        a: 'Klicke auf „Upgraden" im Banner oben im Dashboard oder gehe zu „Abo" in der Navigation. Du kannst dort zwischen den Plänen wechseln.',
      },
      {
        f: "Was passiert mit meinen Daten wenn ich kündige oder downgrade?",
        a: 'Deine Daten bleiben vollständig erhalten – du verlierst nur den Zugang zu Premium-Features. Bestehende Rechnungen sind weiterhin sichtbar und als PDF downloadbar.',
      },
      {
        f: "Ich habe ein Limit erreicht – was kann ich tun?",
        a: 'Du kannst auf einen höheren Plan upgraden oder (im Free-Plan) stornierte Angebote löschen um Platz zu schaffen. Stornierte Rechnungen werden für das Limit nicht gezählt.',
      },
    ],
  },
];

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return <>{parts.map((p, i) => p.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-brand-500/30 text-brand-200 rounded px-0.5">{p}</mark> : p)}</>;
}

export default function HelpSection() {
  const [offen, setOffen] = useState<string | null>(null);
  const [suche, setSuche] = useState("");

  const toggle = (key: string) => setOffen(prev => prev === key ? null : key);

  const q = suche.trim().toLowerCase();
  const gefiltert = q
    ? HILFE.map(kat => ({ ...kat, fragen: kat.fragen.filter(fr => fr.f.toLowerCase().includes(q) || fr.a.toLowerCase().includes(q)) })).filter(kat => kat.fragen.length > 0)
    : HILFE;
  const trefferAnzahl = q ? gefiltert.reduce((s, k) => s + k.fragen.length, 0) : null;

  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden mb-5">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400">
          {IC.shield}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold">Hilfe & Häufige Fragen</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Schnelle Antworten auf alle wichtigen Fragen</p>
        </div>
      </div>

      {/* Suche */}
      <div className="px-4 py-3 border-b border-white/[0.06] bg-[#0a0a1a]/40">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex pointer-events-none">{IC.search}</span>
          <input
            type="text"
            placeholder="Frage suchen…"
            value={suche}
            onChange={e => { setSuche(e.target.value); setOffen(null); }}
            className="w-full py-2 pl-[34px] pr-8 bg-white/[0.04] border border-white/[0.07] rounded-xl text-[13px] text-slate-200 placeholder:text-slate-600 outline-none focus:border-brand-500/40 focus:bg-white/[0.06] transition-all duration-200"
          />
          {suche && (
            <button onClick={() => { setSuche(""); setOffen(null); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors bg-transparent border-none cursor-pointer p-0.5">
              {IC.x}
            </button>
          )}
        </div>
        {trefferAnzahl !== null && (
          <p className="text-[11px] text-slate-500 mt-2 px-1">
            {trefferAnzahl === 0 ? "Keine Ergebnisse" : `${trefferAnzahl} Ergebnis${trefferAnzahl !== 1 ? "se" : ""}`}
          </p>
        )}
      </div>

      {/* Kategorien */}
      <div className="divide-y divide-white/[0.04]">
        {gefiltert.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-600">{IC.search}</div>
            <p className="text-[13px] text-slate-500">Keine Frage gefunden für <strong className="text-slate-400">„{suche}"</strong></p>
            <p className="text-[12px] text-slate-600 mt-1">Schreib uns unter support@rechnungski.de</p>
          </div>
        ) : gefiltert.map((kat) => (
          <div key={kat.kategorie} className="bg-[#0a0a1a]/60">
            {/* Kategorie-Header */}
            <div className={`flex items-center gap-2.5 px-5 py-3 ${kat.farbe}`}>
              <span className="flex opacity-70 text-[12px]">{kat.ico}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] opacity-70">{kat.kategorie}</span>
            </div>

            {/* Fragen */}
            {kat.fragen.map((frage, i) => {
              const key = `${kat.kategorie}-${i}`;
              const istOffen = offen === key || !!q;
              return (
                <div key={key} className="border-t border-white/[0.04]">
                  <button
                    onClick={() => toggle(key)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.025] transition-colors duration-150 group"
                  >
                    <span className="text-[13px] text-slate-200 font-medium group-hover:text-white transition-colors pr-4">{highlight(frage.f, suche.trim())}</span>
                    <span className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-slate-500 transition-all duration-200 ${istOffen ? "bg-brand-500/15 text-brand-400 rotate-180" : "bg-white/[0.04]"}`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  {istOffen && (
                    <div className="px-5 pb-4 text-[13px] text-slate-400 leading-relaxed border-t border-white/[0.03] bg-white/[0.01] animate-fade-in">
                      <p className="pt-3">{highlight(frage.a, suche.trim())}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-4 bg-gradient-to-r from-brand-950/40 to-transparent border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
        <p className="text-[12px] text-slate-500">Noch Fragen? Wir helfen gerne weiter.</p>
        <a
          href="mailto:support@rechnungski.de"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-[12px] text-slate-300 font-medium hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
        >
          {IC.shield} support@rechnungski.de
        </a>
      </div>
    </div>
  );
}
