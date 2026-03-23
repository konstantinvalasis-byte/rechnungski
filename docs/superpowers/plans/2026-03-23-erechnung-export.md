# E-Rechnung Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ZUGFeRD PDF und XRechnung XML Export aus bestehenden Rechnungen generieren.

**Architecture:** XML-Generator (`lib/erechnung-xml.ts`) erzeugt CII-konformes XML für beide Profile. Embedding-Modul (`lib/erechnung-embed.ts`) bettet XML per `pdf-lib` in das bestehende `@react-pdf/renderer`-PDF ein. `/api/pdf` Route bekommt optionalen `format`-Parameter. UI-Buttons als Dropdown in `RechnungenListe.tsx`.

**Tech Stack:** pdf-lib, @react-pdf/renderer (bestehend), Next.js API Routes, TypeScript

---

### Task 1: pdf-lib installieren

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Installieren**

```bash
cd c:/Users/Dino/Rechnungski/rechnungski && npm install pdf-lib
```

Expected: pdf-lib in dependencies

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "Füge pdf-lib hinzu für ZUGFeRD-Embedding"
```

---

### Task 2: XML-Generator erstellen

**Files:**
- Create: `lib/erechnung-xml.ts`

- [ ] **Step 1: Datei erstellen** (vollständiger Code unten)

Generiert CII-XML für zwei Profile:
- `zugferd` → `urn:factur-x.eu:1p0:basicwl`
- `xrechnung` → `urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_3.0`

Pflichtfelder aus `Rechnung` + `Firma`:
- Rechnungsnummer, Datum, Fälligkeitsdatum
- Verkäufer (Name, Adresse, Steuernr/USt-IdNr, IBAN)
- Käufer (Name, Adresse)
- Positionen (Beschreibung, Menge, Einzelpreis, MwSt)
- Summen (Netto, MwSt, Brutto)
- Kleinunternehmer → Steuercode `E` statt `S`, kein MwSt-Satz

- [ ] **Step 2: Commit**

```bash
git add lib/erechnung-xml.ts
git commit -m "Füge CII XML-Generator für ZUGFeRD und XRechnung hinzu"
```

---

### Task 3: PDF-Embedding erstellen

**Files:**
- Create: `lib/erechnung-embed.ts`

- [ ] **Step 1: Datei erstellen**

Nimmt `pdfBuffer: Buffer` + `xmlString: string` + `profil: "zugferd" | "xrechnung"`.
Nutzt `pdf-lib` um XML als Embedded File einzufügen:
- Dateiname: `factur-x.xml` (ZUGFeRD) oder `xrechnung.xml` (XRechnung)
- MIME-Type: `application/xml`
- AFRelationship: `Alternative`
- Fügt ZUGFeRD XMP-Metadaten in PDF-Info ein

- [ ] **Step 2: Commit**

```bash
git add lib/erechnung-embed.ts
git commit -m "Füge PDF-Embedding Modul für ZUGFeRD hinzu"
```

---

### Task 4: API-Route erweitern

**Files:**
- Modify: `app/api/pdf/route.ts`

- [ ] **Step 1: `format`-Parameter hinzufügen**

Neuer Body-Parameter: `format?: "pdf" | "zugferd" | "xrechnung"`
- `pdf` (default): bisheriges Verhalten
- `zugferd`: PDF generieren + XML einbetten, als `.pdf` zurückgeben
- `xrechnung`: nur XML generieren, als `application/xml` zurückgeben

- [ ] **Step 2: Commit**

```bash
git add app/api/pdf/route.ts
git commit -m "Erweitere PDF-Route um ZUGFeRD und XRechnung Format"
```

---

### Task 5: Client-Funktionen erweitern

**Files:**
- Modify: `lib/dashboard-pdf.ts`

- [ ] **Step 1: Zwei neue Funktionen hinzufügen**

`downloadZugferd(rechnung, firma)` — ruft `/api/pdf` mit `format: "zugferd"` auf
`downloadXrechnung(rechnung, firma)` — ruft `/api/pdf` mit `format: "xrechnung"` auf, speichert als `.xml`

- [ ] **Step 2: Commit**

```bash
git add lib/dashboard-pdf.ts
git commit -m "Füge ZUGFeRD und XRechnung Download-Funktionen hinzu"
```

---

### Task 6: UI — Export-Dropdown in RechnungenListe

**Files:**
- Modify: `components/dashboard/RechnungenListe.tsx`

- [ ] **Step 1: PDF-Button zu Dropdown erweitern**

Bisheriger PDF-Button wird zu einem 3-Optionen-Dropdown:
1. PDF herunterladen (bestehend)
2. ZUGFeRD PDF — disabled + Tooltip wenn keine Steuernr/USt-IdNr
3. XRechnung XML — disabled + Tooltip wenn keine Steuernr/USt-IdNr

Disabled-Bedingung: `!firma.steuernr && !firma.ustid`
Tooltip: "Steuernummer oder USt-IdNr. in den Einstellungen hinterlegen"

- [ ] **Step 2: Commit**

```bash
git add components/dashboard/RechnungenListe.tsx
git commit -m "Füge E-Rechnung Export-Dropdown in Rechnungsliste hinzu"
```
