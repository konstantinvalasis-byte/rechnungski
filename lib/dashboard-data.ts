// Branchendaten für KI-Vorschläge und Onboarding

export type GVEintrag = {
  beschreibung: string;
  einheit: string;
  preis: number;
  typ?: "arbeit" | "material";
};

export const BRANCHEN_KATEGORIEN: Record<string, string[]> = {
  "Handwerk": ["Elektriker", "Maler", "Klempner/Sanitär", "Schreiner/Tischler", "Fliesenleger", "Dachdecker", "Garten-/Landschaftsbau", "Schlosser/Metallbau"],
  "Kreativ & Digital": ["Webdesign/Entwicklung", "Grafikdesign", "Fotografie", "Videoproduktion", "Social Media Marketing", "Texter/Content"],
  "Beratung & Coaching": ["Unternehmensberatung", "IT-Beratung", "Personal Coaching", "Steuerberatung", "Rechtsberatung"],
  "Gesundheit & Wellness": ["Physiotherapie", "Heilpraktiker", "Personal Training", "Kosmetik/Beauty", "Massage"],
  "Bildung & Schulung": ["Nachhilfe", "Sprachunterricht", "IT-Schulung", "Musikunterricht", "Fahrschule"],
  "Transport & Logistik": ["Umzugsservice", "Kurierdienst", "Transportservice"],
  "Reinigung & Pflege": ["Gebäudereinigung", "Haushaltsservice", "Textilreinigung"],
  "Events & Gastronomie": ["Catering", "DJ/Musik", "Eventplanung", "Veranstaltungstechnik", "Hotel"],
  "Sonstiges": ["Freiberufler (allgemein)", "Sonstige Dienstleistung"],
};

export const GV: Record<string, GVEintrag[]> = {
  // ── HANDWERK ──
  "Elektriker": [
    { beschreibung: "Steckdose installieren", einheit: "Stk", preis: 45, typ: "arbeit" },
    { beschreibung: "Lichtschalter montieren", einheit: "Stk", preis: 35, typ: "arbeit" },
    { beschreibung: "Kabelkanal verlegen", einheit: "m", preis: 18, typ: "material" },
    { beschreibung: "Sicherungskasten prüfen", einheit: "Pauschal", preis: 120, typ: "arbeit" },
    { beschreibung: "LED-Deckenleuchte installieren", einheit: "Stk", preis: 85, typ: "arbeit" },
  ],
  "Maler": [
    { beschreibung: "Wand streichen", einheit: "m²", preis: 12, typ: "arbeit" },
    { beschreibung: "Decke streichen", einheit: "m²", preis: 15, typ: "arbeit" },
    { beschreibung: "Tapezieren (Raufaser)", einheit: "m²", preis: 14, typ: "arbeit" },
    { beschreibung: "Lackierarbeiten Tür", einheit: "Stk", preis: 95, typ: "arbeit" },
    { beschreibung: "Farbe (10L Eimer)", einheit: "Stk", preis: 45, typ: "material" },
  ],
  "Klempner/Sanitär": [
    { beschreibung: "Wasserhahn austauschen", einheit: "Stk", preis: 65, typ: "arbeit" },
    { beschreibung: "Toilette montieren", einheit: "Stk", preis: 180, typ: "arbeit" },
    { beschreibung: "Rohr abdichten", einheit: "Pauschal", preis: 90, typ: "arbeit" },
    { beschreibung: "Heizung entlüften", einheit: "Stk", preis: 25, typ: "arbeit" },
  ],
  "Schreiner/Tischler": [
    { beschreibung: "Tür einsetzen (inkl. Zarge)", einheit: "Stk", preis: 280, typ: "arbeit" },
    { beschreibung: "Laminat verlegen", einheit: "m²", preis: 28, typ: "arbeit" },
    { beschreibung: "Sockelleisten", einheit: "m", preis: 8, typ: "material" },
  ],
  "Fliesenleger": [
    { beschreibung: "Bodenfliesen verlegen", einheit: "m²", preis: 45, typ: "arbeit" },
    { beschreibung: "Wandfliesen verlegen", einheit: "m²", preis: 50, typ: "arbeit" },
    { beschreibung: "Fugen erneuern", einheit: "m", preis: 15, typ: "arbeit" },
  ],
  "Dachdecker": [
    { beschreibung: "Dachziegel ersetzen", einheit: "Stk", preis: 18, typ: "material" },
    { beschreibung: "Dachrinne montieren", einheit: "m", preis: 35, typ: "arbeit" },
    { beschreibung: "Flachdach abdichten", einheit: "m²", preis: 55, typ: "arbeit" },
  ],
  "Garten-/Landschaftsbau": [
    { beschreibung: "Rasen mähen", einheit: "m²", preis: 2.5, typ: "arbeit" },
    { beschreibung: "Pflasterarbeiten", einheit: "m²", preis: 55, typ: "arbeit" },
    { beschreibung: "Baumfällung", einheit: "Stk", preis: 350, typ: "arbeit" },
  ],
  "Schlosser/Metallbau": [
    { beschreibung: "Geländer anfertigen", einheit: "m", preis: 120, typ: "arbeit" },
    { beschreibung: "Schweißarbeiten", einheit: "Std", preis: 75, typ: "arbeit" },
    { beschreibung: "Schloss austauschen", einheit: "Stk", preis: 85, typ: "arbeit" },
  ],
  // ── KREATIV & DIGITAL ──
  "Webdesign/Entwicklung": [
    { beschreibung: "Website erstellen (One-Pager)", einheit: "Pauschal", preis: 1500, typ: "arbeit" },
    { beschreibung: "WordPress Setup", einheit: "Pauschal", preis: 800, typ: "arbeit" },
    { beschreibung: "Webshop (WooCommerce)", einheit: "Pauschal", preis: 3000, typ: "arbeit" },
    { beschreibung: "Wartung/Monat", einheit: "Monat", preis: 120, typ: "arbeit" },
    { beschreibung: "Hosting/Domain (jährlich)", einheit: "Jahr", preis: 150, typ: "material" },
    { beschreibung: "Bug-Fix / Anpassung", einheit: "Std", preis: 95, typ: "arbeit" },
  ],
  "Grafikdesign": [
    { beschreibung: "Logo-Design", einheit: "Pauschal", preis: 500, typ: "arbeit" },
    { beschreibung: "Visitenkarten-Design", einheit: "Pauschal", preis: 200, typ: "arbeit" },
    { beschreibung: "Flyer/Broschüre (A4)", einheit: "Stk", preis: 350, typ: "arbeit" },
    { beschreibung: "Social Media Templates (5er Set)", einheit: "Set", preis: 300, typ: "arbeit" },
    { beschreibung: "Druckkosten", einheit: "Stk", preis: 0.5, typ: "material" },
  ],
  "Fotografie": [
    { beschreibung: "Fotoshooting (2 Std)", einheit: "Pauschal", preis: 350, typ: "arbeit" },
    { beschreibung: "Bildbearbeitung", einheit: "Stk", preis: 15, typ: "arbeit" },
    { beschreibung: "Hochzeitsfotografie (ganzer Tag)", einheit: "Pauschal", preis: 2000, typ: "arbeit" },
    { beschreibung: "Produktfotografie (pro Produkt)", einheit: "Stk", preis: 45, typ: "arbeit" },
    { beschreibung: "Anfahrtspauschale", einheit: "Pauschal", preis: 50, typ: "arbeit" },
  ],
  "Videoproduktion": [
    { beschreibung: "Imagefilm (bis 3 Min)", einheit: "Pauschal", preis: 3500, typ: "arbeit" },
    { beschreibung: "Social Media Clip (30s)", einheit: "Stk", preis: 400, typ: "arbeit" },
    { beschreibung: "Drohnenaufnahmen", einheit: "Std", preis: 200, typ: "arbeit" },
    { beschreibung: "Schnitt & Postproduktion", einheit: "Std", preis: 85, typ: "arbeit" },
  ],
  "Social Media Marketing": [
    { beschreibung: "Social Media Strategie", einheit: "Pauschal", preis: 800, typ: "arbeit" },
    { beschreibung: "Content-Erstellung (Monat)", einheit: "Monat", preis: 600, typ: "arbeit" },
    { beschreibung: "Community Management", einheit: "Monat", preis: 400, typ: "arbeit" },
    { beschreibung: "Werbebudget (durchlaufend)", einheit: "Monat", preis: 500, typ: "material" },
    { beschreibung: "Reporting & Analytics", einheit: "Monat", preis: 200, typ: "arbeit" },
  ],
  "Texter/Content": [
    { beschreibung: "Blogbeitrag (1000 Wörter)", einheit: "Stk", preis: 150, typ: "arbeit" },
    { beschreibung: "Website-Texte (komplett)", einheit: "Pauschal", preis: 800, typ: "arbeit" },
    { beschreibung: "Produktbeschreibung", einheit: "Stk", preis: 50, typ: "arbeit" },
    { beschreibung: "Newsletter-Text", einheit: "Stk", preis: 120, typ: "arbeit" },
    { beschreibung: "Lektorat (pro Seite)", einheit: "Seite", preis: 8, typ: "arbeit" },
  ],
  // ── BERATUNG ──
  "Unternehmensberatung": [
    { beschreibung: "Strategieberatung", einheit: "Std", preis: 180, typ: "arbeit" },
    { beschreibung: "Workshop (halber Tag)", einheit: "Pauschal", preis: 1200, typ: "arbeit" },
    { beschreibung: "Geschäftsplan erstellen", einheit: "Pauschal", preis: 2500, typ: "arbeit" },
    { beschreibung: "Prozessoptimierung", einheit: "Tag", preis: 1400, typ: "arbeit" },
  ],
  "IT-Beratung": [
    { beschreibung: "IT-Audit", einheit: "Pauschal", preis: 1500, typ: "arbeit" },
    { beschreibung: "System-Setup", einheit: "Std", preis: 120, typ: "arbeit" },
    { beschreibung: "Datenmigration", einheit: "Pauschal", preis: 800, typ: "arbeit" },
    { beschreibung: "Support-Vertrag (Monat)", einheit: "Monat", preis: 300, typ: "arbeit" },
    { beschreibung: "Lizenzkosten (durchlaufend)", einheit: "Stk", preis: 50, typ: "material" },
  ],
  "Personal Coaching": [
    { beschreibung: "Einzel-Coaching (60 Min)", einheit: "Stk", preis: 150, typ: "arbeit" },
    { beschreibung: "5er-Paket Coaching", einheit: "Paket", preis: 650, typ: "arbeit" },
    { beschreibung: "Team-Coaching (halber Tag)", einheit: "Pauschal", preis: 900, typ: "arbeit" },
    { beschreibung: "Online-Coaching (60 Min)", einheit: "Stk", preis: 120, typ: "arbeit" },
  ],
  "Steuerberatung": [
    { beschreibung: "Einkommensteuererklärung", einheit: "Pauschal", preis: 400, typ: "arbeit" },
    { beschreibung: "Buchhaltung (Monat)", einheit: "Monat", preis: 250, typ: "arbeit" },
    { beschreibung: "Jahresabschluss", einheit: "Pauschal", preis: 1500, typ: "arbeit" },
    { beschreibung: "Beratungsgespräch", einheit: "Std", preis: 180, typ: "arbeit" },
  ],
  "Rechtsberatung": [
    { beschreibung: "Erstberatung", einheit: "Pauschal", preis: 250, typ: "arbeit" },
    { beschreibung: "Vertragsprüfung", einheit: "Stk", preis: 350, typ: "arbeit" },
    { beschreibung: "Abmahnung verfassen", einheit: "Stk", preis: 500, typ: "arbeit" },
    { beschreibung: "Stundensatz Beratung", einheit: "Std", preis: 200, typ: "arbeit" },
  ],
  // ── GESUNDHEIT ──
  "Physiotherapie": [
    { beschreibung: "Krankengymnastik (30 Min)", einheit: "Stk", preis: 40, typ: "arbeit" },
    { beschreibung: "Manuelle Therapie (25 Min)", einheit: "Stk", preis: 50, typ: "arbeit" },
    { beschreibung: "Hausbesuch-Zuschlag", einheit: "Stk", preis: 15, typ: "arbeit" },
    { beschreibung: "Lymphdrainage (45 Min)", einheit: "Stk", preis: 55, typ: "arbeit" },
  ],
  "Heilpraktiker": [
    { beschreibung: "Anamnese-Erstgespräch", einheit: "Pauschal", preis: 120, typ: "arbeit" },
    { beschreibung: "Behandlung (60 Min)", einheit: "Stk", preis: 80, typ: "arbeit" },
    { beschreibung: "Akupunktur-Sitzung", einheit: "Stk", preis: 70, typ: "arbeit" },
  ],
  "Personal Training": [
    { beschreibung: "Personal Training (60 Min)", einheit: "Stk", preis: 80, typ: "arbeit" },
    { beschreibung: "10er-Karte Training", einheit: "Paket", preis: 700, typ: "arbeit" },
    { beschreibung: "Ernährungsplan", einheit: "Pauschal", preis: 150, typ: "arbeit" },
    { beschreibung: "Online-Trainingsplan", einheit: "Monat", preis: 100, typ: "arbeit" },
  ],
  "Kosmetik/Beauty": [
    { beschreibung: "Gesichtsbehandlung", einheit: "Stk", preis: 75, typ: "arbeit" },
    { beschreibung: "Maniküre", einheit: "Stk", preis: 35, typ: "arbeit" },
    { beschreibung: "Wimpernverlängerung", einheit: "Stk", preis: 120, typ: "arbeit" },
    { beschreibung: "Produkte (durchlaufend)", einheit: "Stk", preis: 25, typ: "material" },
  ],
  "Massage": [
    { beschreibung: "Klassische Massage (60 Min)", einheit: "Stk", preis: 65, typ: "arbeit" },
    { beschreibung: "Hot-Stone Massage (90 Min)", einheit: "Stk", preis: 95, typ: "arbeit" },
    { beschreibung: "Sportmassage (45 Min)", einheit: "Stk", preis: 55, typ: "arbeit" },
  ],
  // ── BILDUNG ──
  "Nachhilfe": [
    { beschreibung: "Einzelnachhilfe (60 Min)", einheit: "Stk", preis: 35, typ: "arbeit" },
    { beschreibung: "Gruppennachhilfe (90 Min)", einheit: "Stk", preis: 25, typ: "arbeit" },
    { beschreibung: "Prüfungsvorbereitung (Paket)", einheit: "Paket", preis: 250, typ: "arbeit" },
    { beschreibung: "Online-Nachhilfe (60 Min)", einheit: "Stk", preis: 30, typ: "arbeit" },
  ],
  "Sprachunterricht": [
    { beschreibung: "Einzelunterricht (60 Min)", einheit: "Stk", preis: 45, typ: "arbeit" },
    { beschreibung: "Gruppenunterricht (90 Min)", einheit: "Stk", preis: 30, typ: "arbeit" },
    { beschreibung: "Intensivkurs (Woche)", einheit: "Woche", preis: 400, typ: "arbeit" },
    { beschreibung: "Lehrmaterial", einheit: "Stk", preis: 25, typ: "material" },
  ],
  "IT-Schulung": [
    { beschreibung: "Einzel-Schulung (Std)", einheit: "Std", preis: 100, typ: "arbeit" },
    { beschreibung: "Gruppen-Workshop (Tag)", einheit: "Tag", preis: 1200, typ: "arbeit" },
    { beschreibung: "Online-Kurs erstellen", einheit: "Pauschal", preis: 2000, typ: "arbeit" },
  ],
  "Musikunterricht": [
    { beschreibung: "Einzelunterricht (45 Min)", einheit: "Stk", preis: 40, typ: "arbeit" },
    { beschreibung: "Monatspauschale (4x)", einheit: "Monat", preis: 140, typ: "arbeit" },
    { beschreibung: "Probenstunde", einheit: "Stk", preis: 30, typ: "arbeit" },
  ],
  "Fahrschule": [
    { beschreibung: "Fahrstunde (45 Min)", einheit: "Stk", preis: 55, typ: "arbeit" },
    { beschreibung: "Sonderfahrt (Autobahn)", einheit: "Stk", preis: 65, typ: "arbeit" },
    { beschreibung: "Theorieunterricht", einheit: "Stk", preis: 25, typ: "arbeit" },
    { beschreibung: "Grundgebühr", einheit: "Pauschal", preis: 350, typ: "arbeit" },
  ],
  // ── TRANSPORT ──
  "Umzugsservice": [
    { beschreibung: "Umzugshelfer (Std)", einheit: "Std", preis: 35, typ: "arbeit" },
    { beschreibung: "LKW-Miete (Tag)", einheit: "Tag", preis: 150, typ: "material" },
    { beschreibung: "Möbelmontage", einheit: "Pauschal", preis: 200, typ: "arbeit" },
    { beschreibung: "Verpackungsmaterial", einheit: "Pauschal", preis: 80, typ: "material" },
  ],
  "Kurierdienst": [
    { beschreibung: "Stadtlieferung", einheit: "Stk", preis: 15, typ: "arbeit" },
    { beschreibung: "Express-Lieferung", einheit: "Stk", preis: 35, typ: "arbeit" },
    { beschreibung: "Kilometer-Pauschale", einheit: "km", preis: 0.8, typ: "arbeit" },
  ],
  "Transportservice": [
    { beschreibung: "Kleintransport (bis 3,5t)", einheit: "Fahrt", preis: 120, typ: "arbeit" },
    { beschreibung: "Schwertransport", einheit: "Fahrt", preis: 350, typ: "arbeit" },
    { beschreibung: "km-Zuschlag", einheit: "km", preis: 1.2, typ: "arbeit" },
  ],
  // ── REINIGUNG ──
  "Gebäudereinigung": [
    { beschreibung: "Unterhaltsreinigung", einheit: "m²", preis: 3.5, typ: "arbeit" },
    { beschreibung: "Grundreinigung", einheit: "m²", preis: 8, typ: "arbeit" },
    { beschreibung: "Fensterreinigung", einheit: "Stk", preis: 12, typ: "arbeit" },
    { beschreibung: "Reinigungsmittel", einheit: "Pauschal", preis: 25, typ: "material" },
  ],
  "Haushaltsservice": [
    { beschreibung: "Haushaltsreinigung (Std)", einheit: "Std", preis: 30, typ: "arbeit" },
    { beschreibung: "Bügel-Service (Std)", einheit: "Std", preis: 25, typ: "arbeit" },
    { beschreibung: "Wochenpauschale (3x)", einheit: "Woche", preis: 180, typ: "arbeit" },
  ],
  "Textilreinigung": [
    { beschreibung: "Anzug reinigen", einheit: "Stk", preis: 18, typ: "arbeit" },
    { beschreibung: "Hemd waschen & bügeln", einheit: "Stk", preis: 5, typ: "arbeit" },
    { beschreibung: "Teppichreinigung", einheit: "m²", preis: 15, typ: "arbeit" },
  ],
  // ── EVENTS ──
  "Catering": [
    { beschreibung: "Fingerfood-Buffet (pro Person)", einheit: "Pers.", preis: 25, typ: "material" },
    { beschreibung: "3-Gänge-Menü (pro Person)", einheit: "Pers.", preis: 55, typ: "material" },
    { beschreibung: "Service-Personal (Std)", einheit: "Std", preis: 30, typ: "arbeit" },
    { beschreibung: "Equipment-Miete", einheit: "Pauschal", preis: 200, typ: "material" },
  ],
  "DJ/Musik": [
    { beschreibung: "DJ-Set (4 Std)", einheit: "Pauschal", preis: 500, typ: "arbeit" },
    { beschreibung: "Jede weitere Stunde", einheit: "Std", preis: 100, typ: "arbeit" },
    { beschreibung: "Licht- & Soundanlage", einheit: "Pauschal", preis: 300, typ: "material" },
    { beschreibung: "Anfahrt", einheit: "Pauschal", preis: 50, typ: "arbeit" },
  ],
  "Eventplanung": [
    { beschreibung: "Eventkonzept", einheit: "Pauschal", preis: 800, typ: "arbeit" },
    { beschreibung: "Koordination am Tag", einheit: "Tag", preis: 600, typ: "arbeit" },
    { beschreibung: "Location-Suche", einheit: "Pauschal", preis: 300, typ: "arbeit" },
  ],
  "Veranstaltungstechnik": [
    { beschreibung: "PA-Anlage (Miete/Tag)", einheit: "Tag", preis: 250, typ: "material" },
    { beschreibung: "Lichttechnik (Miete/Tag)", einheit: "Tag", preis: 200, typ: "material" },
    { beschreibung: "Techniker vor Ort (Std)", einheit: "Std", preis: 65, typ: "arbeit" },
    { beschreibung: "Auf-/Abbau", einheit: "Pauschal", preis: 300, typ: "arbeit" },
  ],
  "Hotel": [
    { beschreibung: "Übernachtung (Einzelzimmer)", einheit: "Nacht", preis: 90 },
    { beschreibung: "Übernachtung (Doppelzimmer)", einheit: "Nacht", preis: 130 },
    { beschreibung: "Frühstück (pro Person)", einheit: "Pers.", preis: 18 },
    { beschreibung: "Halbpension (pro Person)", einheit: "Pers.", preis: 35 },
    { beschreibung: "Tagungspauschale", einheit: "Pers.", preis: 75 },
    { beschreibung: "Parkplatz (pro Tag)", einheit: "Tag", preis: 12 },
  ],
  // ── SONSTIGES ──
  "Freiberufler (allgemein)": [
    { beschreibung: "Stundensatz", einheit: "Std", preis: 80, typ: "arbeit" },
    { beschreibung: "Tagessatz", einheit: "Tag", preis: 600, typ: "arbeit" },
    { beschreibung: "Projektpauschale", einheit: "Pauschal", preis: 2000, typ: "arbeit" },
    { beschreibung: "Reisekosten", einheit: "Pauschal", preis: 50, typ: "material" },
  ],
  "Sonstige Dienstleistung": [
    { beschreibung: "Dienstleistung (Std)", einheit: "Std", preis: 60, typ: "arbeit" },
    { beschreibung: "Pauschalauftrag", einheit: "Pauschal", preis: 500, typ: "arbeit" },
    { beschreibung: "Materialkosten", einheit: "Pauschal", preis: 100, typ: "material" },
    { beschreibung: "Anfahrt", einheit: "Pauschal", preis: 30, typ: "arbeit" },
  ],
};
