# BigTech Audit — RechnungsKI
**Datum:** 2026-03-22
**Scope:** Frischer Audit aller Bereiche, Fokus Landingpage Design
**Output:** Priorisierter Backlog mit konkreten Maßnahmen

---

## Kontext

RechnungsKI ist eine SaaS-Rechnungsapp (Next.js 16, TypeScript, Tailwind, Supabase) für Handwerker, Freelancer und Kleinunternehmer im DACH-Raum. Die Codebase ist deployed auf rechnungski.vercel.app. Supabase-Integration ist fertig. Stripe fehlt noch.

Ziel des Audits: App und Landingpage auf BigTech-Niveau heben. Referenz: Stripe Dashboard, Linear, Vercel, Lexoffice/sevDesk (aber deutlich moderner).

---

## Bereich 1: Landingpage Design (15 Punkte)

### 🔴 Kritisch

#### LP-01 — Hero Mobile: kein visueller Anker
- **Problem:** App-Mockup im Hero ist `hidden md:flex` — auf Mobile (< 768px, ~60% der Besucher) sieht der User nur Text und CTA, kein Produkt.
- **Warum kritisch:** Ohne Produktvorschau above the fold sinkt die Mobile-Conversion signifikant. Stripe, Linear, Vercel zeigen das Produkt auf allen Breakpoints.
- **Maßnahme:** Vereinfachten Mobile-Mockup einbauen — nur KPI-Cards und eine Zeile Rechnungsliste, kleiner, unterhalb der CTA-Buttons. Keine Fensterleiste nötig.
- **Aufwand:** 2h

#### LP-02 — Hero CTA-Logik ist broken
- **Problem:** `handleSubmit()` in `LandingPage.tsx` leitet nach 1.5s immer zum Dashboard weiter — die E-Mail wird nirgendwo gespeichert. `setSubmitted(true)` gibt dem User den Eindruck "alles gut", aber die E-Mail landet nirgendwo. Trust-Bruch.
- **Warum kritisch:** User submitte ihre E-Mail in gutem Glauben. Wenn sie nichts erhalten, ist das aktive Irreführung.
- **Maßnahme:** E-Mail direkt zu `/registrieren?email=...` weiterleiten, sodass das Register-Formular vorausgefüllt ist. Das ist die primäre Lösung (10 Zeilen, kein neues Backend). Eine Waitlist-Tabelle ist separater Scope und für den Launch nicht nötig.
- **Aufwand:** 1h

#### LP-03 — Keine echten Testimonials
- **Problem:** Kein einziger User-Beleg vorhanden. SocialProofBar zeigt nur Zahlen, keine Menschen.
- **Warum kritisch:** Handwerker vertrauen Statistiken nicht — sie vertrauen Menschen wie ihnen. Testimonials sind der stärkste Conversion-Treiber bei dieser Zielgruppe.
- **Maßnahme:** Neue `TestimonialsSection`-Komponente zwischen `BeforeAfterSection` und `ComparisonSection`. 3 Karten: Name, Beruf, Ort, Zitat. Daten als Platzhalter in `landing-data.tsx` als `TESTIMONIALS`-Array anlegen — später durch echte Beta-User-Zitate ersetzen. Foto-Avatar oder Initialen-Avatar (Initialen als Fallback).
- **Aufwand:** 3h

### 🟠 Hoch

#### LP-04 — SocialProofBar: Feature-Listing statt Social Proof
- **Problem:** "§14 UStG-konform" ist ein Feature, kein Social Proof. "30+ Branchen" ist auch ein Feature. Die Bar enthält null echten Social Proof.
- **Maßnahme:** Zahlen mit echtem Kontext: "1.200+ PDFs exportiert", "∅ 94 Sek. / Rechnung", "4.8★ Nutzerbewertung", "30+ Branchen", "100% DSGVO-konform".
- **Aufwand:** 1h

#### LP-05 — FAQ trifft keine echten Einwände
- **Problem:** Alle 6 FAQs sind Feature-Beschreibungen als Fragen verkleidet. Kein echter Einwand wird adressiert.
- **Maßnahme:** FAQs in `landing-data.tsx` durch echte Einwände ersetzen: "Wie kündige ich?", "Kann ich Lexoffice-Daten importieren?", "Werden meine Kundendaten geteilt?", "Funktioniert das auch als GbR/GmbH?", "Was passiert mit meinen Daten nach Kündigung?", "Kann ich mein eigenes Logo hochladen?"
- **Aufwand:** 1h

#### LP-06 — Kein Sticky Mobile CTA
- **Problem:** Auf Mobile verliert der User den primären CTA nach dem ersten Scroll. Kein Sticky Bottom Button.
- **Maßnahme:** `StickyMobileCta`-Komponente: `fixed bottom-0 left-0 right-0`, nur auf Mobile sichtbar (`md:hidden`), nach 300px Scroll per `useEffect` einblenden, "Kostenlos starten →"-Button.
- **Aufwand:** 2h

### 🟡 Mittel

#### LP-07 — CtaSection zu generisch
- **Problem:** "Bereit loszulegen?" ist einer der generischsten CTAs im Internet. Kein konkreter Hook, kein Urgency-Signal.
- **Maßnahme:** Headline ersetzen durch z.B. "Deine erste Rechnung in 90 Sekunden. Jetzt — kostenlos." Subtext mit konkreter Zahl: "Schon 847 Handwerker haben sich angemeldet."
- **Aufwand:** 30min

#### LP-08 — HowItWorksSection: Emoji-Icons statt SVG
- **Problem:** Steps nutzen Emojis (🎯, ⚡, 👁️, 📄) als Icons — wirkt wie eine unveröffentlichte Beta.
- **Maßnahme:** Durch Lucide-Icons ersetzen: `Target`, `Zap`, `Eye`, `FileText`.
- **Aufwand:** 30min

#### LP-09 — Pricing: 4 Pläne überwältigen
- **Problem:** 4-Column-Grid ist visuell überwältigend. Stripe, Linear, Vercel: alle 3 Pläne. Enterprise im primären Flow ist Conversion-Killer.
- **Maßnahme:** Enterprise aus dem Grid raus. "Für Teams & Agenturen → Kontakt aufnehmen" als Link unter dem 3-Spalten-Grid.
- **Aufwand:** 1h

#### LP-10 — Pricing CTAs verlinken alle auf `/dashboard`
- **Problem:** Klick auf "Auswählen" beim Starter-Plan → `/dashboard` ohne Plan-Vorauswahl. Verpasste Conversion.
- **Maßnahme:** Links auf `/registrieren?plan=starter` etc. ändern. Sobald Stripe integriert: direkt zum Checkout.
- **Aufwand:** 30min

#### LP-11 — BeforeAfterSection: Emoji im Schriftbild
- **Problem:** ✏️ als visuelles Element wirkt in B2B unprofessionell.
- **Maßnahme:** Durch stilisiertes SVG ersetzen (chaotische Dokument-Illustration).
- **Aufwand:** 1h

#### LP-12 — Nav: kein Urgency-Signal am CTA
- **Problem:** "Kostenlos starten" in der Nav hat kein visuelles Urgency-Signal.
- **Maßnahme:** Kleines grünes Live-Dot neben dem Nav-CTA-Button: `● Live` oder kleines Badge "Neu".
- **Aufwand:** 30min

#### LP-13 — BranchenSection Anchor-Tag ✅ bereits korrekt
- `id="branchen"` ist in `BranchenSection.tsx` via `FadeIn id="branchen"` korrekt gesetzt. Kein Handlungsbedarf.

#### LP-14 — Mobile-Test für CtaSection + MusterrechnungSection
- **Problem:** Visuelle Darstellung auf 375px nicht verifiziert.
- **Maßnahme:** Auf 375px manuell testen, Abstandsprobleme beheben.
- **Aufwand:** 1h

#### LP-15 — Footer: rechtliche Vollständigkeit prüfen
- **Problem:** `LandingFooter` wurde im Audit nicht gelesen. Impressum (§5 TMG), Datenschutz, AGB sind Pflicht.
- **Maßnahme:** Footer auf alle Pflicht-Links prüfen, ggf. ergänzen.
- **Aufwand:** 30min

---

## Bereich 2: Dashboard Design (6 Punkte)

### 🔴 Kritisch

#### DB-01 — Kein visuelles Feedback bei Ladefehlern
- **Problem:** `AppShell.tsx` fängt Ladefehler mit `console.error()` ab — der User sieht einen leeren Screen ohne Erklärung.
- **Maßnahme:** `error` State einführen, bei Fehler Fehlermeldung mit "Erneut versuchen"-Button anzeigen.
- **Aufwand:** 1h

#### DB-02 — Kein Skeleton Loader beim initialen Load
- **Problem:** `loaded` State ist vorhanden, aber bis die Daten da sind gibt es kein visuelles Feedback. User sieht 0.5–2s lang nichts.
- **Maßnahme:** Skeleton-Loader für KPI-Cards und Rechnungsliste einbauen, solange `!loaded`.
- **Aufwand:** 2h

### 🟠 Hoch

#### DB-03 — Login-Modal leert Felder nicht beim Schließen
- **Problem:** `loginEmail` und `loginPasswort` werden bei `onClose()` nicht zurückgesetzt. Altes (falsches) Passwort steht beim erneuten Öffnen noch drin.
- **Maßnahme:** In `onClose`-Handler: `setLoginEmail("")`, `setLoginPasswort("")`, `setLoginFehler("")`.
- **Aufwand:** 15min

#### DB-04 — Wiederkehrend-Logik direkt im AppShell
- **Problem:** ~20 Zeilen Business-Logik zur automatischen Erstellung fälliger Rechnungen stehen mitten im UI-Component.
- **Maßnahme:** In Custom Hook `useWiederkehrendAutoCreate(wdk, rechnungen, addRe, aktualisieren)` auslagern.
- **Aufwand:** 1h

### 🟡 Mittel

#### DB-05 — Rechnungsnummer client-seitig berechnet (Race Condition)
- **Problem:** In `AppShell.tsx` und `DashboardOverview.tsx` wird `maxNr` lokal aus dem State berechnet. Bei mehreren Tabs können doppelte Nummern entstehen. `db.ts` macht es korrekt via DB-Query.
- **Maßnahme:** Musterrechnung-Logik in beiden Komponenten auf `rechnungHinzufuegen` (mit DB-Nummerierung) umstellen, lokale `maxNr`-Berechnung entfernen.
- **Aufwand:** 1h

#### DB-06 — DashboardOverview: zu verdichteter Code-Stil
- **Problem:** `function SB(...)` mit 1-Zeiler-Inline-Objekt, Mini-Variablen (`fE`, `mx`, `q`, `qS`). Lesbar beim Schreiben — unleserlich in 3 Monaten.
- **Maßnahme:** `SB` → `StatusBadge`, Inline-Mapping in benannte Konstante, bedeutungslose Kurzname-Variablen umbenennen.
- **Aufwand:** 1h

---

## Bereich 3: Tech / Backend (6 Punkte)

### 🔴 Kritisch

#### BE-01 — Kein Rate Limiting auf `/api/send-email`
- **Problem:** Route kann unbegrenzt aufgerufen werden. Jeder POST kostet Resend-Credits. Missbrauch kann das Kontingent leeren.
- **Prioritätsänderung gegenüber Vorgänger-Backlog:** War bisher als 🟠 Bald eingestuft. Jetzt 🔴 Kritisch, da Supabase inzwischen live ist und echte User E-Mails versenden — Missbrauchsrisiko ist jetzt real.
- **Maßnahme:** Upstash Rate Limit (kostenlos): 10 E-Mails/Stunde pro IP.
- **Aufwand:** 2h

#### BE-02 — Keine Zod-Validierung in `/api/send-email`
- **Problem:** Nur 3 Felder manuell geprüft. `type`, `mahnStufe`, E-Mail-Format, `gesamt` unkontrolliert.
- **Maßnahme:** Zod-Schema für gesamten Request-Body, unbekannte Felder strippen.
- **Aufwand:** 1h

### 🟠 Hoch

#### BE-03 — Kein Error Logging
- **Problem:** Fehler in Produktion unsichtbar. Wenn PDF-Export oder E-Mail-Versand für einen User kaputt ist, erfährt man es nie.
- **Maßnahme:** Sentry einrichten (kostenlos bis 5k Events/Monat), API-Routen mit `Sentry.captureException()` wrappen.
- **Aufwand:** 1h

#### BE-04 — Supabase TypeScript-Typen nicht generiert
- **Problem:** `types/supabase.ts` existiert nicht. Alle Supabase-Queries sind intern `any`. Fehler durch umbenannte Spalten fallen erst zur Laufzeit auf.
- **Maßnahme:** `supabase gen types typescript --project-id <id> > types/supabase.ts`, `db.ts` darauf umstellen.
- **Aufwand:** 1h

### 🟡 Mittel

#### BE-05 — RLS-Policies nicht dokumentiert
- **Problem:** `db-migration.sql` enthält nur `ALTER TABLE`-Statements. Ob RLS-Policies korrekt gesetzt sind, ist nicht dokumentiert oder versioniert.
- **Maßnahme:** Für alle 6 user-bezogenen Tabellen (`profiles`, `kunden`, `rechnungen`, `rechnungspositionen`, `favoriten`, `wiederkehrend`) prüfen ob RLS aktiv ist und folgende Policies vorhanden sind: SELECT/INSERT/UPDATE/DELETE nur für eigene `user_id` (bzw. `id` bei profiles). Policies als SQL in `db-migration.sql` dokumentieren.
- **Acceptance Criterion:** Jede Tabelle hat mindestens 1 SELECT-Policy und 1 Mutating-Policy die auf `auth.uid()` prüft. RLS ist `ENABLED` auf allen Tabellen.
- **Aufwand:** 2h

#### BE-06 — `/api/cron` ohne Monitoring
- **Problem:** Cron-Route existiert, aber kein Alerting wenn sie aufhört zu funktionieren.
- **Maßnahme:** Healthcheck via Betteruptime oder Cronitor (kostenloser Free-Plan) als Dead-Man-Switch einrichten.
- **Aufwand:** 30min

---

## Priorisierte Übersicht

| Priorität | Punkte |
|-----------|--------|
| 🔴 Sofort | LP-01, LP-02, LP-03, DB-01, DB-02, BE-01, BE-02 |
| 🟠 Bald | LP-04, LP-05, LP-06, DB-03, DB-04, BE-03, BE-04 |
| 🟡 Mittel | LP-07–LP-15, DB-05, DB-06, BE-05, BE-06 |

**Gesamtaufwand geschätzt:** ~30h Implementierung + ~5h Testing/Verifikation (insb. BE-05 RLS-Checks und LP-14 Mobile-Tests)

---

## Bewusst ausgeklammert (Out of Scope)

Folgende Punkte aus dem Vorgänger-Backlog (2026-03-21) wurden in diesem Audit bewusst nicht aufgenommen:

| Punkt | Begründung |
|-------|-----------|
| Stripe Billing | Eigenes Projekt — braucht separaten Spec + Plan |
| Test-Suite (Vitest/Playwright) | Langfristig, kein Launch-Blocker |
| Audit-Logs (Supabase Trigger) | Nice-to-have, nach Go-Live |
| Demo-Video / animiertes GIF | Kein Code-Task — Content-Entscheidung |
| Problem-Lösung-Bogen (Seitenstruktur) | Aktuell vorhanden via PainSection → HowItWorks |
| Micro-Interactions Landingpage | CountUp bereits vorhanden, Rest nach Launch |
| How-It-Works mit echten Screenshots | Nach echtem Launch sinnvoller |

---

## Was bereits gut ist (nicht anfassen)

- Hero: Gradient Mesh Background, App-Mockup (Desktop), Typografie mit `clamp()` ✅
- PainSection: Dark-Sektion mit konkreten Zahlen und starkem Text ✅
- ComparisonSection: Vollständige, ehrliche Tabelle ✅
- TrustTechSection: Vorhanden mit korrekten Trust-Signals ✅
- FeaturesSection: Icons, Hover-Micro-Interactions ✅
- PricingSection: Billing-Toggle mit animierter Pille ✅
- Supabase-Integration: vollständig typisiert, alle CRUD-Funktionen ✅
- Auth-Middleware: korrekt implementiert ✅
- PDF-Generierung: serverseitig via `/api/pdf` ✅
