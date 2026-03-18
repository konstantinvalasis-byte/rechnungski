"use client";
import { useState, useEffect, useRef, Component } from "react";

interface Firma {
  name: string;
  inhaber?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  telefon?: string;
  email?: string;
  web?: string;
  steuernr?: string;
  ustid?: string;
  bankName?: string;
  iban?: string;
  bic?: string;
  gewerk?: string;
  logo?: string;
  kleinunternehmer?: boolean;
}

interface Position {
  id: string;
  beschreibung: string;
  einheit: string;
  menge: number;
  preis: number;
  mwst: number;
  typ: "arbeit" | "material";
}

interface Rechnung {
  id: string;
  nummer: string;
  typ?: string;
  datum: string;
  faelligDatum: string;
  kundeId: string;
  kundeName: string;
  kundeAdresse: string;
  kundeEmail: string;
  positionen: Position[];
  netto: number;
  mwst: number;
  gesamt: number;
  zahlungsziel: number;
  notiz: string;
  status: string;
  gewerk: string;
  rabatt: number;
  zeitraumVon: string;
  zeitraumBis: string;
  mahnStufe?: number;
  mahnstufe?: number;
}

interface Kunde {
  id: string;
  name: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  email?: string;
  telefon?: string;
}

interface FavoritItem {
  id: string;
  beschreibung: string;
  einheit: string;
  preis: number;
  mwst?: number;
  typ: "arbeit" | "material";
}

interface WiederkehrendItem {
  id: string;
  kundeId: string;
  kundeName: string;
  kundeAdresse: string;
  kundeEmail: string;
  positionen: Position[];
  netto: number;
  mwst: number;
  gesamt: number;
  zahlungsziel: number;
  notiz: string;
  gewerk: string;
  rabatt: number;
  interval: "monatlich" | "quartal" | "jaehrlich";
  nextDue: string;
  aktiv: boolean;
  name?: string;
}

interface ErrorBoundaryState { hasError: boolean; }

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e: Error, i: React.ErrorInfo) { console.error("RechnungsKI:", e, i); }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050510] text-slate-200 gap-5 p-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-danger-500/20 to-danger-600/10 border border-danger-500/20 flex items-center justify-center text-3xl backdrop-blur-sm">⚠️</div>
        <h2 className="text-xl font-bold tracking-tight">Unerwarteter Fehler</h2>
        <p className="text-sm text-slate-500 text-center max-w-sm leading-relaxed">Die App hat einen Fehler. Deine Daten sind sicher – bitte lade die Seite neu.</p>
        <button className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl cursor-pointer text-sm font-semibold hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all duration-200" onClick={() => window.location.reload()}>Neu laden</button>
      </div>
    );
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════
// GEWERK DATA
// ═══════════════════════════════════════════════════════════
// Kategorien für den Onboarding-Wizard
const BRANCHEN_KATEGORIEN = {
  "Handwerk": ["Elektriker", "Maler", "Klempner/Sanitär", "Schreiner/Tischler", "Fliesenleger", "Dachdecker", "Garten-/Landschaftsbau", "Schlosser/Metallbau"],
  "Kreativ & Digital": ["Webdesign/Entwicklung", "Grafikdesign", "Fotografie", "Videoproduktion", "Social Media Marketing", "Texter/Content"],
  "Beratung & Coaching": ["Unternehmensberatung", "IT-Beratung", "Personal Coaching", "Steuerberatung", "Rechtsberatung"],
  "Gesundheit & Wellness": ["Physiotherapie", "Heilpraktiker", "Personal Training", "Kosmetik/Beauty", "Massage"],
  "Bildung & Schulung": ["Nachhilfe", "Sprachunterricht", "IT-Schulung", "Musikunterricht", "Fahrschule"],
  "Transport & Logistik": ["Umzugsservice", "Kurierdienst", "Transportservice"],
  "Reinigung & Pflege": ["Gebäudereinigung", "Haushaltsservice", "Textilreinigung"],
  "Events & Gastronomie": ["Catering", "DJ/Musik", "Eventplanung", "Veranstaltungstechnik"],
  "Sonstiges": ["Freiberufler (allgemein)", "Sonstige Dienstleistung"],
};

const GV = {
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
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fc = (v: number): string => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v);
const fd = (d: string): string => d ? new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–";
const fcn = (v: number): string => v.toFixed(2).replace(".", ",");
const he = (s: unknown): string => s == null ? "" : String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const safeSrc = (s: unknown): string | null => s && /^data:image\/(jpeg|png|gif|webp|svg\+xml);base64,/.test(String(s)) ? String(s) : null;

// ═══════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════
const IC = {
  dash: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  doc: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  users: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  gear: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  plus: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  star: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  alert: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  euro: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 5.5C15.6 4.5 13.9 4 12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8c1.9 0 3.6-.5 5-1.5"/><line x1="4" y1="10" x2="15" y2="10"/><line x1="4" y1="14" x2="15" y2="14"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  copy: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  img: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  crown: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 20h20"/><path d="M4 20V10l4 4 4-8 4 8 4-4v10"/></svg>,
  eye: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  pdf: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
  mail: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>,
  dl: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  shield: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  db: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
};

// ═══════════════════════════════════════════════════════════
// STORAGE (local – wird durch Supabase ersetzt)
// ═══════════════════════════════════════════════════════════
function ld(k: string, fb: unknown): unknown { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } }
function sv(k: string, v: unknown): void { try { const s = JSON.stringify(v); if (s.length > 4000000) { console.warn("RechnungsKI: Datenmenge zu groß –", k); return; } localStorage.setItem(k, s); } catch (e) { console.error("RechnungsKI: Speicherfehler:", k, e); } }

// ═══════════════════════════════════════════════════════════
// §14 UStG VALIDATION
// ═══════════════════════════════════════════════════════════
function validateFirma(f: Firma | null): string[] {
  const e: string[] = [];
  if (!f?.name) e.push("Firmenname");
  if (!f?.strasse) e.push("Anschrift");
  if (!f?.plz || !f?.ort) e.push("PLZ/Ort");
  if (!f?.steuernr && !f?.ustid) e.push("Steuernr./USt-ID (§14)");
  return e;
}
function validateRechnung(r: Rechnung, f: Firma | null): string[] {
  const e = validateFirma(f);
  if (!r.kundeName) e.push("Kundenname");
  if (!r.kundeAdresse || r.kundeAdresse.includes("undefined")) e.push("Kundenadresse");
  if (!r.positionen?.length) e.push("Positionen");
  if (r.positionen?.some(p => !p.beschreibung || p.preis <= 0)) e.push("Pos. unvollständig");
  return e;
}

// DATEV
function datevCSV(re: Rechnung[]): string {
  const h = "Umsatz;S/H;WKZ;Kurs;Basis;WKZ-B;Konto;Gegenkonto;BU;Belegdatum;Beleg1;Beleg2;Skonto;Text";
  const rows = re.filter(r => r.status !== "angebot" && r.status !== "storniert").map(r => {
    const d = new Date(r.datum); return `${fcn(r.gesamt)};S;EUR;;;;;;8400;;${String(d.getDate()).padStart(2,"0")}${String(d.getMonth()+1).padStart(2,"0")};${r.nummer};;0,00;${r.kundeName}`;
  });
  return h + "\n" + rows.join("\n");
}

// Mahnung
function mahnung(r: Rechnung, f: Firma, s: number = 1): string {
  const t: Record<number, string> = { 1: `Sehr geehrte Damen und Herren,\n\nwir erinnern freundlich an die Zahlung unserer Rechnung ${r.nummer} vom ${fd(r.datum)} über ${fc(r.gesamt)}.\n\nZahlungsziel: ${fd(r.faelligDatum)}. Bitte überweisen Sie innerhalb von 7 Tagen.\n\nBank: ${f.bankName || "–"}\nIBAN: ${f.iban || "–"}\n\nMit freundlichen Grüßen\n${f.name}`, 2: `Sehr geehrte Damen und Herren,\n\nbis heute liegt kein Zahlungseingang für Rechnung ${r.nummer} über ${fc(r.gesamt)} vor.\n\nBitte begleichen Sie den Betrag innerhalb von 5 Werktagen.\n\nMit freundlichen Grüßen\n${f.name}`, 3: `LETZTE MAHNUNG\n\nRechnung ${r.nummer} über ${fc(r.gesamt)}.\n\nBei Nichtzahlung innerhalb 3 Werktagen erfolgt Übergabe an Inkasso.\n\n${f.name}` };
  return t[s] || t[1];
}

// ═══════════════════════════════════════════════════════════
// PDF GENERATOR (pure JS, no dependencies)
// Uses window.print() on a styled hidden iframe for real PDF
// ═══════════════════════════════════════════════════════════
function generatePdfHtml(rechnung: Rechnung, firma: Firma): string {
  const pos = rechnung.positionen || [];
  const arbeit = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const mat = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);

  const safeLogo = safeSrc(firma.logo);
  const logoHtml = safeLogo ? `<img src="${safeLogo}" style="max-height:55px;max-width:170px;object-fit:contain;margin-bottom:8px;" />` : "";

  const rows = pos.map((p, i) => `
    <tr>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;color:#666">${i + 1}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;font-weight:500">${he(p.beschreibung)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:10px;color:#888">${p.typ === "material" ? "Material" : "Arbeit"}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${he(String(p.menge))} ${he(p.einheit)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${fc(p.preis)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${Number(p.mwst)}%</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-weight:600">${fc(p.menge * p.preis)}</td>
    </tr>`).join("");

  const nettoVR = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = nettoVR * (rechnung.rabatt || 0) / 100;
  const mwstB = pos.reduce((s, p) => s + p.menge * p.preis * (1 - (rechnung.rabatt || 0) / 100) * p.mwst / 100, 0);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#111;padding:40px 48px;font-size:13px;line-height:1.5}
    @media print{body{padding:30px 36px}@page{margin:15mm 12mm;size:A4}}
    table{width:100%;border-collapse:collapse}
    .sum-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}
    .sum-total{font-size:18px;font-weight:700;border-top:2px solid #111;padding-top:8px;margin-top:4px}
  </style></head><body>
    <div style="display:flex;justify-content:space-between;margin-bottom:30px">
      <div>
        ${logoHtml}
        <div style="font-size:17px;font-weight:700">${he(firma.name)}</div>
        <div style="font-size:11px;color:#666">${firma.inhaber ? he(firma.inhaber) + " · " : ""}${he(firma.strasse)}<br>${he(firma.plz)} ${he(firma.ort)}</div>
        ${firma.telefon ? `<div style="font-size:11px;color:#666">Tel: ${he(firma.telefon)}</div>` : ""}
        ${firma.email ? `<div style="font-size:11px;color:#666">${he(firma.email)}</div>` : ""}
      </div>
      <div style="text-align:right">
        <div style="font-size:24px;font-weight:800;color:#4f46e5;text-transform:uppercase">${rechnung.typ === "angebot" ? "Angebot" : "Rechnung"}</div>
        <div style="font-size:12px;color:#666;margin-top:4px">Nr. ${he(rechnung.nummer)}</div>
        <div style="font-size:12px;color:#666">Datum: ${fd(rechnung.datum)}</div>
        ${rechnung.faelligDatum ? `<div style="font-size:12px;color:#666">Fällig: ${fd(rechnung.faelligDatum)}</div>` : ""}
        ${rechnung.zeitraumVon && rechnung.zeitraumBis ? `<div style="font-size:11px;color:#666;margin-top:4px">Leistungszeitraum: ${fd(rechnung.zeitraumVon)} – ${fd(rechnung.zeitraumBis)}</div>` : ""}
      </div>
    </div>

    <div style="background:#f8f9fa;border-radius:6px;padding:14px;margin-bottom:24px">
      <div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">${rechnung.typ === "angebot" ? "Angebot an" : "Rechnungsempfänger"}</div>
      <div style="font-weight:600">${he(rechnung.kundeName)}</div>
      <div style="font-size:12px;color:#666">${he(rechnung.kundeAdresse)}</div>
    </div>

    <table style="margin-bottom:22px">
      <thead><tr style="border-bottom:2px solid #e5e7eb">
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:left">Pos</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:left">Beschreibung</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:left">Typ</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">Menge</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">Preis</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">MwSt</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">Summe</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="display:flex;justify-content:flex-end">
      <div style="width:270px">
        ${arbeit > 0 ? `<div class="sum-row" style="font-size:12px;color:#666"><span>Arbeitskosten</span><span>${fc(arbeit)}</span></div>` : ""}
        ${mat > 0 ? `<div class="sum-row" style="font-size:12px;color:#666"><span>Materialkosten</span><span>${fc(mat)}</span></div>` : ""}
        <div class="sum-row"><span>Netto</span><span>${fc(nettoVR)}</span></div>
        ${rechnung.rabatt > 0 ? `<div class="sum-row" style="color:#ef4444"><span>Rabatt (${rechnung.rabatt}%)</span><span>-${fc(rabattB)}</span></div>` : ""}
        <div class="sum-row"><span>MwSt</span><span>${fc(mwstB)}</span></div>
        <div class="sum-row sum-total"><span>Brutto</span><span>${fc(rechnung.gesamt)}</span></div>
      </div>
    </div>

    ${rechnung.notiz ? `<div style="margin-top:18px;padding:10px;background:#f8f9fa;border-radius:5px;font-size:11px;color:#666"><strong>Hinweis:</strong> ${he(rechnung.notiz)}</div>` : ""}
    ${firma.kleinunternehmer ? `<div style="margin-top:12px;padding:8px 10px;background:#fffbeb;border:1px solid #fde68a;border-radius:5px;font-size:11px;color:#92400e">Gemäß §19 UStG wird keine Umsatzsteuer berechnet.</div>` : ""}

    <div style="margin-top:28px;padding-top:14px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#999">
      <span>${firma.bankName ? he(firma.bankName) + " · " : ""}${firma.iban ? "IBAN: " + he(firma.iban) : ""}</span>
      <span>${firma.steuernr ? "St.Nr: " + he(firma.steuernr) : ""}${firma.ustid ? " · USt-ID: " + he(firma.ustid) : ""}</span>
    </div>
  </body></html>`;
}

function generateMahnungPdfHtml(rechnung: Rechnung, firma: Firma, stufe: number): string {
  const text = mahnung(rechnung, firma, stufe);
  const stufenLabel = { 1: "Zahlungserinnerung", 2: "Zweite Mahnung", 3: "Letzte Mahnung" }[stufe] || "Mahnung";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#111;padding:40px 48px;font-size:13px;line-height:1.6}
    @media print{body{padding:30px 36px}@page{margin:15mm 12mm;size:A4}}
  </style></head><body>
    <div style="display:flex;justify-content:space-between;margin-bottom:40px;align-items:flex-start">
      <div>${safeSrc(firma.logo) ? `<img src="${safeSrc(firma.logo)}" style="max-height:50px;max-width:160px;object-fit:contain;margin-bottom:6px;" />` : ""}<div style="font-size:16px;font-weight:700">${he(firma.name)}</div><div style="font-size:11px;color:#666">${he(firma.strasse || "")}, ${he(firma.plz || "")} ${he(firma.ort || "")}</div></div>
      <div style="text-align:right"><div style="font-size:20px;font-weight:800;color:#ef4444;text-transform:uppercase">${he(stufenLabel)}</div><div style="font-size:12px;color:#666;margin-top:4px">Datum: ${fd(new Date().toISOString())}</div><div style="font-size:12px;color:#666">Zu Rechnung: ${he(rechnung.nummer)}</div></div>
    </div>
    <div style="margin-bottom:24px"><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">An</div><div style="font-weight:600">${he(rechnung.kundeName)}</div><div style="font-size:12px;color:#666">${he(rechnung.kundeAdresse || "")}</div></div>
    <div style="white-space:pre-line;font-size:13px;line-height:1.8;margin-bottom:32px">${he(text)}</div>
    <div style="margin-top:32px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:10px;color:#999;display:flex;justify-content:space-between">
      <span>${firma.bankName ? he(firma.bankName) + " · " : ""}${firma.iban ? "IBAN: " + he(firma.iban) : ""}</span>
      <span>${firma.steuernr ? "St.Nr: " + he(firma.steuernr) : ""}${firma.ustid ? " · USt-ID: " + he(firma.ustid) : ""}</span>
    </div>
  </body></html>`;
}

async function openAsPdf(html: string) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, { position: "fixed", top: "0", left: "-9999px", width: "794px", height: "1123px", border: "none", visibility: "hidden" });
  document.body.appendChild(iframe);

  await new Promise<void>(resolve => {
    iframe.onload = () => resolve();
    iframe.contentDocument!.write(html);
    iframe.contentDocument!.close();
  });

  await new Promise(r => setTimeout(r, 400)); // Fonts laden lassen

  try {
    const canvas = await html2canvas(iframe.contentDocument!.body, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff",
      width: 794, scrollX: 0, scrollY: 0, windowWidth: 794,
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pW = pdf.internal.pageSize.getWidth();
    const pH = pdf.internal.pageSize.getHeight();
    const imgH = canvas.height * (pW / canvas.width);
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    pdf.addImage(imgData, "JPEG", 0, 0, pW, imgH);
    let pos = -pH;
    let remaining = imgH - pH;
    while (remaining > 0) {
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, pos, pW, imgH);
      pos -= pH;
      remaining -= pH;
    }

    window.open(URL.createObjectURL(pdf.output("blob")), "_blank");
  } finally {
    document.body.removeChild(iframe);
  }
}

function downloadPdf(rechnung: Rechnung, firma: Firma): void {
  openAsPdf(generatePdfHtml(rechnung, firma));
}

async function generatePdfBase64(html: string): Promise<string> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, { position: "fixed", top: "0", left: "-9999px", width: "794px", height: "1123px", border: "none", visibility: "hidden" });
  document.body.appendChild(iframe);
  await new Promise<void>(resolve => { iframe.onload = () => resolve(); iframe.contentDocument!.write(html); iframe.contentDocument!.close(); });
  await new Promise(r => setTimeout(r, 400));
  try {
    const canvas = await html2canvas(iframe.contentDocument!.body, { scale: 2, useCORS: true, backgroundColor: "#ffffff", width: 794, scrollX: 0, scrollY: 0, windowWidth: 794 });
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pW = pdf.internal.pageSize.getWidth();
    const pH = pdf.internal.pageSize.getHeight();
    const imgH = canvas.height * (pW / canvas.width);
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData, "JPEG", 0, 0, pW, imgH);
    let pos = -pH; let remaining = imgH - pH;
    while (remaining > 0) { pdf.addPage(); pdf.addImage(imgData, "JPEG", 0, pos, pW, imgH); pos -= pH; remaining -= pH; }
    return pdf.output("datauristring").split(",")[1];
  } finally {
    document.body.removeChild(iframe);
  }
}

// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIG & HELPERS
// ═══════════════════════════════════════════════════════════
const SUPABASE_SQL_SCHEMA = `-- RechnungsKI Supabase Schema
-- Führe dieses SQL in deinem Supabase SQL Editor aus

-- 1. Firmen-Profil
CREATE TABLE IF NOT EXISTS firmen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  inhaber TEXT,
  strasse TEXT,
  plz TEXT,
  ort TEXT,
  telefon TEXT,
  email TEXT,
  web TEXT,
  steuernr TEXT,
  ustid TEXT,
  bank_name TEXT,
  iban TEXT,
  bic TEXT,
  gewerk TEXT,
  logo TEXT, -- base64 or URL
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kunden
CREATE TABLE IF NOT EXISTS kunden (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firma_id UUID REFERENCES firmen(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  strasse TEXT,
  plz TEXT,
  ort TEXT,
  email TEXT,
  telefon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Rechnungen
CREATE TABLE IF NOT EXISTS rechnungen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firma_id UUID REFERENCES firmen(id) ON DELETE CASCADE,
  kunde_id UUID REFERENCES kunden(id),
  nummer TEXT NOT NULL,
  typ TEXT DEFAULT 'rechnung', -- rechnung | angebot
  datum DATE NOT NULL,
  faellig_datum DATE,
  kunde_name TEXT,
  kunde_adresse TEXT,
  kunde_email TEXT,
  netto DECIMAL(12,2),
  mwst DECIMAL(12,2),
  gesamt DECIMAL(12,2),
  rabatt DECIMAL(5,2) DEFAULT 0,
  zahlungsziel INTEGER DEFAULT 14,
  notiz TEXT,
  status TEXT DEFAULT 'offen', -- offen | bezahlt | gemahnt | storniert | angebot
  gewerk TEXT,
  zeitraum_von DATE,
  zeitraum_bis DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Positionen
CREATE TABLE IF NOT EXISTS positionen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rechnung_id UUID REFERENCES rechnungen(id) ON DELETE CASCADE,
  beschreibung TEXT NOT NULL,
  menge DECIMAL(10,2) DEFAULT 1,
  einheit TEXT DEFAULT 'Stk',
  preis DECIMAL(12,2) NOT NULL,
  mwst INTEGER DEFAULT 19,
  typ TEXT DEFAULT 'arbeit', -- arbeit | material
  position_nr INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS (Row Level Security)
ALTER TABLE firmen ENABLE ROW LEVEL SECURITY;
ALTER TABLE kunden ENABLE ROW LEVEL SECURITY;
ALTER TABLE rechnungen ENABLE ROW LEVEL SECURITY;
ALTER TABLE positionen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own firma" ON firmen
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own kunden" ON kunden
  FOR ALL USING (firma_id IN (SELECT id FROM firmen WHERE user_id = auth.uid()));

CREATE POLICY "Users can CRUD own rechnungen" ON rechnungen
  FOR ALL USING (firma_id IN (SELECT id FROM firmen WHERE user_id = auth.uid()));

CREATE POLICY "Users can CRUD own positionen" ON positionen
  FOR ALL USING (rechnung_id IN (
    SELECT id FROM rechnungen WHERE firma_id IN (
      SELECT id FROM firmen WHERE user_id = auth.uid()
    )
  ));

-- 6. Indexes
CREATE INDEX idx_rechnungen_firma ON rechnungen(firma_id);
CREATE INDEX idx_rechnungen_status ON rechnungen(status);
CREATE INDEX idx_kunden_firma ON kunden(firma_id);
CREATE INDEX idx_positionen_rechnung ON positionen(rechnung_id);

-- 7. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_modified()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER firmen_updated BEFORE UPDATE ON firmen
  FOR EACH ROW EXECUTE FUNCTION update_modified();
CREATE TRIGGER rechnungen_updated BEFORE UPDATE ON rechnungen
  FOR EACH ROW EXECUTE FUNCTION update_modified();
`;

const _SB_PKG = ["@","supa","base/supa","base-js"].join("");
const SUPABASE_JS_CODE = [
  "// npm install " + _SB_PKG,
  "",
  "// " + _SB_PKG + " einbinden:",
  "// const { createClient } = require('" + _SB_PKG + "')",
  "",
  "const supabase = createClient(",
  "  'https://DEIN-PROJEKT.supabase.co',",
  "  'DEIN-ANON-KEY'",
  ")",
  "",
  "// AUTH",
  "const signUp = (email, pw) =>",
  "  supabase.auth.signUp({ email, password: pw })",
  "",
  "const signIn = (email, pw) =>",
  "  supabase.auth.signInWithPassword({ email, password: pw })",
  "",
  "const signOut = () => supabase.auth.signOut()",
  "",
  "// FIRMA",
  "const getFirma = async () => {",
  "  const { data } = await supabase",
  "    .from('firmen').select('*').single()",
  "  return data",
  "}",
  "",
  "const saveFirma = async (firma) => {",
  "  const user = (await supabase.auth.getUser()).data.user",
  "  return supabase.from('firmen').upsert({",
  "    ...firma, user_id: user.id",
  "  })",
  "}",
  "",
  "// KUNDEN",
  "const getKunden = (firmaId) =>",
  "  supabase.from('kunden').select('*')",
  "    .eq('firma_id', firmaId)",
  "    .order('created_at', { ascending: false })",
  "",
  "const addKunde = (kunde) =>",
  "  supabase.from('kunden').insert(kunde).select().single()",
  "",
  "// RECHNUNGEN",
  "const getRechnungen = (firmaId) =>",
  "  supabase.from('rechnungen')",
  "    .select('*, positionen(*)')",
  "    .eq('firma_id', firmaId)",
  "    .order('created_at', { ascending: false })",
  "",
  "const addRechnung = async (re, positionen) => {",
  "  const { data: rechnung } = await supabase",
  "    .from('rechnungen').insert(re).select().single()",
  "  if (rechnung && positionen.length > 0) {",
  "    await supabase.from('positionen').insert(",
  "      positionen.map((p, i) => ({",
  "        ...p,",
  "        rechnung_id: rechnung.id,",
  "        position_nr: i + 1,",
  "      }))",
  "    )",
  "  }",
  "  return rechnung",
  "}",
  "",
  "const updateRechnung = (id, updates) =>",
  "  supabase.from('rechnungen').update(updates).eq('id', id)",
].join("\n");

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
function App() {
  const [pg, setPg] = useState("dashboard");
  const [firma, setFirma] = useState<Firma | null>(null);
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [rechnungen, setRechnungen] = useState<Rechnung[]>([]);
  const [plan, setPlan] = useState("free");
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [mobNav, setMobNav] = useState(false);
  const [editRe, setEditRe] = useState<Rechnung | null>(null);
  const [favoriten, setFavoriten] = useState<FavoritItem[]>([]);
  const [reSearch, setReSearch] = useState("");
  const [wiederkehrend, setWdk] = useState<WiederkehrendItem[]>([]);

  useEffect(() => {
    let mounted = true;
    const f = ld("inv-firma", null) as Firma | null;
    const k = ld("inv-kunden", []) as Kunde[];
    const r = ld("inv-rechnungen", []) as Rechnung[];
    const p = ld("inv-plan", "free") as string;
    const ob = ld("inv-onboarded", false) as boolean;
    const fav = ld("inv-favoriten", []) as FavoritItem[];
    const wdk = ld("inv-wdk", []) as WiederkehrendItem[];
    if (!mounted) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setFirma(f); setKunden(k); setRechnungen(r); setPlan(p); setFavoriten(fav); setWdk(wdk); setLoaded(true);
    if (!ob || !f) setPg("onboarding");
    // Auto-create due recurring invoices (runs only once on mount)
    const today = new Date().toISOString().split("T")[0];
    const due = wdk.filter((w: WiederkehrendItem) => w.aktiv && w.nextDue <= today);
    if (due.length > 0) {
      const y = new Date().getFullYear();
      const allRe = [...r];
      const updWdkList = [...wdk];
      due.forEach((w: WiederkehrendItem) => {
        const prefix = `RE-${y}-`;
        const maxNr = allRe.filter(re => re.nummer?.startsWith(prefix)).reduce((mx, re) => { const n = parseInt(re.nummer.slice(prefix.length), 10); return isNaN(n) ? mx : Math.max(mx, n); }, 0);
        const nr = `${prefix}${String(maxNr + 1).padStart(4,"0")}`;
        const fdt = new Date(); fdt.setDate(fdt.getDate() + (w.zahlungsziel || 14));
        allRe.push({ id: uid(), nummer: nr, datum: today, faelligDatum: fdt.toISOString().split("T")[0], kundeId: w.kundeId, kundeName: w.kundeName, kundeAdresse: w.kundeAdresse || "", kundeEmail: w.kundeEmail || "", positionen: w.positionen || [], netto: w.netto || 0, mwst: w.mwst || 0, gesamt: w.gesamt || 0, zahlungsziel: w.zahlungsziel || 14, notiz: w.notiz || "", status: "offen", gewerk: w.gewerk || "", rabatt: w.rabatt || 0, zeitraumVon: "", zeitraumBis: "" });
        const idx = updWdkList.findIndex((x: WiederkehrendItem) => x.id === w.id);
        if (idx >= 0) updWdkList[idx] = { ...w, nextDue: (() => { const d = new Date(w.nextDue); if (w.interval === "monatlich") d.setMonth(d.getMonth()+1); else if (w.interval === "quartal") d.setMonth(d.getMonth()+3); else d.setFullYear(d.getFullYear()+1); return d.toISOString().split("T")[0]; })() };
      });
      sv("inv-rechnungen", allRe); sv("inv-wdk", updWdkList);
      if (mounted) { setRechnungen(allRe); setWdk(updWdkList); }
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => { mounted = false; };
  }, []);

  const sf = (f: Firma | null) => { setFirma(f); sv("inv-firma", f); showT("Gespeichert!"); };
  const skn = (k: Kunde[]) => { setKunden(k); sv("inv-kunden", k); };
  const sre = (r: Rechnung[]) => { setRechnungen(r); sv("inv-rechnungen", r); };
  const spl = (p: string) => { setPlan(p); sv("inv-plan", p); showT(`Plan: ${p.toUpperCase()}`); };
  const showT = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2800); };

  const addRe = async (r: Rechnung) => { await sre([...rechnungen, r]); showT("Erstellt!"); };
  const delKu = (kid: string) => skn(kunden.filter(k => k.id !== kid));
  const updKu = (kid: string, up: Partial<Kunde>) => skn(kunden.map(k => k.id === kid ? { ...k, ...up } : k));
  const addFav = (pos: Omit<FavoritItem, "id">) => { const exists = favoriten.find(f => f.beschreibung === pos.beschreibung); if (exists) return; const nf = [...favoriten, { ...pos, id: uid() }]; setFavoriten(nf); sv("inv-favoriten", nf); showT("Favorit gespeichert!"); };
  const delFav = (fid: string) => { const nf = favoriten.filter(f => f.id !== fid); setFavoriten(nf); sv("inv-favoriten", nf); };

  const saveWdk = (w: WiederkehrendItem[]) => { setWdk(w); sv("inv-wdk", w); };
  const addWdk = (w: Omit<WiederkehrendItem, "id">) => saveWdk([...wiederkehrend, { ...w, id: uid() }]);
  const updWdk = (id: string, up: Partial<WiederkehrendItem>) => saveWdk(wiederkehrend.map(w => w.id === id ? { ...w, ...up } : w));
  const delWdk = (id: string) => saveWdk(wiederkehrend.filter(w => w.id !== id));
  const updRe = async (rid: string, up: Partial<Rechnung>) => { await sre(rechnungen.map(r => r.id === rid ? { ...r, ...up } : r)); };
  const addKu = async (k: Omit<Kunde, "id">): Promise<Kunde> => { const ex = kunden.find(x => x.name === k.name && x.strasse === k.strasse); if (ex) return ex; const nk = { ...k, id: uid() }; await skn([...kunden, nk]); return nk; };
  const dupRe = async (o: Rechnung) => { const nr = nxtNr(); const d = new Date().toISOString().split("T")[0]; const fdt = new Date(); fdt.setDate(fdt.getDate() + (o.zahlungsziel || 14)); await addRe({ ...o, id: uid(), nummer: nr, datum: d, faelligDatum: fdt.toISOString().split("T")[0], status: "offen" }); };
  const delRe = (rid: string) => sre(rechnungen.filter(r => r.id !== rid));
  const nxtNr = () => { const y = new Date().getFullYear(); const prefix = `RE-${y}-`; const maxNr = rechnungen.filter(r => r.nummer?.startsWith(prefix)).reduce((max, r) => { const n = parseInt(r.nummer.slice(prefix.length), 10); return isNaN(n) ? max : Math.max(max, n); }, 0); return `${prefix}${String(maxNr + 1).padStart(4, "0")}`; };
  const lim = { free: { re: 5, ku: 3 }, starter: { re: 50, ku: 25 }, pro: { re: 500, ku: 999 }, enterprise: { re: 99999, ku: 99999 } }[plan] || { re: 5, ku: 3 };
  const nav = (p: string, search?: string) => { setPg(p); setMobNav(false); if (search !== undefined) setReSearch(search); else setReSearch(""); };

  const completeOnboarding = async (firmaData: Firma) => {
    await sf(firmaData);
    await sv("inv-onboarded", true);
    setPg("dashboard");
    showT("Willkommen bei RechnungsKI!");
  };

  if (!loaded) return <div className="flex flex-col items-center justify-center h-screen w-full bg-[#050510]"><div className="relative"><div className="w-10 h-10 border-[3px] border-slate-800/50 border-t-brand-400 rounded-full animate-spin" /><div className="absolute inset-0 w-10 h-10 rounded-full bg-brand-500/10 blur-xl animate-pulse-soft" /></div><p className="text-slate-500 text-[13px] mt-4 tracking-wide">Laden...</p></div>;

  // Show onboarding fullscreen
  if (pg === "onboarding") return <OnboardingWizard onComplete={completeOnboarding} />;

  const navItems = [
    { id: "dashboard", icon: IC.dash, l: "Dashboard" }, { id: "neue-rechnung", icon: IC.doc, l: "Neue Rechnung" },
    { id: "rechnungen", icon: IC.euro, l: "Rechnungen" }, { id: "kunden", icon: IC.users, l: "Kunden" },
    { id: "wiederkehrend", icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>, l: "Wiederkehrend" },
    { id: "abo", icon: IC.crown, l: "Abo & Preise" },
    { id: "settings", icon: IC.gear, l: "Einstellungen" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-[#050510] text-slate-200">
      {/* Mobile header */}
      <div className="hidden max-md:flex sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 items-center gap-3">
        <button className="bg-transparent border-none text-slate-200 cursor-pointer flex p-1 hover:text-white transition-colors" onClick={() => setMobNav(!mobNav)}>{mobNav ? IC.x : IC.menu}</button>
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-[10px]">{IC.star}</div>
        <span className="font-bold text-[15px] tracking-tight">RechnungsKI</span>
        <span className="text-[9px] font-bold text-brand-400 uppercase tracking-wider ml-0.5 bg-brand-500/10 px-1.5 py-0.5 rounded">{plan.toUpperCase()}</span>
      </div>

      {/* Sidebar — Glassmorphism */}
      <nav className={`w-[240px] bg-[#0a0a1a]/70 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col py-5 px-3 shrink-0 sticky top-0 h-screen z-[100] max-md:fixed max-md:left-[-280px] max-md:top-0 max-md:bottom-0 max-md:w-[260px] max-md:transition-[left] max-md:duration-300 max-md:ease-[cubic-bezier(0.16,1,0.3,1)] ${mobNav ? "max-md:!left-0" : ""}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]">{IC.star}</div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">RechnungsKI</div>
            <div className="text-[9px] font-bold text-brand-400 uppercase tracking-[0.08em]">{plan} Plan</div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-0.5 flex-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => nav(n.id)}
              className={`group flex items-center gap-2.5 py-2 px-3 border-none rounded-xl cursor-pointer text-[13px] font-medium text-left relative transition-all duration-200 ${pg === n.id ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" : "bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"}`}>
              <span className={`flex transition-all duration-200 ${pg === n.id ? "text-brand-400" : "opacity-40 group-hover:opacity-70"}`}>{n.icon}</span>
              <span>{n.l}</span>
              {n.id === "rechnungen" && rechnungen.filter(r => r.status === "offen").length > 0 && (
                <span className="absolute right-2.5 bg-danger-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]">{rechnungen.filter(r => r.status === "offen").length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Usage bar */}
        <div className="border-t border-white/[0.06] pt-4 mt-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[10px] text-slate-500 font-medium">Rechnungen</span>
            <span className="text-[10px] text-slate-500 font-mono">{rechnungen.length}/{lim.re === 99999 ? "∞" : lim.re}</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mx-1">
            <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-[width] duration-500 ease-out" style={{ width: `${Math.min(rechnungen.length / lim.re * 100, 100)}%` }} />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {pg === "dashboard" && <Dashboard {...{ rechnungen, kunden, firma, nav, updRe, addRe, addKu, plan, lim }} />}
        {pg === "neue-rechnung" && <NeueRechnung {...{ firma, kunden, addKu, addRe, updRe, nextNr: nxtNr(), nav, plan, lim, canCreate: rechnungen.length < lim.re, editRechnung: editRe, onEditDone: () => setEditRe(null), favoriten, addFav, delFav }} />}
        {pg === "rechnungen" && <RechnungenListe {...{ rechnungen, updRe, delRe, nav, dupRe, firma, onEdit: r => { setEditRe(r); setPg("neue-rechnung"); }, initialSearch: reSearch, showT }} />}
        {pg === "kunden" && <KundenListe {...{ kunden, rechnungen, updKu, delKu }} />}
        {pg === "wiederkehrend" && <WiederkehrendPage {...{ wiederkehrend, addWdk, updWdk, delWdk, kunden, rechnungen, firma }} />}
        {pg === "abo" && <AboPage {...{ plan, spl }} />}
        {pg === "supabase" && <SupabasePage />}
        {pg === "settings" && <SettingsPage {...{ firma, sf, rechnungen, kunden, sre, skn, favoriten, setFavoriten, wiederkehrend, saveWdk, plan, spl, showT }} />}
      </main>

      {/* Toast — premium */}
      {toast && <div className="fixed bottom-5 right-5 bg-[#0f0f1a]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-2 text-[13px] font-medium animate-fade-up z-[999] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"><span className="text-success-500 flex">{IC.check}</span>{toast}</div>}

      {/* Mobile overlay */}
      {mobNav && <div className="max-md:block hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity" onClick={() => setMobNav(false)} />}
    </div>
  );
}

export default function AppWrapper() { return <ErrorBoundary><App /></ErrorBoundary>; }

// ═══ ONBOARDING WIZARD ═══
function OnboardingWizard({ onComplete }: { onComplete: (firma: Firma) => void }) {
  const [step, setStep] = useState(0); // 0=welcome, 1=branche, 2=firma, 3=steuer, 4=bank, 5=logo, 6=fertig
  const [, setBrancheKat] = useState("");
  const [form, setForm] = useState({ name: "", inhaber: "", strasse: "", plz: "", ort: "", telefon: "", email: "", web: "", steuernr: "", ustid: "", bankName: "", iban: "", bic: "", gewerk: "", logo: "" });
  const [logoErr, setLogoErr] = useState("");
  const fRef = useRef<HTMLInputElement>(null);
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 2000000) { setLogoErr("Datei zu groß – max. 2 MB erlaubt."); return; } setLogoErr(""); const img = new Image(); const url = URL.createObjectURL(f); img.onload = () => { const c = document.createElement("canvas"); const MAX = 400; let w = img.width, h = img.height; if (w > MAX) { h = h * MAX / w; w = MAX; } c.width = w; c.height = h; c.getContext("2d")!.drawImage(img, 0, 0, w, h); const compressed = c.toDataURL("image/jpeg", 0.75); setForm(prev => ({ ...prev, logo: compressed })); URL.revokeObjectURL(url); }; img.src = url; };

  const canNext = () => {
    if (step === 1) return !!form.gewerk;
    if (step === 2) return !!form.name;
    return true;
  };

  const steps = [
    { title: "Willkommen", icon: "👋" },
    { title: "Deine Branche", icon: "🎯" },
    { title: "Firmendaten", icon: "🏢" },
    { title: "Steuerdaten", icon: "📋" },
    { title: "Bankverbindung", icon: "🏦" },
    { title: "Logo", icon: "🎨" },
    { title: "Fertig!", icon: "🚀" },
  ];

  const progress = Math.round((step / (steps.length - 1)) * 100);

  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const oblbl = "text-[11px] font-semibold text-slate-400 mb-1 block tracking-wide";

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[#050510] w-full">
      {/* Progress */}
      <div className="w-full max-w-[600px] h-1 bg-white/[0.06] rounded-full overflow-hidden mb-6">
        <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Step dots */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {steps.map((s, i) => (
          <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${i < step ? "bg-success-500/15 border border-success-500/30 text-success-500" : i === step ? "border border-brand-500/40 bg-brand-500/10 shadow-[0_0_16px_rgba(99,102,241,0.2)]" : "bg-white/[0.04] border border-white/[0.06]"}`}>
            {i < step ? <span className="flex">{IC.check}</span> : <span className="text-sm">{s.icon}</span>}
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 max-w-[680px] w-full flex-1 max-h-[calc(100vh-200px)] overflow-y-auto animate-fade-in">
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center text-[40px] mb-5">👋</div>
            <h1 className="text-[28px] font-extrabold tracking-tight mb-2.5 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Willkommen bei RechnungsKI</h1>
            <p className="text-[15px] text-slate-400 max-w-[440px] leading-relaxed mb-2">In 2 Minuten bist du startklar. Wir richten alles für dich ein – danach kannst du sofort deine erste Rechnung erstellen.</p>
            <div className="flex flex-col gap-2.5 mt-6 text-sm">
              {["Branche wählen – KI-Vorschläge passend für dich", "Firmendaten eingeben – erscheinen auf jeder Rechnung", "Steuern & Bank – für §14-konforme Rechnungen", "Logo hochladen – dein Branding auf jedem Dokument"].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/15 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0">{i + 1}</span>
                  <span className="text-slate-400 text-left">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Was ist deine Branche?</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Wir passen die KI-Vorschläge, Einheiten und Preise an dein Geschäft an.</p>
            <div className="flex flex-col gap-4">
              {Object.entries(BRANCHEN_KATEGORIEN).map(([kat, branchen]) => (
                <div key={kat}>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2 pl-0.5">{kat}</div>
                  <div className="flex flex-wrap gap-2">
                    {branchen.map(b => (
                      <button key={b} onClick={() => { setForm({ ...form, gewerk: b }); setBrancheKat(kat); }}
                        className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 ${form.gewerk === b ? "border border-brand-500/50 bg-brand-500/10 text-brand-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]" : "border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:bg-white/[0.06]"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Deine Firmendaten</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Diese Daten erscheinen auf jeder Rechnung. Du kannst sie später jederzeit ändern.</p>
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div className="flex gap-3">
                <div className="flex-1"><label className={oblbl}>Firmenname *</label><input className={inp} placeholder="z.B. Müller Webdesign" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="flex-1"><label className={oblbl}>Inhaber</label><input className={inp} placeholder="Max Müller" value={form.inhaber} onChange={e => setForm({ ...form, inhaber: e.target.value })} /></div>
              </div>
              <div><label className={oblbl}>Straße + Nr.</label><input className={inp} placeholder="Musterstraße 42" value={form.strasse} onChange={e => setForm({ ...form, strasse: e.target.value })} /></div>
              <div className="flex gap-3">
                <div className="w-[110px]"><label className={oblbl}>PLZ</label><input className={inp} placeholder="70173" value={form.plz} onChange={e => setForm({ ...form, plz: e.target.value })} /></div>
                <div className="flex-1"><label className={oblbl}>Ort</label><input className={inp} placeholder="Stuttgart" value={form.ort} onChange={e => setForm({ ...form, ort: e.target.value })} /></div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1"><label className={oblbl}>Telefon</label><input className={inp} placeholder="0711 123456" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} /></div>
                <div className="flex-1"><label className={oblbl}>E-Mail</label><input className={inp} placeholder="info@firma.de" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Steuerdaten</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Mindestens eins davon ist Pflicht nach §14 UStG. Ohne wird deine Rechnung nicht rechtskonform sein.</p>
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div><label className={oblbl}>Steuernummer</label><input className={inp} placeholder="12/345/67890" value={form.steuernr} onChange={e => setForm({ ...form, steuernr: e.target.value })} /></div>
              <div className="text-center text-slate-600 text-[13px] py-1">– oder –</div>
              <div><label className={oblbl}>USt-IdNr.</label><input className={inp} placeholder="DE123456789" value={form.ustid} onChange={e => setForm({ ...form, ustid: e.target.value })} /></div>
            </div>
            {!form.steuernr && !form.ustid && <div className="mt-4 p-3.5 bg-warning-500/[0.06] rounded-xl border border-warning-500/15 text-[13px] text-warning-500 flex items-start gap-2.5"><span className="mt-0.5">{IC.shield}</span><span>Du kannst diesen Schritt überspringen, aber deine Rechnungen werden ohne Steuernr./USt-ID nicht §14-konform sein.</span></div>}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Bankverbindung</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Damit deine Kunden wissen, wohin sie überweisen sollen. Erscheint im Footer jeder Rechnung.</p>
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div><label className={oblbl}>Bank</label><input className={inp} placeholder="Sparkasse Stuttgart" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} /></div>
              <div><label className={oblbl}>IBAN</label><input className={inp} placeholder="DE89 3704 0044 0532 0130 00" value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} /></div>
              <div><label className={oblbl}>BIC (optional)</label><input className={inp} placeholder="COBADEFFXXX" value={form.bic} onChange={e => setForm({ ...form, bic: e.target.value })} /></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Dein Firmenlogo</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Optional – aber es macht deine Rechnungen sofort professioneller. PNG oder JPG, max 2 MB.</p>
            <div className="flex flex-col items-center text-center mt-5">
              {form.logo ? (
                <div className="relative inline-block">
                  <img src={form.logo} alt="" className="max-h-20 max-w-60 rounded-xl border border-white/[0.1] bg-white p-3 object-contain shadow-lg" />
                  <button className="absolute -top-2 -right-2 bg-slate-800 rounded-full w-[22px] h-[22px] flex items-center justify-center border border-white/[0.1] text-slate-400 cursor-pointer text-xs hover:bg-slate-700 transition-colors" onClick={() => setForm({ ...form, logo: "" })}>✕</button>
                </div>
              ) : (
                <div onClick={() => fRef.current?.click()} className="w-[220px] h-[110px] rounded-2xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center cursor-pointer gap-2.5 text-slate-500 hover:border-brand-500/30 hover:bg-brand-500/[0.03] transition-all duration-200">
                  <span className="text-[32px]">📷</span>
                  <span className="text-[13px] font-medium">Klicken zum Hochladen</span>
                </div>
              )}
              <input ref={fRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} />
              {logoErr && <p className="text-[13px] text-danger-500 mt-3 font-semibold">⚠ {logoErr}</p>}
              {!form.logo && !logoErr && <p className="text-[13px] text-slate-600 mt-4">Du kannst diesen Schritt überspringen und das Logo später hinzufügen.</p>}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-500/20 to-success-600/10 border border-success-500/20 flex items-center justify-center text-[40px] mb-5">🚀</div>
            <h2 className="text-[26px] font-extrabold tracking-tight mb-2.5 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Alles eingerichtet!</h2>
            <p className="text-[15px] text-slate-400 max-w-[400px] leading-relaxed mb-6">Dein Profil ist fertig. Du kannst jetzt sofort deine erste Rechnung erstellen.</p>
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/[0.08] max-w-[360px] w-full text-left">
              <div className="flex gap-3 items-center mb-3">
                {form.logo && <img src={form.logo} alt="" className="max-h-10 max-w-[100px] object-contain rounded-lg" />}
                <div><div className="font-bold text-[15px]">{form.name}</div><div className="text-[13px] text-brand-400 font-medium">{form.gewerk}</div></div>
              </div>
              <div className="text-[13px] text-slate-500">{form.strasse && `${form.strasse}, `}{form.plz} {form.ort}</div>
              {form.email && <div className="text-[13px] text-slate-500">{form.email}</div>}
              {(form.steuernr || form.ustid) && <div className="text-[12px] text-success-500 mt-2 flex items-center gap-1.5">{IC.check} §14 UStG konform</div>}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center gap-3 max-w-[680px] w-full mt-6">
        {step > 0 && step < 6 && <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer hover:bg-white/[0.08] transition-all font-medium" onClick={() => setStep(step - 1)}>← Zurück</button>}
        <div className="flex-1" />
        {step < 6 ? (
          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => setStep(step + 1)} style={{ opacity: step > 0 && !canNext() ? .4 : 1 }} disabled={step > 0 && !canNext()}>
            {step === 0 ? "Los geht's →" : step === 5 ? (form.logo ? "Weiter →" : "Überspringen →") : "Weiter →"}
          </button>
        ) : (
          <button className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => onComplete(form)}>
            Erste Rechnung erstellen →
          </button>
        )}
      </div>
    </div>
  );
}

// ═══ DASHBOARD ═══
function Dashboard({ rechnungen, kunden, firma, nav, updRe, addRe, addKu, plan, lim }: { rechnungen: Rechnung[]; kunden: Kunde[]; firma: Firma | null; nav: (pg: string, search?: string) => void; updRe: (id: string, up: Partial<Rechnung>) => void; addRe: (r: Rechnung) => Promise<void>; addKu: (k: Omit<Kunde, "id">) => Promise<Kunde>; plan: string; lim: { re: number; ku: number } }) {
  const paid = rechnungen.filter(r => r.status === "bezahlt");
  const offen = rechnungen.filter(r => r.status === "offen");
  const ueber = offen.filter(r => new Date(r.faelligDatum) < new Date());
  const fE = validateFirma(firma);
  const months = []; for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); months.push({ l: d.toLocaleDateString("de-DE", { month: "short" }), s: paid.filter(r => { const rd = new Date(r.datum); return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear(); }).reduce((s, r) => s + r.gesamt, 0), k: `${d.getFullYear()}-${d.getMonth()}` }); }
  const mx = Math.max(...months.map(m => m.s), 1);
  const totalUmsatz = paid.reduce((s, r) => s + r.gesamt, 0);
  const offenSum = offen.reduce((s, r) => s + r.gesamt, 0);
  // Quartals-MwSt
  const now = new Date(); const q = Math.floor(now.getMonth() / 3); const qStart = new Date(now.getFullYear(), q * 3, 1); const qEnd = new Date(now.getFullYear(), q * 3 + 3, 0);
  const qPaid = paid.filter(r => { const d = new Date(r.datum); return d >= qStart && d <= qEnd; });
  const qNetto = qPaid.reduce((s, r) => s + (r.netto || 0), 0); const qMwst = qPaid.reduce((s, r) => s + (r.mwst || 0), 0);
  // Angebots-Follow-up
  const nowMs = now.getTime();
  const alteAngebote = rechnungen.filter(r => r.status === "angebot" && new Date(r.datum) < new Date(nowMs - 7 * 24 * 60 * 60 * 1000));
  // Leer-Zustand
  const isEmpty = rechnungen.length === 0 && kunden.length === 0;

  // Musterrechnung
  const loadMuster = async () => {
    const musterKunde = await addKu({ name: "Müller Haustechnik GmbH", strasse: "Industriestr. 42", plz: "70563", ort: "Stuttgart", email: "info@mueller-haustechnik.de", telefon: "0711 987654" });
    const heute = new Date().toISOString().split("T")[0];
    const faellig = new Date(); faellig.setDate(faellig.getDate() + 14);
    const mwstSatz = firma?.kleinunternehmer ? 0 : 19;
    const positionen = [
      { beschreibung: "Elektroinstallation Büro EG – 12 Doppelsteckdosen setzen, Kabel verlegen, Sicherungskasten anpassen", einheit: "Pauschal", menge: 1, preis: 1850, mwst: mwstSatz, typ: "arbeit" },
      { beschreibung: "Netzwerkverkabelung Cat7 inkl. Patchpanel", einheit: "Stk", menge: 12, preis: 45, mwst: mwstSatz, typ: "arbeit" },
      { beschreibung: "LED-Deckenleuchten (Philips CoreLine)", einheit: "Stk", menge: 8, preis: 89, mwst: mwstSatz, typ: "material" },
      { beschreibung: "Kabelkanäle weiss 60x40mm", einheit: "m", menge: 35, preis: 8.50, mwst: mwstSatz, typ: "material" },
      { beschreibung: "Kleinmaterial (Dübel, Schrauben, Klemmen)", einheit: "Pauschal", menge: 1, preis: 95, mwst: mwstSatz, typ: "material" },
      { beschreibung: "Anfahrt und Entsorgung", einheit: "Pauschal", menge: 1, preis: 65, mwst: mwstSatz, typ: "arbeit" },
    ];
    const netto = positionen.reduce((s, p) => s + p.menge * p.preis, 0);
    const mwst = positionen.reduce((s, p) => s + p.menge * p.preis * p.mwst / 100, 0);
    const y = now.getFullYear();
    const prefix = `RE-${y}-`;
    const maxNr = rechnungen.filter(r => r.nummer?.startsWith(prefix)).reduce((mx, r) => { const n = parseInt(r.nummer.slice(prefix.length), 10); return isNaN(n) ? mx : Math.max(mx, n); }, 0);
    const re = {
      id: uid(), nummer: `${prefix}${String(maxNr + 1).padStart(4, "0")}`, datum: heute, faelligDatum: faellig.toISOString().split("T")[0],
      kundeId: musterKunde.id, kundeName: musterKunde.name, kundeAdresse: `${musterKunde.strasse}, ${musterKunde.plz} ${musterKunde.ort}`, kundeEmail: musterKunde.email || "",
      positionen, netto, mwst, gesamt: netto + mwst, zahlungsziel: 14, notiz: "Leistungszeitraum: siehe Auftragsbestätigung AB-2026-003.\nZahlbar innerhalb 14 Tagen ohne Abzug.", status: "offen", gewerk: firma?.gewerk || "", rabatt: 0, zeitraumVon: "", zeitraumBis: "", typ: "rechnung",
    };
    await addRe(re as Rechnung);
    if (firma) downloadPdf(re as Rechnung, firma);
    nav("rechnungen");
  };

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Guten {now.getHours() < 12 ? "Morgen" : now.getHours() < 18 ? "Tag" : "Abend"}{firma?.inhaber ? `, ${firma.inhaber.split(" ")[0]}` : ""}</h1>
          <p className="text-[13px] text-slate-500 mt-1.5">{now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}{firma?.name ? ` · ${firma.name}` : ""}</p>
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 font-medium" onClick={() => nav("rechnungen")}>{IC.euro} Rechnungen</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer whitespace-nowrap hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => nav("neue-rechnung")}>{IC.plus} Neue Rechnung</button>
        </div>
      </div>

      {fE.length > 0 && <div className="flex items-start gap-2.5 px-4 py-3 bg-warning-500/[0.06] border border-warning-500/20 rounded-xl mb-4 text-[13px] text-warning-500"><span className="flex text-warning-500 mt-0.5">{IC.shield}</span><div><strong>§14 UStG:</strong> {fE.join(", ")} fehlt. <button className="bg-transparent border-none text-brand-400 text-[13px] cursor-pointer p-0 font-medium hover:underline" onClick={() => nav("settings")}>Beheben →</button></div></div>}
      {plan === "free" && <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-brand-950/60 to-brand-900/40 border border-brand-500/20 rounded-xl mb-5 text-[13px] text-brand-200 flex-wrap backdrop-blur-sm">{IC.crown}<span><strong>Free</strong> – {lim.re} Rechnungen</span><button className="px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer ml-auto hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all" onClick={() => nav("abo")}>Upgraden</button></div>}

      {/* Empty state */}
      {isEmpty && (
        <div className="relative bg-gradient-to-br from-[#0c0c20] to-brand-950/40 rounded-2xl p-8 mb-5 border border-brand-500/15 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_70%)]" />
          <div className="text-center max-w-[460px] mx-auto relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 text-brand-400">{IC.star}</div>
            <h2 className="text-xl font-bold mb-2 tracking-tight">Willkommen bei RechnungsKI</h2>
            <p className="text-[14px] text-slate-400 leading-relaxed mb-6">Erstelle deine erste Rechnung in unter 2 Minuten. Alle Daten werden lokal in deinem Browser gespeichert.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {[
                { l: "Kunde anlegen", ico: IC.users, pg: "kunden" },
                { l: "Erste Rechnung", ico: IC.doc, pg: "neue-rechnung" },
                { l: "Firmendaten prüfen", ico: IC.gear, pg: "settings" },
              ].map((a, i) => (
                <button key={i} onClick={() => nav(a.pg)} className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] font-medium cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.12] hover:translate-y-[-1px] transition-all duration-200">
                  <span className="opacity-50 flex">{a.ico}</span>{a.l}
                </button>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <button onClick={loadMuster} className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-dashed border-brand-500/30 rounded-xl text-brand-300 text-[13px] font-medium cursor-pointer mx-auto hover:bg-brand-500/[0.06] hover:border-brand-500/50 transition-all duration-200">
                {IC.eye} Musterrechnung laden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-3 mb-5">
        {[
          { l: "Umsatz", v: fc(totalUmsatz), s: `${paid.length} bezahlt`, c: "text-success-500", gc: "from-success-500/10 to-success-600/5", glow: "rgba(16,185,129,0.06)", ico: IC.euro, link: "rechnungen" },
          { l: "Offen", v: fc(offenSum), s: `${offen.length} Rechnungen`, c: "text-warning-500", gc: "from-warning-500/10 to-warning-600/5", glow: "rgba(245,158,11,0.06)", ico: IC.doc, link: "rechnungen" },
          { l: "Überfällig", v: ueber.length, s: ueber.length ? "Jetzt mahnen" : "Alles im Griff", c: "text-danger-500", gc: "from-danger-500/10 to-danger-600/5", glow: "rgba(239,68,68,0.06)", ico: IC.alert, link: "rechnungen" },
          { l: "Kunden", v: kunden.length, c: "text-brand-400", gc: "from-brand-500/10 to-brand-600/5", glow: "rgba(99,102,241,0.06)", s: "gespeichert", ico: IC.users, link: "kunden" },
        ].map((k, i) => (
          <button key={i} onClick={() => nav(k.link)} className={`group relative bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06] overflow-hidden hover:border-white/[0.1] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 text-left w-full cursor-pointer`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${k.gc} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute top-3 right-3 opacity-[0.06] ${k.c}`}><svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">{k.ico.props.children}</svg></div>
            <div className="relative z-10">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.1em]">{k.l}</div>
              <div className={`text-[24px] font-extrabold mt-1.5 tracking-tight ${k.l === "Überfällig" && ueber.length > 0 ? "text-danger-500" : ""}`}>{k.v}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">{k.s}<span className="opacity-0 group-hover:opacity-60 transition-opacity ml-auto text-slate-400">→</span></div>
            </div>
          </button>
        ))}
      </div>

      {/* Overdue alert */}
      {ueber.length > 0 && <div className="bg-danger-500/[0.04] border border-danger-500/15 rounded-2xl p-5 mb-5"><div className="flex items-center gap-2.5 mb-3 font-semibold text-[14px]"><span className="w-7 h-7 rounded-lg bg-danger-500/10 flex items-center justify-center text-danger-500">{IC.alert}</span>Überfällig ({ueber.length})</div>{ueber.map(r => <div key={r.id} className="flex items-center gap-3 py-2.5 text-[13px] flex-wrap border-b border-white/[0.04] last:border-0"><span className="font-semibold font-mono text-[11px] text-slate-400">{r.nummer}</span><span className="flex-1">{r.kundeName}</span><span className="font-semibold">{fc(r.gesamt)}</span><span className="text-[11px] text-danger-400 bg-danger-500/10 px-2 py-0.5 rounded-md font-medium">{Math.floor((nowMs - new Date(r.faelligDatum).getTime()) / 86400000)}d überfällig</span><button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium" onClick={() => updRe(r.id, { status: "gemahnt" })}>{IC.mail} Mahnen</button></div>)}</div>}

      {/* Chart + Recent */}
      <div className="grid grid-cols-[1.7fr_1fr] max-md:grid-cols-1 gap-3 mb-5">
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-semibold">Umsatz (6 Monate)</h3>
            <span className="text-lg font-bold text-success-500">{fc(totalUmsatz)}</span>
          </div>
          <div className="flex items-end gap-2.5 h-[150px]">
            {months.map(m => (
              <div key={m.k} className="flex-1 flex flex-col items-center gap-1.5">
                {m.s > 0 && <span className="text-[9px] text-slate-500 font-medium">{m.s >= 1000 ? `${(m.s/1000).toFixed(1)}k` : fc(m.s)}</span>}
                <div className="w-full h-[120px] flex items-end">
                  <div className="w-full bg-gradient-to-t from-brand-600 via-brand-500 to-brand-400 rounded-t-md transition-[height] duration-700 ease-out min-h-[3px] relative overflow-hidden" style={{ height: `${Math.max(m.s / mx * 100, 4)}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{m.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
          <h3 className="text-[14px] font-semibold mb-4">Letzte Aktivität</h3>
          {rechnungen.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-600">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 opacity-40">{IC.doc}</div>
              <p className="text-[13px]">Noch keine Rechnungen</p>
              <button className="bg-transparent border-none text-brand-400 text-[13px] cursor-pointer p-0 mt-1.5 font-medium hover:underline" onClick={() => nav("neue-rechnung")}>Erste Rechnung erstellen →</button>
            </div>
          ) : [...rechnungen].reverse().slice(0, 5).map(r => (
            <button key={r.id} onClick={() => nav("rechnungen", r.nummer)} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 group w-full text-left cursor-pointer bg-transparent hover:bg-white/[0.03] rounded-lg px-1.5 -mx-1.5 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-[11px] font-bold text-brand-400 shrink-0 border border-brand-500/10">{r.kundeName?.charAt(0)?.toUpperCase()}</div>
                <div><div className="font-semibold text-[13px] group-hover:text-white transition-colors">{r.kundeName}</div><div className="text-[11px] text-slate-500">{r.nummer} · {fd(r.datum)}</div></div>
              </div>
              <div className="text-right"><div className="font-semibold text-[13px]">{fc(r.gesamt)}</div><SB s={r.status} /></div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      {!isEmpty && <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2.5 mb-5">
        {[
          { l: "Neue Rechnung", ico: IC.doc, pg: "neue-rechnung", c: "text-brand-400" },
          { l: "Neues Angebot", ico: IC.eye, pg: "neue-rechnung", c: "text-purple-400" },
          { l: "Kunden", ico: IC.users, pg: "kunden", c: "text-blue-400" },
          { l: "DATEV Export", ico: IC.dl, pg: "rechnungen", c: "text-teal-400" },
        ].map((a, i) => (
          <button key={i} onClick={() => nav(a.pg)} className="group flex items-center gap-2.5 px-4 py-3.5 bg-[#0a0a1a]/80 border border-white/[0.06] rounded-xl text-slate-200 text-[13px] font-medium cursor-pointer text-left hover:bg-white/[0.04] hover:border-white/[0.1] hover:translate-y-[-1px] transition-all duration-200">
            <span className={`${a.c} flex opacity-60 group-hover:opacity-100 transition-opacity`}>{a.ico}</span>{a.l}
          </button>
        ))}
      </div>}

      {/* Old offers */}
      {alteAngebote.length > 0 && <div className="bg-brand-500/[0.04] border border-brand-500/15 rounded-2xl p-5 mb-5"><div className="flex items-center gap-2.5 mb-3 font-semibold text-[14px]"><span className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">{IC.eye}</span>Angebote ohne Antwort ({alteAngebote.length})</div>{alteAngebote.map(r => <div key={r.id} className="flex items-center gap-3 py-2.5 text-[13px] flex-wrap border-b border-white/[0.04] last:border-0"><span className="font-semibold font-mono text-[11px] text-slate-400">{r.nummer}</span><span className="flex-1">{r.kundeName}</span><span className="font-semibold">{fc(r.gesamt)}</span><span className="opacity-50 text-[11px]">{Math.floor((nowMs - new Date(r.datum).getTime()) / 86400000)} Tage</span><button className="flex items-center gap-1.5 px-3 py-1.5 bg-success-500/10 text-success-400 border border-success-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-success-500/15 transition-all" onClick={() => updRe(r.id, { status: "offen", typ: "rechnung" })}>→ Rechnung</button><button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-white/[0.08] transition-all" onClick={() => updRe(r.id, { status: "storniert" })}>Ablehnen</button></div>)}</div>}

      {/* Quarterly tax */}
      {!firma?.kleinunternehmer && (qNetto > 0 || qMwst > 0) && (
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06] mb-5">
          <h3 className="text-[14px] font-semibold mb-4">Q{q + 1}/{now.getFullYear()} – Steuerübersicht</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
            <div className="p-2.5 sm:p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] min-w-0">
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.08em] font-medium truncate">Nettoumsatz</div>
              <div className="text-[13px] sm:text-[22px] font-extrabold mt-1 sm:mt-1.5 tracking-tight truncate">{fc(qNetto)}</div>
            </div>
            <div className="p-2.5 sm:p-4 bg-danger-500/[0.03] rounded-xl border border-danger-500/10 min-w-0">
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.08em] font-medium truncate">MwSt-Schuld</div>
              <div className="text-[13px] sm:text-[22px] font-extrabold mt-1 sm:mt-1.5 text-danger-400 tracking-tight truncate">{fc(qMwst)}</div>
            </div>
            <div className="p-2.5 sm:p-4 bg-success-500/[0.03] rounded-xl border border-success-500/10 min-w-0">
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.08em] font-medium truncate">Brutto</div>
              <div className="text-[13px] sm:text-[22px] font-extrabold mt-1 sm:mt-1.5 text-success-400 tracking-tight truncate">{fc(qNetto + qMwst)}</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Nur bezahlte Rechnungen · {qStart.toLocaleDateString("de-DE")} – {qEnd.toLocaleDateString("de-DE")}</p>
        </div>
      )}

      {/* Local storage notice */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-[12px] text-slate-500">
        {IC.db}<span>Daten werden lokal im Browser gespeichert. Nutze den <button className="bg-transparent border-none text-brand-400 text-[12px] cursor-pointer p-0 inline font-medium hover:underline" onClick={() => nav("settings")}>Daten-Export</button> für Backups.</span>
      </div>
    </div>
  );
}

function SB({ s }: { s: string }) { const m: Record<string, { cls: string; l: string }> = { offen: { cls: "bg-warning-500/15 text-warning-500 border-warning-500/20", l: "Offen" }, bezahlt: { cls: "bg-success-500/15 text-success-500 border-success-500/20", l: "Bezahlt" }, gemahnt: { cls: "bg-danger-500/15 text-danger-500 border-danger-500/20", l: "Gemahnt" }, storniert: { cls: "bg-white/[0.06] text-slate-500 border-white/[0.08]", l: "Storniert" }, angebot: { cls: "bg-brand-500/15 text-brand-400 border-brand-500/20", l: "Angebot" } }; const v = m[s] || m.offen; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap border ${v.cls}`}>{v.l}</span>; }

// ═══ NEUE RECHNUNG (compact – same logic as v3) ═══
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NeueRechnung({ firma, kunden, addKu, addRe, updRe, nextNr, nav, plan: _plan, lim: _lim, canCreate, editRechnung, onEditDone, favoriten = [], addFav, delFav }: { firma: Firma | null; kunden: Kunde[]; addKu: (k: Omit<Kunde, "id">) => Promise<Kunde>; addRe: (r: Rechnung) => Promise<void>; updRe: (id: string, up: Partial<Rechnung>) => void; nextNr: string; nav: (pg: string) => void; plan: string; lim: { re: number; ku: number }; canCreate: boolean; editRechnung: Rechnung | null; onEditDone?: () => void; favoriten?: FavoritItem[]; addFav: (v: Omit<FavoritItem, "id">) => void; delFav: (id: string) => void }) {
  const [gw, setGw] = useState(firma?.gewerk || ""); const [kS, setKS] = useState(""); const [selK, setSelK] = useState<Kunde | null>(null);
  const [neuK, setNeuK] = useState({ name: "", strasse: "", plz: "", ort: "", email: "" }); const [showN, setShowN] = useState(false);
  const [pos, setPos] = useState<Position[]>([]); const [ziel, setZiel] = useState(14); const [notiz, setNotiz] = useState("");
  const [showV, setShowV] = useState(false); const [saving, setSaving] = useState(false);
  const [rabatt, setRabatt] = useState(0); const [typ, setTyp] = useState("rechnung");
  const [zvon, setZvon] = useState(""); const [zbis, setZbis] = useState(""); const [valE, setValE] = useState<string[]>([]);

  useEffect(() => {
    if (!editRechnung) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setGw(editRechnung.gewerk || "");
    setPos(editRechnung.positionen || []);
    setZiel(editRechnung.zahlungsziel || 14);
    setNotiz(editRechnung.notiz || "");
    setRabatt(editRechnung.rabatt || 0);
    setTyp(editRechnung.typ === "angebot" ? "angebot" : "rechnung");
    setZvon(editRechnung.zeitraumVon || "");
    setZbis(editRechnung.zeitraumBis || "");
    const k = kunden.find(k => k.id === editRechnung.kundeId);
    if (k) setSelK(k);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [editRechnung, kunden]);

  const fK = kunden.filter(k => k.name.toLowerCase().includes(kS.toLowerCase()));
  const addP = (p: Partial<Position> & { beschreibung: string; einheit: string; preis: number; typ?: "arbeit" | "material" }) => setPos([...pos, { beschreibung: p.beschreibung, einheit: p.einheit, preis: p.preis, typ: p.typ || "arbeit", id: uid(), menge: p.menge || 1, mwst: firma?.kleinunternehmer ? 0 : (p.mwst ?? 19) }]);
  const updP = (pid: string, f: string, v: string | number) => setPos(pos.map(p => p.id === pid ? { ...p, [f]: v } : p));
  const rmP = (pid: string) => setPos(pos.filter(p => p.id !== pid));
  const netto = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = netto * rabatt / 100; const nettoNR = netto - rabattB;
  const mwstB = pos.reduce((s, p) => s + p.menge * p.preis * (1 - rabatt / 100) * p.mwst / 100, 0);
  const brutto = nettoNR + mwstB;
  const arbS = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const matS = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);

  const doSave = async () => {
    if (!canCreate) { nav("abo"); return; }
    let kunde = selK; if (showN && neuK.name) kunde = await addKu(neuK);
    if (!kunde) { setValE(["Bitte einen Kunden auswählen oder neu anlegen"]); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const d = new Date().toISOString().split("T")[0]; const fdt = new Date(); fdt.setDate(fdt.getDate() + ziel);
    const r2 = (v: number) => Math.round(v * 100) / 100;
    const re = { id: uid(), nummer: nextNr, typ, datum: d, faelligDatum: fdt.toISOString().split("T")[0], kundeId: kunde.id, kundeName: kunde.name, kundeAdresse: `${kunde.strasse}, ${kunde.plz} ${kunde.ort}`, kundeEmail: kunde.email || "", positionen: pos, netto: r2(nettoNR), mwst: r2(mwstB), gesamt: r2(brutto), zahlungsziel: ziel, notiz, status: typ === "angebot" ? "angebot" : "offen", gewerk: gw, rabatt, zeitraumVon: zvon, zeitraumBis: zbis };
    const errs = validateRechnung(re, firma); if (errs.length > 0) { setValE(errs); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSaving(true);
    if (editRechnung) {
      updRe(editRechnung.id, { ...re, id: editRechnung.id, nummer: editRechnung.nummer });
      onEditDone?.();
    } else {
      addRe(re);
    }
    setSaving(false); nav("rechnungen");
  };

  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const sel = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none cursor-pointer";
  const posI = "py-[6px] px-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors";

  if (!firma) return <div className="p-6 px-7 animate-fade-in"><div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">{IC.gear}</div><h2 className="text-lg font-bold">Firmendaten fehlen</h2><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer mt-4 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={() => nav("settings")}>Einstellungen</button></div></div>;

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5">
        <div><h1 className="text-xl font-bold tracking-tight">{editRechnung ? "Rechnung bearbeiten" : typ === "angebot" ? "Neues Angebot" : "Neue Rechnung"}</h1><p className="text-[13px] text-slate-500 mt-1">Nr. {editRechnung ? editRechnung.nummer : nextNr}</p></div>
        <div className="flex bg-white/[0.04] rounded-xl p-0.5 border border-white/[0.06]">
          <button className={`px-3.5 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${typ === "rechnung" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setTyp("rechnung")}>Rechnung</button>
          <button className={`px-3.5 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${typ === "angebot" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setTyp("angebot")}>Angebot</button>
        </div>
      </div>
      {valE.length > 0 && <div className="flex items-start gap-2.5 px-4 py-3 bg-danger-500/[0.06] border border-danger-500/15 rounded-xl mb-4 text-[13px] text-danger-400">{IC.alert}<div><strong>Fehler:</strong> {valE.join(", ")}</div></div>}
      <div className="grid grid-cols-[1fr_300px] max-md:grid-cols-1 gap-5">
        <div className="flex flex-col gap-3">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Branche</label><select className={sel} value={gw} onChange={e => { setGw(e.target.value); setShowV(false); }}><option value="">–</option>{Object.entries(BRANCHEN_KATEGORIEN).map(([kat, branchen]) => <optgroup key={kat} label={kat}>{branchen.map(b => <option key={b} value={b}>{b}</option>)}</optgroup>)}</select></div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Leistungszeitraum</label><div className="flex gap-2.5 items-center"><input type="date" className={`${inp} flex-1`} value={zvon} onChange={e => setZvon(e.target.value)} /><span className="text-[13px] text-slate-500">bis</span><input type="date" className={`${inp} flex-1`} value={zbis} onChange={e => setZbis(e.target.value)} /></div></div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Kunde</label>
            {!showN ? <><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span><input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={kS} onChange={e => setKS(e.target.value)} /></div>
              {kS && fK.length > 0 && !selK && <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl mt-1.5 max-h-[140px] overflow-y-auto">{fK.map(k => <button key={k.id} className="flex flex-col gap-px py-2 px-3 bg-transparent border-none text-slate-200 cursor-pointer w-full text-left border-b border-white/[0.04] text-[13px] hover:bg-white/[0.04] transition-colors" onClick={() => { setSelK(k); setKS(""); }}><strong>{k.name}</strong><span className="text-[11px] opacity-50">{k.plz} {k.ort}</span></button>)}</div>}
              {selK && <div className="flex justify-between items-center bg-brand-500/[0.06] border border-brand-500/15 rounded-xl py-2.5 px-3 mt-1.5"><div><strong>{selK.name}</strong><br /><span className="text-[12px] text-slate-500">{selK.strasse}, {selK.plz} {selK.ort}</span></div><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => setSelK(null)}>✕</button></div>}
              <button className="bg-transparent border-none text-brand-400 text-[13px] cursor-pointer p-0 mt-1.5 font-medium hover:underline" onClick={() => setShowN(true)}>+ Neuer Kunde</button>
            </> : <div className="flex flex-col gap-2 mt-2">
              <input className={inp} placeholder="Name *" value={neuK.name} onChange={e => setNeuK({ ...neuK, name: e.target.value })} />
              <input className={inp} placeholder="Straße" value={neuK.strasse} onChange={e => setNeuK({ ...neuK, strasse: e.target.value })} />
              <div className="flex gap-2"><input className={`${inp} !w-[90px]`} placeholder="PLZ" value={neuK.plz} onChange={e => setNeuK({ ...neuK, plz: e.target.value })} /><input className={`${inp} flex-1`} placeholder="Ort" value={neuK.ort} onChange={e => setNeuK({ ...neuK, ort: e.target.value })} /></div>
              <input className={inp} placeholder="E-Mail" value={neuK.email} onChange={e => setNeuK({ ...neuK, email: e.target.value })} />
              <button className="bg-transparent border-none text-brand-400 text-[13px] cursor-pointer p-0 font-medium hover:underline" onClick={() => { setShowN(false); setNeuK({ name: "", strasse: "", plz: "", ort: "", email: "" }); }}>← Zurück</button>
            </div>}
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
            <div className="flex justify-between items-center flex-wrap gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 tracking-wide">Positionen</label>
              <div className="flex gap-2">{pos.length > 0 && <div className="text-[10px] text-slate-500 flex gap-2.5"><span>Arb: {fc(arbS)}</span><span>Mat: {fc(matS)}</span></div>}{gw && <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all" onClick={() => setShowV(!showV)}>{IC.star} KI</button>}</div>
            </div>
            {favoriten.length > 0 && <div className="bg-brand-500/[0.06] border border-brand-500/15 rounded-xl p-3 mt-2 mb-2"><div className="text-[10px] text-warning-500 font-bold uppercase tracking-[0.1em] mb-1.5">★ Favoriten</div><div className="flex flex-wrap gap-1.5">{favoriten.map((v, i) => <button key={i} className="flex flex-col gap-px py-1.5 px-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 cursor-pointer text-[11px] text-left hover:border-brand-500/30 transition-all" onClick={() => addP(v)}><span className="text-[12px]">{v.beschreibung}</span><span className="opacity-40 text-[10px]">{fc(v.preis)}/{v.einheit}</span><span className="ml-1 text-[10px] text-warning-500" onClick={e => { e.stopPropagation(); delFav(v.id); }} title="Entfernen">✕</span></button>)}</div></div>}
            {showV && gw && <div className="bg-brand-500/[0.06] border border-brand-500/15 rounded-xl p-3 mt-2"><div className="flex flex-wrap gap-1.5">{((GV as Record<string, { beschreibung: string; einheit: string; preis: number; typ: "arbeit" | "material" }[]>)[gw] || []).map((v, i) => <button key={i} className="flex flex-col gap-px py-1.5 px-2.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 cursor-pointer text-[11px] text-left hover:border-brand-500/30 transition-all" onClick={() => addP(v)}><span className="text-[12px]">{v.beschreibung}</span><span className="opacity-40 text-[10px]">{fc(v.preis)}/{v.einheit}</span><span className="ml-1 text-[10px] text-slate-500" onClick={e => { e.stopPropagation(); addFav(v); }} title="Als Favorit speichern">★</span></button>)}</div></div>}
            {pos.length > 0 && <div className="mt-3 overflow-x-auto"><div className="flex gap-1 py-1.5 px-1 text-[9px] font-semibold text-slate-500 uppercase tracking-[0.1em] border-b border-white/[0.06] min-w-[520px]"><span style={{ flex: 2.5 }}>Beschr.</span><span style={{ flex: .6 }}>Typ</span><span style={{ flex: .6 }}>Menge</span><span style={{ flex: .6 }}>Einh.</span><span style={{ flex: .7, textAlign: "right" }}>Preis</span><span style={{ flex: .5 }}>MwSt</span><span style={{ flex: .7, textAlign: "right" }}>Sum.</span><span className="w-6" /></div>
              {pos.map(p => <div key={p.id} className="flex gap-1 items-center py-1 border-b border-white/[0.04] min-w-[520px]"><input className={posI} style={{ flex: 2.5 }} value={p.beschreibung} onChange={e => updP(p.id, "beschreibung", e.target.value)} /><select className={posI} style={{ flex: .6 }} value={p.typ} onChange={e => updP(p.id, "typ", e.target.value)}><option value="arbeit">Arb</option><option value="material">Mat</option></select><input className={`${posI} text-center`} style={{ flex: .6 }} type="number" min=".01" step=".01" value={p.menge} onChange={e => updP(p.id, "menge", parseFloat(e.target.value) || 0)} /><input className={`${posI} text-center`} style={{ flex: .6 }} value={p.einheit} onChange={e => updP(p.id, "einheit", e.target.value)} /><input className={`${posI} text-right`} style={{ flex: .7 }} type="number" min="0" step=".01" value={p.preis} onChange={e => updP(p.id, "preis", parseFloat(e.target.value) || 0)} /><select className={posI} style={{ flex: .5 }} value={p.mwst} onChange={e => updP(p.id, "mwst", parseInt(e.target.value))}><option value={19}>19</option><option value={7}>7</option><option value={0}>0</option></select><span style={{ flex: .7, textAlign: "right", fontWeight: 600, fontSize: 11 }}>{fc(p.menge * p.preis)}</span><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-lg hover:text-slate-300 transition-colors" onClick={() => rmP(p.id)}>{IC.trash}</button></div>)}
            </div>}
            <button className="flex items-center gap-1.5 py-2.5 bg-transparent border-2 border-dashed border-white/[0.08] rounded-xl text-slate-500 text-[13px] cursor-pointer w-full justify-center mt-2 hover:border-white/[0.15] hover:text-slate-300 transition-all" onClick={() => addP({ beschreibung: "", einheit: "Stk", preis: 0, typ: "arbeit" })}>{IC.plus} Position</button>
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><div className="flex gap-3 flex-wrap"><div className="w-[100px]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Rabatt %</label><input className={inp} type="number" min="0" max="100" value={rabatt} onChange={e => setRabatt(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))} /></div><div className="flex-1 min-w-[180px]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Notiz</label><input className={inp} placeholder="..." value={notiz} onChange={e => setNotiz(e.target.value)} /></div></div></div>
        </div>
        <div className="sticky top-6 self-start max-md:static">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
            <h3 className="text-[14px] font-bold mb-3">Zusammenfassung</h3>
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span className="text-slate-400">Nr.</span><span className="font-mono text-[11px]">{nextNr}</span></div>
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span className="text-slate-400">Ziel</span><select className="bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 text-[11px] py-1 px-2 cursor-pointer" value={ziel} onChange={e => setZiel(parseInt(e.target.value))}><option value={7}>7d</option><option value={14}>14d</option><option value={30}>30d</option></select></div>
            <div className="border-t border-white/[0.06] my-2.5" />
            {arbS > 0 && <div className="flex justify-between items-center py-1 text-[12px] text-slate-400"><span>Arbeit</span><span>{fc(arbS)}</span></div>}
            {matS > 0 && <div className="flex justify-between items-center py-1 text-[12px] text-slate-400"><span>Material</span><span>{fc(matS)}</span></div>}
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span>Netto</span><span>{fc(netto)}</span></div>
            {rabatt > 0 && <div className="flex justify-between items-center py-1.5 text-[13px] text-danger-400"><span>-{rabatt}%</span><span>-{fc(rabattB)}</span></div>}
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span>MwSt</span><span>{fc(mwstB)}</span></div>
            <div className="flex justify-between items-center py-2 text-[18px] font-extrabold text-brand-400 pt-3 border-t border-white/[0.06] mt-1.5"><span>Brutto</span><span>{fc(brutto)}</span></div>
            {valE.length > 0 && <div className="flex items-start gap-2 mt-3 px-3 py-2.5 bg-danger-500/[0.08] border border-danger-500/20 rounded-xl text-[12px] text-danger-400"><span className="flex shrink-0 mt-0.5">{IC.alert}</span><span>{valE.join(", ")}</span></div>}
            <button className="flex items-center gap-1.5 w-full justify-center mt-4 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" style={{ opacity: (pos.length === 0 || (!selK && !neuK.name)) ? .4 : 1 }} disabled={pos.length === 0 || (!selK && !neuK.name) || saving} onClick={doSave}>{saving ? "..." : editRechnung ? "Speichern" : "Erstellen"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ RECHNUNGEN MIT PDF ═══
function RechnungenListe({ rechnungen, updRe, delRe, nav, dupRe, firma, onEdit, initialSearch = "", showT }: { rechnungen: Rechnung[]; updRe: (id: string, up: Partial<Rechnung>) => void; delRe: (id: string) => void; nav: (pg: string) => void; dupRe: (r: Rechnung) => Promise<void>; firma: Firma | null; onEdit: (r: Rechnung) => void; initialSearch?: string; showT: (msg: string) => void }) {
  const [filter, setFilter] = useState("alle"); const [search, setSearch] = useState(initialSearch);
  const [mahnM, setMahnM] = useState<Rechnung | null>(null); const [mahnS, setMahnS] = useState(1);
  const [stornierConfirm, setStornierConfirm] = useState<Rechnung | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Rechnung | null>(null);
  const [emailM, setEmailM] = useState<Rechnung | null>(null);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailCC, setEmailCC] = useState(false);
  const [emailType, setEmailType] = useState<"rechnung"|"mahnung">("rechnung");
  const [emailMahnS, setEmailMahnS] = useState(1);
  const [emailSending, setEmailSending] = useState(false);
  const [emailErr, setEmailErr] = useState("");

  const openEmailModal = (r: Rechnung, type: "rechnung"|"mahnung" = "rechnung", mahnStufe = 1) => {
    const isAngebot = r.typ === "angebot";
    const prefix = type === "mahnung" ? `${mahnStufe}. Mahnung zu Rechnung` : isAngebot ? "Angebot" : "Rechnung";
    setEmailM(r);
    setEmailTo(r.kundeEmail || "");
    setEmailSubject(`${prefix} ${r.nummer} von ${firma?.name || ""}`);
    setEmailCC(false);
    setEmailType(type);
    setEmailMahnS(mahnStufe);
    setEmailErr("");
  };

  const sendEmail = async () => {
    if (!emailTo || !emailM || !firma) return;
    setEmailSending(true); setEmailErr("");
    try {
      const html = emailType === "mahnung"
        ? generateMahnungPdfHtml(emailM, firma, emailMahnS)
        : generatePdfHtml(emailM, firma);
      const pdfBase64 = await generatePdfBase64(html);
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          ccSelf: emailCC,
          firmaEmail: firma.email,
          subject: emailSubject,
          type: emailType === "mahnung" ? "mahnung" : emailM.typ === "angebot" ? "angebot" : "rechnung",
          rechnungNummer: emailM.nummer,
          kundeName: emailM.kundeName,
          gesamt: emailM.gesamt,
          faelligDatum: emailM.faelligDatum,
          firmaName: firma.name,
          mahnStufe: emailMahnS,
          pdfBase64,
          pdfName: `${emailM.nummer}.pdf`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Senden");
      if (emailType === "mahnung") updRe(emailM.id, { status: "gemahnt", mahnstufe: emailMahnS });
      setEmailM(null);
      if (showT) showT("E-Mail erfolgreich gesendet ✓");
    } catch (err: unknown) {
      setEmailErr(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setEmailSending(false);
    }
  };
  const fl = rechnungen.filter(r => filter === "alle" || r.status === filter).filter(r => r.kundeName?.toLowerCase().includes(search.toLowerCase()) || r.nummer?.includes(search)).sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
  const exportDatev = () => { const csv = datevCSV(rechnungen); const b = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `DATEV_${new Date().toISOString().split("T")[0]}.csv`; a.click(); };

  const sbtn = "flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium";
  const sbtnG = "flex items-center gap-1.5 px-3 py-1.5 bg-success-500/10 text-success-400 border border-success-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-success-500/15 transition-all";
  const dbtn = "px-2.5 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-danger-500/15 transition-all";
  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5"><div><h1 className="text-xl font-bold tracking-tight">Rechnungen</h1><p className="text-[13px] text-slate-500 mt-1">{rechnungen.length} insgesamt</p></div><div className="flex gap-2 flex-wrap"><button className={sbtn} onClick={exportDatev}>{IC.dl} DATEV</button><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => nav("neue-rechnung")}>{IC.plus} Neu</button></div></div>
      <div className="flex gap-2.5 mb-5 flex-wrap"><div className="relative flex-1 min-w-[160px]"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span><input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="overflow-x-auto shrink-0"><div className="flex gap-0.5 bg-white/[0.04] rounded-xl p-0.5 border border-white/[0.06] w-max">{["alle", "offen", "bezahlt", "gemahnt", "storniert", "angebot"].map(f => <button key={f} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${filter === f ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}</div></div></div>
      {fl.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">{IC.doc}</div><h2 className="text-lg font-bold">Keine Ergebnisse</h2></div> :
        <div className="bg-[#0a0a1a]/80 rounded-2xl border border-white/[0.06] overflow-hidden"><div className="flex gap-1 py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.1em] bg-white/[0.02] border-b border-white/[0.06] max-md:hidden"><span style={{ flex: 1 }}>Nr.</span><span style={{ flex: 1.5 }}>Kunde</span><span style={{ flex: .7 }}>Datum</span><span style={{ flex: .8, textAlign: "right" }}>Betrag</span><span style={{ flex: .6, textAlign: "center" }}>Status</span><span style={{ flex: 2, textAlign: "right" }}>Aktionen</span></div>
          {fl.map(r => <div key={r.id} className="flex gap-1 py-3 px-4 items-center border-b border-white/[0.04] text-[13px] hover:bg-white/[0.02] transition-colors max-md:flex-col max-md:items-start max-md:gap-2 max-md:px-3">
            <div className="flex items-center gap-2 w-full md:hidden">
              <span className="font-semibold font-mono text-[11px] text-slate-400">{r.nummer}</span>
              <span className="font-semibold text-[13px] flex-1">{r.kundeName}</span>
              <SB s={r.status} />
            </div>
            <div className="flex items-center gap-2 w-full md:hidden text-[12px] text-slate-500">
              <span>{fd(r.datum)}</span>
              <span className="flex-1" />
              <span className="font-semibold text-slate-200 text-[14px]">{fc(r.gesamt)}</span>
            </div>
            <span className="font-semibold font-mono text-[11px] text-slate-400 max-md:hidden" style={{ flex: 1 }}>{r.nummer}</span>
            <span className="text-[13px] max-md:hidden" style={{ flex: 1.5 }}>{r.kundeName}</span>
            <span className="text-slate-500 text-[12px] max-md:hidden" style={{ flex: .7 }}>{fd(r.datum)}</span>
            <span className="font-semibold text-[13px] text-right max-md:hidden" style={{ flex: .8 }}>{fc(r.gesamt)}</span>
            <span className="text-center max-md:hidden" style={{ flex: .6 }}><SB s={r.status} /></span>
            <span className="flex gap-1.5 justify-end flex-wrap max-md:w-full" style={{ flex: 2 }}>
              {firma && <button className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-brand-500/15 transition-all" onClick={() => downloadPdf(r, firma)}>{IC.pdf} PDF</button>}
              {firma && <button className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-cyan-500/15 transition-all" onClick={() => openEmailModal(r, "rechnung")} title="Per E-Mail senden">{IC.mail}</button>}
              {r.status === "offen" && <button className={sbtnG} onClick={() => updRe(r.id, { status: "bezahlt" })}>{IC.check}</button>}
              {(r.status === "offen" || r.status === "gemahnt") && firma && <button className={sbtn} onClick={() => { setMahnM(r); setMahnS(r.mahnstufe ? Math.min(r.mahnstufe + 1, 3) : (r.status === "gemahnt" ? 2 : 1)); }} title="Mahnung erstellen">🔔</button>}
              {r.status === "angebot" && <button className={sbtnG} onClick={() => updRe(r.id, { status: "offen", typ: "rechnung" })}>→RE</button>}
              {r.status !== "storniert" && <button className={sbtn} onClick={() => onEdit(r)} title="Bearbeiten">✏️</button>}
              <button className={sbtn} onClick={() => dupRe(r)}>{IC.copy}</button>
              {r.status !== "storniert" && r.status !== "bezahlt" && <button className={dbtn} onClick={() => setStornierConfirm(r)}>Storno</button>}
              {(r.status === "storniert" || r.status === "angebot") && <button className={dbtn} onClick={() => setDeleteConfirm(r)}>{IC.trash}</button>}
            </span>
          </div>)}</div>}

      {mahnM && firma && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setMahnM(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6"><h2 className="text-[16px] font-bold mb-3">Zahlungserinnerung</h2><div className="flex gap-1 mb-4 bg-white/[0.04] rounded-xl p-0.5 w-fit border border-white/[0.06]">{[1, 2, 3].map(s => <button key={s} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${mahnS === s ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => setMahnS(s)}>{s}. Mahnung</button>)}</div><textarea className="w-full min-h-[180px] p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] font-sans text-slate-200 resize-y outline-none" value={mahnung(mahnM, firma, mahnS)} readOnly /><div className="flex gap-2 mt-4 justify-end flex-wrap"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-lg text-[11px] cursor-pointer font-medium" onClick={() => { openAsPdf(generateMahnungPdfHtml(mahnM, firma, mahnS)); updRe(mahnM.id, { status: "gemahnt", mahnstufe: mahnS }); setMahnM(null); }}>{IC.pdf} PDF</button><button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-cyan-500/15 transition-all" onClick={() => { setMahnM(null); openEmailModal(mahnM, "mahnung", mahnS); }}>{IC.mail} Per E-Mail</button><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={() => { navigator.clipboard.writeText(mahnung(mahnM, firma, mahnS)); updRe(mahnM.id, { status: "gemahnt", mahnstufe: mahnS }); setMahnM(null); }}>Kopieren</button><button className={sbtn} onClick={() => setMahnM(null)}>Schließen</button></div></div></div></div>}

      {stornierConfirm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setStornierConfirm(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6"><h2 className="text-[16px] font-bold mb-3">Rechnung stornieren?</h2><p className="text-[13px] text-slate-400 mb-5 leading-relaxed"><strong className="text-slate-200">{stornierConfirm.nummer}</strong> – {stornierConfirm.kundeName}<br />Betrag: {fc(stornierConfirm.gesamt)}<br /><br />Die Rechnung wird als storniert markiert und aus allen Auswertungen ausgeschlossen.</p><div className="flex gap-2 justify-end"><button className={dbtn} onClick={() => { updRe(stornierConfirm.id, { status: "storniert" }); setStornierConfirm(null); }}>Ja, stornieren</button><button className={sbtn} onClick={() => setStornierConfirm(null)}>Abbrechen</button></div></div></div></div>}

      {deleteConfirm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setDeleteConfirm(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6"><h2 className="text-[16px] font-bold mb-3">Rechnung endgültig löschen?</h2><p className="text-[13px] text-slate-400 mb-5 leading-relaxed"><strong className="text-slate-200">{deleteConfirm.nummer}</strong> – {deleteConfirm.kundeName}<br />Betrag: {fc(deleteConfirm.gesamt)}<br /><br /><span className="text-danger-400">Die Rechnung wird unwiderruflich gelöscht und kann nicht wiederhergestellt werden.</span></p><div className="flex gap-2 justify-end"><button className={dbtn} onClick={() => { delRe(deleteConfirm.id); setDeleteConfirm(null); }}>Endgültig löschen</button><button className={sbtn} onClick={() => setDeleteConfirm(null)}>Abbrechen</button></div></div></div></div>}

      {/* ── E-MAIL MODAL ── */}
      {emailM && firma && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => !emailSending && setEmailM(null)}>
          <div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[500px] w-full shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">{IC.mail}</div>
                <div>
                  <h2 className="text-[16px] font-bold leading-tight">
                    {emailType === "mahnung" ? `${emailMahnS}. Mahnung per E-Mail` : emailM.typ === "angebot" ? "Angebot per E-Mail senden" : "Rechnung per E-Mail senden"}
                  </h2>
                  <p className="text-[12px] text-slate-500 mt-0.5">{emailM.nummer} · {emailM.kundeName} · {fc(emailM.gesamt)}</p>
                </div>
              </div>

              {/* Typ-Wechsler (wenn Mahnung möglich) */}
              {(emailM.status === "offen" || emailM.status === "gemahnt") && (
                <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-xl p-0.5 w-fit border border-white/[0.06]">
                  <button className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${emailType === "rechnung" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => { setEmailType("rechnung"); setEmailSubject(`${emailM.typ === "angebot" ? "Angebot" : "Rechnung"} ${emailM.nummer} von ${firma.name}`); }}>{emailM.typ === "angebot" ? "Angebot" : "Rechnung"}</button>
                  <button className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${emailType === "mahnung" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => { setEmailType("mahnung"); const ms = emailM.mahnstufe ? Math.min(emailM.mahnstufe + 1, 3) : (emailM.status === "gemahnt" ? 2 : 1); setEmailMahnS(ms); setEmailSubject(`${ms}. Mahnung zu Rechnung ${emailM.nummer} – ${firma.name}`); }}>Mahnung</button>
                </div>
              )}

              {/* Mahnstufe-Wähler */}
              {emailType === "mahnung" && (
                <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-xl p-0.5 w-fit border border-white/[0.06]">
                  {[1, 2, 3].map(s => (
                    <button key={s} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${emailMahnS === s ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => { setEmailMahnS(s); setEmailSubject(`${s}. Mahnung zu Rechnung ${emailM.nummer} – ${firma.name}`); }}>{s}. Mahnung</button>
                  ))}
                </div>
              )}

              {/* Felder */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Empfänger *</label>
                  <input className={inp} type="email" placeholder="kunde@beispiel.de" value={emailTo} onChange={e => setEmailTo(e.target.value)} disabled={emailSending} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Betreff</label>
                  <input className={inp} placeholder="Betreff..." value={emailSubject} onChange={e => setEmailSubject(e.target.value)} disabled={emailSending} />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer group mt-1">
                  <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all text-[10px] ${emailCC ? "bg-brand-500 border-brand-500 text-white" : "border-white/[0.15] bg-transparent"}`} onClick={() => !emailSending && setEmailCC(!emailCC)}>
                    {emailCC && "✓"}
                  </div>
                  <span className="text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors">Kopie an mich senden{firma.email ? ` (${firma.email})` : ""}</span>
                </label>
              </div>

              {/* Anhang-Hinweis */}
              <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <span className="text-slate-500 flex">{IC.pdf}</span>
                <span className="text-[12px] text-slate-500">{emailM.nummer}.pdf <span className="text-slate-600">– wird automatisch als Anhang beigefügt</span></span>
              </div>

              {/* Fehler */}
              {emailErr && <div className="mt-3 px-3 py-2 bg-danger-500/10 border border-danger-500/20 rounded-lg text-[12px] text-danger-400">{emailErr}</div>}

              {/* Aktionen */}
              <div className="flex gap-2 mt-5 justify-end">
                <button className={sbtn} onClick={() => setEmailM(null)} disabled={emailSending}>Abbrechen</button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(6,182,212,0.3)] hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  onClick={sendEmail}
                  disabled={!emailTo || emailSending}
                >
                  {emailSending ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Wird gesendet…</>
                  ) : (
                    <>{IC.mail} Jetzt senden</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ KUNDEN ═══
function KundenListe({ kunden, rechnungen, updKu, delKu }: { kunden: Kunde[]; rechnungen: Rechnung[]; updKu: (id: string, up: Partial<Kunde>) => void; delKu: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [editK, setEditK] = useState<Kunde | null>(null);
  const [delConfirm, setDelConfirm] = useState<Kunde | null>(null);
  const [editForm, setEditForm] = useState<Partial<Kunde>>({});
  const f = kunden.filter(k => k.name?.toLowerCase().includes(search.toLowerCase()));
  const st = (kid: string) => { const kr = rechnungen.filter(r => r.kundeId === kid); return { c: kr.length, u: kr.filter(r => r.status === "bezahlt").reduce((s, r) => s + r.gesamt, 0) }; };
  const openEdit = (k: Kunde) => { setEditK(k); setEditForm({ name: k.name || "", strasse: k.strasse || "", plz: k.plz || "", ort: k.ort || "", email: k.email || "", telefon: k.telefon || "" }); };
  const hasOpenRE = (kid: string) => rechnungen.some(r => r.kundeId === kid && (r.status === "offen" || r.status === "gemahnt"));
  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const mInp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 transition-all duration-200 placeholder:text-slate-600";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5"><div><h1 className="text-xl font-bold tracking-tight">Kunden</h1><p className="text-[13px] text-slate-500 mt-1">{kunden.length} gespeichert</p></div></div>
      <div className="relative max-w-xs mb-5"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span><input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      {f.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">{IC.users}</div><h2 className="text-lg font-bold">Keine Kunden</h2></div> :
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">{f.map(k => { const s = st(k.id); return (
          <div key={k.id} className="group flex gap-3 bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06] items-center hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/15 flex items-center justify-center text-sm font-bold text-brand-400 shrink-0">{k.name?.charAt(0)?.toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] group-hover:text-white transition-colors">{k.name}</div>
              <div className="text-[12px] text-slate-500">{k.strasse && `${k.strasse}, `}{k.plz} {k.ort}</div>
              {k.email && <div className="text-[12px] text-slate-500">{k.email}</div>}
              {k.telefon && <div className="text-[12px] text-slate-500">{k.telefon}</div>}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="text-[11px] text-right text-slate-400"><div>{s.c} RE</div><div className="font-medium">{fc(s.u)}</div></div>
              <div className="flex gap-1.5">
                <button className="flex items-center gap-1 px-2.5 py-1.5 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer hover:bg-white/[0.08] transition-all" onClick={() => openEdit(k)}>✏️</button>
                <button className="px-2.5 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer hover:bg-danger-500/15 transition-all" onClick={() => setDelConfirm(k)} title="Löschen">{IC.trash}</button>
              </div>
            </div>
          </div>
        ); })}</div>}

      {editK && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setEditK(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[440px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6"><h2 className="text-[16px] font-bold mb-4">Kunde bearbeiten</h2><div className="flex flex-col gap-2.5"><input className={mInp} placeholder="Name *" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /><input className={mInp} placeholder="Straße" value={editForm.strasse} onChange={e => setEditForm({ ...editForm, strasse: e.target.value })} /><div className="flex gap-2"><input className={`${mInp} !w-[100px]`} placeholder="PLZ" value={editForm.plz} onChange={e => setEditForm({ ...editForm, plz: e.target.value })} /><input className={`${mInp} flex-1`} placeholder="Ort" value={editForm.ort} onChange={e => setEditForm({ ...editForm, ort: e.target.value })} /></div><input className={mInp} placeholder="E-Mail" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /><input className={mInp} placeholder="Telefon" value={editForm.telefon} onChange={e => setEditForm({ ...editForm, telefon: e.target.value })} /></div><div className="flex gap-2 mt-5 justify-end"><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={() => { if (!editForm.name) return; updKu(editK.id, editForm); setEditK(null); }}>Speichern</button><button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setEditK(null)}>Abbrechen</button></div></div></div></div>}

      {delConfirm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setDelConfirm(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6"><h2 className="text-[16px] font-bold mb-3">Kunde löschen?</h2><p className="text-[13px] text-slate-400 mb-5 leading-relaxed"><strong className="text-slate-200">{delConfirm.name}</strong>{hasOpenRE(delConfirm.id) ? <><br /><span className="text-danger-400">Dieser Kunde hat noch offene Rechnungen!</span></> : ""}<br /><br />Alle Kundendaten werden gelöscht. Rechnungen bleiben erhalten.</p><div className="flex gap-2 justify-end"><button className="px-3 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-danger-500/15 transition-all" onClick={() => { delKu(delConfirm.id); setDelConfirm(null); }}>Löschen</button><button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setDelConfirm(null)}>Abbrechen</button></div></div></div></div>}
    </div>
  );
}

// ═══ WIEDERKEHREND ═══
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WiederkehrendPage({ wiederkehrend, addWdk, updWdk, delWdk, kunden, rechnungen, firma }: { wiederkehrend: WiederkehrendItem[]; addWdk: (w: Omit<WiederkehrendItem, "id">) => void; updWdk: (id: string, up: Partial<WiederkehrendItem>) => void; delWdk: (id: string) => void; kunden: Kunde[]; rechnungen: Rechnung[]; firma: Firma | null }) {
  const [showForm, setShowForm] = useState(false);
  const emptyForm: Omit<WiederkehrendItem, "id"> = { name: "", kundeId: "", kundeName: "", kundeAdresse: "", kundeEmail: "", positionen: [], zahlungsziel: 14, notiz: "", gewerk: "", rabatt: 0, netto: 0, mwst: 0, gesamt: 0, interval: "monatlich", nextDue: new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString().split("T")[0], aktiv: true };
  const [form, setForm] = useState<Omit<WiederkehrendItem, "id">>(emptyForm);
  const [kS, setKS] = useState(""); const [selK, setSelK] = useState<Kunde | null>(null);
  const fK = kunden.filter(k => k.name.toLowerCase().includes(kS.toLowerCase()));

  const calcFromRe = (reId: string) => {
    const re = rechnungen.find(r => r.id === reId);
    if (!re) return;
    const k = kunden.find(k => k.id === re.kundeId);
    setForm(prev => ({ ...prev, kundeId: re.kundeId, kundeName: re.kundeName, kundeAdresse: re.kundeAdresse, kundeEmail: re.kundeEmail || "", positionen: re.positionen, zahlungsziel: re.zahlungsziel, notiz: re.notiz || "", gewerk: re.gewerk || "", rabatt: re.rabatt || 0, netto: re.netto, mwst: re.mwst, gesamt: re.gesamt, name: `${re.kundeName} – ${re.gewerk || "Wiederkehrend"}` }));
    if (k) setSelK(k);
  };

  const doAdd = () => {
    if (!form.name || !form.kundeName) return;
    addWdk(form); setShowForm(false); setForm(emptyForm); setSelK(null); setKS("");
  };

  const intervals = { monatlich: "Monatlich", quartal: "Quartal", jaehrlich: "Jährlich" };

  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const sel = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none cursor-pointer";
  const lbl = "text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5"><div><h1 className="text-xl font-bold tracking-tight">Wiederkehrende Rechnungen</h1><p className="text-[13px] text-slate-500 mt-1">Automatisch erstellt wenn fällig</p></div><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => setShowForm(!showForm)}>{IC.plus} Neue Vorlage</button></div>

      {showForm && <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06] mb-5">
        <h3 className="text-[14px] font-semibold mb-4">Neue Vorlage</h3>
        <div className="flex flex-col gap-3 max-w-[500px]">
          <div><label className={lbl}>Name der Vorlage *</label><input className={inp} placeholder="z.B. Müller GmbH – Wartung" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={lbl}>Aus vorhandener Rechnung übernehmen</label><select className={sel} onChange={e => e.target.value && calcFromRe(e.target.value)}><option value="">– Manuell eingeben –</option>{rechnungen.filter(r => r.status !== "storniert").map(r => <option key={r.id} value={r.id}>{r.nummer} – {r.kundeName} ({fc(r.gesamt)})</option>)}</select></div>
          <div><label className={lbl}>Kunde *</label>
            {!selK ? <><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span><input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={kS} onChange={e => setKS(e.target.value)} /></div>
              {kS && fK.length > 0 && <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl mt-1.5 max-h-[140px] overflow-y-auto">{fK.map(k => <button key={k.id} className="flex flex-col gap-px py-2 px-3 bg-transparent border-none text-slate-200 cursor-pointer w-full text-left border-b border-white/[0.04] text-[13px] hover:bg-white/[0.04] transition-colors" onClick={() => { setSelK(k); setForm({...form, kundeId: k.id, kundeName: k.name, kundeAdresse: `${k.strasse || ""}, ${k.plz || ""} ${k.ort || ""}`, kundeEmail: k.email || ""}); setKS(""); }}><strong>{k.name}</strong></button>)}</div>}</>
              : <div className="flex justify-between items-center bg-brand-500/[0.06] border border-brand-500/15 rounded-xl py-2.5 px-3 mt-1.5"><div><strong>{selK.name}</strong></div><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => { setSelK(null); setForm({...form, kundeId: "", kundeName: ""}); }}>✕</button></div>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1"><label className={lbl}>Intervall</label><select className={sel} value={form.interval} onChange={e => setForm({...form, interval: e.target.value as "monatlich" | "quartal" | "jaehrlich"})}><option value="monatlich">Monatlich</option><option value="quartal">Quartal</option><option value="jaehrlich">Jährlich</option></select></div>
            <div className="flex-1"><label className={lbl}>Erste Fälligkeit</label><input type="date" className={inp} value={form.nextDue} onChange={e => setForm({...form, nextDue: e.target.value})} /></div>
          </div>
          {form.positionen.length > 0 && <div className="text-[13px] text-slate-400 py-2.5 px-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">{form.positionen.length} Position(en) übernommen · {fc(form.gesamt)}</div>}
          <div className="flex gap-2"><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={doAdd}>Speichern</button><button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setShowForm(false)}>Abbrechen</button></div>
        </div>
      </div>}

      {wiederkehrend.length === 0 && !showForm ? <div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-2xl">🔄</div><h2 className="text-lg font-bold">Noch keine Vorlagen</h2><p className="text-[13px] text-slate-500 mt-2 max-w-[400px] leading-relaxed">Erstelle Vorlagen für Wartungsverträge, monatliche Retainer oder Abonnements.</p></div> :
        <div className="flex flex-col gap-3">
          {wiederkehrend.map(w => <div key={w.id} className={`bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06] flex gap-3 items-center hover:border-white/[0.1] transition-all ${w.aktiv ? "" : "opacity-40"}`}>
            <div className="flex-1"><div className="font-semibold text-[14px]">{w.name}</div><div className="text-[13px] text-slate-500 mt-0.5">{w.kundeName} · {intervals[w.interval]} · Nächste: {fd(w.nextDue)}</div></div>
            <div className="font-extrabold text-[16px] whitespace-nowrap">{fc(w.gesamt)}</div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => updWdk(w.id, { aktiv: !w.aktiv })}>{w.aktiv ? "Pausieren" : "Aktivieren"}</button>
              <button className="px-2.5 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer hover:bg-danger-500/15 transition-all" onClick={() => delWdk(w.id)}>{IC.trash}</button>
            </div>
          </div>)}
        </div>}
    </div>
  );
}

// ═══ ABO ═══
function AboPage({ plan, spl }: { plan: string; spl: (p: string) => void }) {
  const pls = [
    { id: "free", n: "Free", p: "0", feat: ["5 Rechnungen", "3 Kunden", "KI-Vorschläge"] },
    { id: "starter", n: "Starter", p: "9,99", feat: ["50 Rechnungen", "25 Kunden", "Logo", "Vorschau", "Angebote", "PDF-Export"], pop: true },
    { id: "pro", n: "Pro", p: "24,99", feat: ["500 Rechnungen", "Unbegr. Kunden", "Alles Starter", "Mahnwesen", "DATEV", "§14 Check"] },
    { id: "enterprise", n: "Enterprise", p: "49,99", feat: ["Unbegrenzt", "Multi-User", "API", "DATEV direkt", "PDF-Versand"] },
  ];
  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in"><div className="text-center mb-8"><h1 className="text-[28px] font-extrabold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Wähle deinen Plan</h1><p className="text-[14px] text-slate-500 mt-2">Starte kostenlos. Upgrade jederzeit.</p></div>
      <div className="grid grid-cols-4 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-3">{pls.map(p => <div key={p.id} className={`rounded-2xl p-5 flex flex-col relative transition-all duration-200 ${p.pop ? "bg-gradient-to-b from-brand-500/10 to-brand-600/5 border-2 border-brand-500/40 shadow-[0_0_40px_rgba(99,102,241,0.08)]" : "bg-[#0a0a1a]/80 border border-white/[0.06] hover:border-white/[0.1]"}`}>{p.pop && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[9px] font-bold px-3.5 py-0.5 rounded-full tracking-wider shadow-[0_0_16px_rgba(99,102,241,0.3)]">BELIEBT</div>}<div className="text-[12px] font-semibold text-brand-400">{p.n}</div><div className="flex items-baseline gap-[3px] my-1.5"><span className="text-[32px] font-extrabold tracking-tight">{p.p}€</span><span className="text-[12px] text-slate-500">/Mo</span></div><div className="flex-1 flex flex-col gap-1.5 my-3 mb-5">{p.feat.map((f, i) => <div key={i} className="flex items-center gap-2 text-[13px]"><span className="text-success-500 flex">{IC.check}</span>{f}</div>)}</div><button className={`w-full justify-center transition-all duration-200 ${plan === p.id ? "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-xl text-[12px] cursor-default" : p.pop ? "flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px]" : "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08]"}`} disabled={plan === p.id} onClick={() => spl(p.id)}>{plan === p.id ? "Aktuell" : "Wählen"}</button></div>)}</div>
    </div>
  );
}

// ═══ SUPABASE SETUP PAGE ═══
function SupabasePage() {
  const [tab, setTab] = useState("intro");
  const [copied, setCopied] = useState("");
  const copyCode = (code: string, label: string) => { navigator.clipboard.writeText(code); setCopied(label); setTimeout(() => setCopied(""), 2000); };

  const sbtn = "flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6"><div><h1 className="text-xl font-bold tracking-tight">Backend-Integration</h1><p className="text-[13px] text-slate-500 mt-1">Supabase Setup für Produktion</p></div></div>

      <div className="flex gap-0.5 bg-white/[0.04] rounded-xl p-0.5 mb-6 border border-white/[0.06] w-fit">
        {[{ id: "intro", l: "Übersicht" }, { id: "sql", l: "1. SQL Schema" }, { id: "code", l: "2. JS Client" }, { id: "deploy", l: "3. Deployment" }].map(t => <button key={t.id} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${tab === t.id ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setTab(t.id)}>{t.l}</button>)}
      </div>

      {tab === "intro" && (
        <div className="flex flex-col gap-3.5">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]"><h3 className="text-[14px] font-semibold mb-4">Warum Supabase?</h3><p className="text-[13px] text-slate-400 leading-relaxed">Supabase ist eine Open-Source Firebase-Alternative mit PostgreSQL. Kostenloser Tier mit 500MB Storage, Auth, Realtime und Row Level Security – perfekt für RechnungsKI.</p></div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]"><h3 className="text-[14px] font-semibold mb-4">Was du bekommst</h3>
            <div className="grid grid-cols-2 gap-2.5 mt-2">
              {["Auth (Login/Register)", "PostgreSQL Datenbank", "Row Level Security", "Realtime Updates", "Auto-generierte API", "Cloud Hosting (DE möglich)", "Edge Functions", "50k monatl. Requests (free)"].map((f, i) => <div key={i} className="flex gap-1.5 text-[13px] items-center"><span className="text-success-500 flex">{IC.check}</span>{f}</div>)}
            </div>
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]"><h3 className="text-[14px] font-semibold mb-4">3 Schritte zur Produktion</h3>
            <div className="flex flex-col gap-2.5 mt-2">
              {["Account auf supabase.com erstellen (kostenlos)", "SQL Schema in SQL Editor einfügen", "Supabase JS Client in dein React-Projekt einbauen"].map((s, i) => <div key={i} className="flex gap-2.5 text-[13px]"><span className="text-brand-400 font-bold min-w-5">{i + 1}.</span>{s}</div>)}
            </div>
          </div>
        </div>
      )}

      {tab === "sql" && (
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[13px] font-semibold">SQL Schema</h3>
            <button className={sbtn} onClick={() => copyCode(SUPABASE_SQL_SCHEMA, "sql")}>{copied === "sql" ? "✓ Kopiert!" : "Kopieren"}</button>
          </div>
          <p className="text-xs text-slate-500 mb-3">Kopiere dieses SQL und füge es in den Supabase SQL Editor ein (Dashboard → SQL Editor → New Query).</p>
          <pre className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-[11px] text-slate-400 overflow-auto max-h-[500px] leading-relaxed font-mono whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      )}

      {tab === "code" && (
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[13px] font-semibold">JavaScript Client</h3>
            <button className={sbtn} onClick={() => copyCode(SUPABASE_JS_CODE, "js")}>{copied === "js" ? "✓ Kopiert!" : "Kopieren"}</button>
          </div>
          <p className="text-xs text-slate-500 mb-3">Erstelle eine Datei <code className="bg-slate-800 px-1.5 py-0.5 rounded">lib/supabase.js</code> mit diesem Code.</p>
          <pre className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 text-[11px] text-slate-400 overflow-auto max-h-[500px] leading-relaxed font-mono whitespace-pre-wrap">{SUPABASE_JS_CODE}</pre>
        </div>
      )}

      {tab === "deploy" && (
        <div className="flex flex-col gap-3.5">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]"><h3 className="text-[14px] font-semibold mb-4">Deployment-Checkliste</h3>
            <div className="flex flex-col gap-2 mt-2">
              {[
                { title: "1. Supabase Projekt erstellen", desc: "supabase.com → New Project → Region: Frankfurt (eu-central-1)" },
                { title: "2. SQL ausführen", desc: "Dashboard → SQL Editor → Paste Schema → Run" },
                { title: "3. npm install", desc: "npm install " + _SB_PKG },
                { title: "4. Environment Vars", desc: "NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local" },
                { title: "5. Auth aktivieren", desc: "Dashboard → Auth → Email/Password aktivieren" },
                { title: "6. Storage ersetzen", desc: "window.storage Calls durch Supabase Client Calls ersetzen" },
                { title: "7. Vercel/Netlify Deploy", desc: "git push → automatisches Deployment" },
              ].map((s, i) => <div key={i} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.06]"><div className="font-semibold text-[13px] mb-[3px]">{s.title}</div><div className="text-xs text-slate-500">{s.desc}</div></div>)}
            </div>
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]"><h3 className="text-[14px] font-semibold mb-4">Kosten-Schätzung</h3>
            <div className="grid grid-cols-3 gap-2.5 mt-2">
              {[{ n: "Supabase Free", p: "0€/Mo", d: "Bis 50.000 Requests" }, { n: "Supabase Pro", p: "25$/Mo", d: "Ab 100.000 Requests" }, { n: "Vercel Hosting", p: "0-20$/Mo", d: "Gratis bis 100GB" }].map((c, i) => <div key={i} className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] text-center"><div className="font-semibold text-[13px]">{c.n}</div><div className="text-[22px] font-extrabold text-brand-400 my-1">{c.p}</div><div className="text-[11px] text-slate-500">{c.d}</div></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ SETTINGS ═══
function SettingsPage({ firma, sf, rechnungen, kunden, sre, skn, favoriten, setFavoriten, wiederkehrend, saveWdk, plan, spl, showT }: { firma: Firma | null; sf: (f: Firma | null) => void; rechnungen: Rechnung[]; kunden: Kunde[]; sre: (r: Rechnung[]) => void; skn: (k: Kunde[]) => void; favoriten: FavoritItem[]; setFavoriten: (f: FavoritItem[]) => void; wiederkehrend: WiederkehrendItem[]; saveWdk: (w: WiederkehrendItem[]) => void; plan: string; spl: (p: string) => void; showT: (msg: string) => void }) {
  const [form, setForm] = useState<Firma>(firma || { name: "", inhaber: "", strasse: "", plz: "", ort: "", telefon: "", email: "", web: "", steuernr: "", ustid: "", bankName: "", iban: "", bic: "", gewerk: "", logo: "" });
  const [showR, setShowR] = useState(false);
  const [deleteInput, setDeleteInput] = useState(""); const fRef = useRef<HTMLInputElement>(null);
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 2000000) { alert("Datei zu groß – max. 2 MB."); return; } const img = new Image(); const url = URL.createObjectURL(f); img.onload = () => { const c = document.createElement("canvas"); const MAX = 400; let w = img.width, h = img.height; if (w > MAX) { h = h * MAX / w; w = MAX; } c.width = w; c.height = h; c.getContext("2d")!.drawImage(img, 0, 0, w, h); const compressed = c.toDataURL("image/jpeg", 0.75); setForm(prev => ({ ...prev, logo: compressed })); URL.revokeObjectURL(url); }; img.src = url; };

  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const sbtn = "flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in"><div className="flex justify-between items-start mb-6"><div><h1 className="text-xl font-bold tracking-tight">Einstellungen</h1></div></div>
      <div className="flex flex-col gap-4 max-w-[620px]">
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Logo</h3><div className="flex items-center gap-4">
          {form.logo ? <div className="relative"><img src={form.logo} alt="" className="max-h-[50px] max-w-[150px] rounded-xl border border-white/[0.1] bg-white p-1 object-contain" /><button className="absolute -top-1.5 -right-1.5 bg-slate-800 rounded-full w-[18px] h-[18px] flex items-center justify-center border border-white/[0.1] text-[10px] text-slate-400 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setForm({ ...form, logo: "" })}>✕</button></div>
            : <div className="w-[100px] h-[56px] rounded-xl border-2 border-dashed border-white/[0.1] flex items-center justify-center text-slate-600 cursor-pointer hover:border-brand-500/30 hover:bg-brand-500/[0.03] transition-all" onClick={() => fRef.current?.click()}>{IC.img}</div>}
          <button className={sbtn} onClick={() => fRef.current?.click()}>{form.logo ? "Ändern" : "Hochladen"}</button><input ref={fRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} /></div></div>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Firmendaten</h3><div className="flex flex-col gap-2">
          <div className="flex gap-[7px]"><FI l="Firma *" v={form.name} k="name" f={form} s={setForm} /><FI l="Inhaber" v={form.inhaber} k="inhaber" f={form} s={setForm} /></div>
          <FI l="Straße *" v={form.strasse} k="strasse" f={form} s={setForm} />
          <div className="flex gap-[7px]"><FI l="PLZ *" v={form.plz} k="plz" f={form} s={setForm} w={100} /><FI l="Ort *" v={form.ort} k="ort" f={form} s={setForm} /></div>
          <div className="flex gap-[7px]"><FI l="Tel" v={form.telefon} k="telefon" f={form} s={setForm} /><FI l="E-Mail" v={form.email} k="email" f={form} s={setForm} /></div>
        </div></div>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Steuern (§14 Pflicht)</h3><div className="flex gap-2 mb-2.5"><FI l="Steuernr." v={form.steuernr} k="steuernr" f={form} s={setForm} /><FI l="USt-ID" v={form.ustid} k="ustid" f={form} s={setForm} /></div><label className="flex items-center gap-2.5 cursor-pointer text-[13px]"><input type="checkbox" className="w-4 h-4 rounded accent-brand-500" checked={!!form.kleinunternehmer} onChange={e => setForm({ ...form, kleinunternehmer: e.target.checked })} /><span>Kleinunternehmer nach §19 UStG (kein MwSt-Ausweis)</span></label></div>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Bank</h3><div className="flex flex-col gap-2"><FI l="Bank" v={form.bankName} k="bankName" f={form} s={setForm} /><div className="flex gap-2"><FI l="IBAN" v={form.iban} k="iban" f={form} s={setForm} /><FI l="BIC" v={form.bic} k="bic" f={form} s={setForm} w={140} /></div></div></div>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer w-fit hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => { if (!form.name) return; sf(form); }}>Speichern</button>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">{IC.dl} Datensicherung</h3>
          <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">Exportiere alle Daten als JSON-Backup oder importiere ein vorhandenes Backup.</p>
          <div className="flex gap-2 flex-wrap">
            <button className={sbtn} onClick={() => { const data = { version: 1, date: new Date().toISOString(), firma, rechnungen, kunden, favoriten: favoriten || [], wiederkehrend: wiederkehrend || [], plan }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `RechnungsKI_Backup_${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(a.href); showT("Backup heruntergeladen!"); }}>{IC.dl} Export (.json)</button>
            <label className={`${sbtn} cursor-pointer`}><input type="file" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const reader = new FileReader(); reader.onload = ev => { try { const d = JSON.parse(ev.target?.result as string); if (!d.version || !d.firma) { showT("Ungültiges Backup!"); return; } if (!confirm(`Backup vom ${fd(d.date)} importieren? Aktuelle Daten werden überschrieben.`)) return; sf(d.firma); sre(d.rechnungen || []); skn(d.kunden || []); if (d.favoriten) { setFavoriten(d.favoriten); sv("inv-favoriten", d.favoriten); } if (d.wiederkehrend) { saveWdk(d.wiederkehrend); } if (d.plan) { spl(d.plan); } setForm(d.firma); showT("Backup importiert!"); } catch { showT("Datei konnte nicht gelesen werden!"); } }; reader.readAsText(f); e.target.value = ""; }} />⬆ Import</label>
          </div>
        </div>
        <div className="bg-danger-500/[0.04] rounded-2xl p-4 border border-danger-500/15"><h3 className="text-[14px] font-bold text-danger-400 mb-2">Gefahrenzone</h3>
          {!showR ? <button className="px-3 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-danger-500/15 transition-all" onClick={() => { setShowR(true); setDeleteInput(""); }}>Alles löschen</button> : <div className="flex flex-col gap-2.5"><p className="text-[13px] text-danger-300/80 leading-relaxed">Alle Rechnungen, Kunden und Firmendaten werden unwiderruflich gelöscht.<br />Gib <strong>LÖSCHEN</strong> ein um zu bestätigen:</p><input className={`${inp} !text-danger-400 !border-danger-500/30`} placeholder="LÖSCHEN" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} /><div className="flex gap-2"><button className="px-3 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium" disabled={deleteInput !== "LÖSCHEN"} style={{ opacity: deleteInput !== "LÖSCHEN" ? 0.4 : 1, cursor: deleteInput !== "LÖSCHEN" ? "not-allowed" : "pointer" }} onClick={async () => { if (deleteInput !== "LÖSCHEN") return; await sre([]); await skn([]); await sf(null); window.location.reload(); }}>Endgültig löschen</button><button className={sbtn} onClick={() => { setShowR(false); setDeleteInput(""); }}>Abbrechen</button></div></div>}
        </div>
      </div>
    </div>
  );
}
function FI({ l, v, k, f, s, w }: { l: string; v: string | undefined; k: string; f: Firma; s: (v: Firma) => void; w?: number }) { return <div className="flex-1" style={w ? { maxWidth: w } : {}}><label className="text-[10px] text-slate-500 mb-1 block font-medium tracking-wide">{l}</label><input className="w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200" value={v || ""} onChange={e => s({ ...f, [k]: e.target.value })} /></div>; }

// CSS removed — all styles are now Tailwind classes
