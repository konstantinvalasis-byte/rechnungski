// @ts-nocheck
"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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
const GEWERKE = Object.keys(GV);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const fc = v => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v);
const fd = d => d ? new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–";
const fcn = v => v.toFixed(2).replace(".", ",");

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
async function ld(k, fb) { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : fb; } catch { return fb; } }
async function sv(k, v) { try { await window.storage.set(k, JSON.stringify(v)); } catch (e) { console.error(e); } }

// ═══════════════════════════════════════════════════════════
// §14 UStG VALIDATION
// ═══════════════════════════════════════════════════════════
function validateFirma(f) {
  const e = [];
  if (!f?.name) e.push("Firmenname");
  if (!f?.strasse) e.push("Anschrift");
  if (!f?.plz || !f?.ort) e.push("PLZ/Ort");
  if (!f?.steuernr && !f?.ustid) e.push("Steuernr./USt-ID (§14)");
  return e;
}
function validateRechnung(r, f) {
  const e = validateFirma(f);
  if (!r.kundeName) e.push("Kundenname");
  if (!r.kundeAdresse || r.kundeAdresse.includes("undefined")) e.push("Kundenadresse");
  if (!r.positionen?.length) e.push("Positionen");
  if (r.positionen?.some(p => !p.beschreibung || p.preis <= 0)) e.push("Pos. unvollständig");
  return e;
}

// DATEV
function datevCSV(re, f) {
  const h = "Umsatz;S/H;WKZ;Kurs;Basis;WKZ-B;Konto;Gegenkonto;BU;Belegdatum;Beleg1;Beleg2;Skonto;Text";
  const rows = re.filter(r => r.status !== "angebot" && r.status !== "storniert").map(r => {
    const d = new Date(r.datum); return `${fcn(r.gesamt)};S;EUR;;;;;;8400;;${d.getDate()}${d.getMonth() + 1};${r.nummer};;0,00;${r.kundeName}`;
  });
  return h + "\n" + rows.join("\n");
}

// Mahnung
function mahnung(r, f, s = 1) {
  const t = { 1: `Sehr geehrte Damen und Herren,\n\nwir erinnern freundlich an die Zahlung unserer Rechnung ${r.nummer} vom ${fd(r.datum)} über ${fc(r.gesamt)}.\n\nZahlungsziel: ${fd(r.faelligDatum)}. Bitte überweisen Sie innerhalb von 7 Tagen.\n\nBank: ${f.bankName || "–"}\nIBAN: ${f.iban || "–"}\n\nMit freundlichen Grüßen\n${f.name}`, 2: `Sehr geehrte Damen und Herren,\n\nbis heute liegt kein Zahlungseingang für Rechnung ${r.nummer} über ${fc(r.gesamt)} vor.\n\nBitte begleichen Sie den Betrag innerhalb von 5 Werktagen.\n\nMit freundlichen Grüßen\n${f.name}`, 3: `LETZTE MAHNUNG\n\nRechnung ${r.nummer} über ${fc(r.gesamt)}.\n\nBei Nichtzahlung innerhalb 3 Werktagen erfolgt Übergabe an Inkasso.\n\n${f.name}` };
  return t[s] || t[1];
}

// ═══════════════════════════════════════════════════════════
// PDF GENERATOR (pure JS, no dependencies)
// Uses window.print() on a styled hidden iframe for real PDF
// ═══════════════════════════════════════════════════════════
function generatePdfHtml(rechnung, firma) {
  const pos = rechnung.positionen || [];
  const arbeit = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const mat = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);

  const logoHtml = firma.logo ? `<img src="${firma.logo}" style="max-height:55px;max-width:170px;object-fit:contain;margin-bottom:8px;" />` : "";

  const rows = pos.map((p, i) => `
    <tr>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;color:#666">${i + 1}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;font-weight:500">${p.beschreibung}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:10px;color:#888">${p.typ === "material" ? "Material" : "Arbeit"}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${p.menge} ${p.einheit}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${fc(p.preis)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${p.mwst}%</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-weight:600">${fc(p.menge * p.preis)}</td>
    </tr>`).join("");

  const nettoVR = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = nettoVR * (rechnung.rabatt || 0) / 100;
  const nettoNR = nettoVR - rabattB;
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
        <div style="font-size:17px;font-weight:700">${firma.name}</div>
        <div style="font-size:11px;color:#666">${firma.inhaber ? firma.inhaber + " · " : ""}${firma.strasse}<br>${firma.plz} ${firma.ort}</div>
        ${firma.telefon ? `<div style="font-size:11px;color:#666">Tel: ${firma.telefon}</div>` : ""}
        ${firma.email ? `<div style="font-size:11px;color:#666">${firma.email}</div>` : ""}
      </div>
      <div style="text-align:right">
        <div style="font-size:24px;font-weight:800;color:#4f46e5;text-transform:uppercase">${rechnung.typ === "angebot" ? "Angebot" : "Rechnung"}</div>
        <div style="font-size:12px;color:#666;margin-top:4px">Nr. ${rechnung.nummer}</div>
        <div style="font-size:12px;color:#666">Datum: ${fd(rechnung.datum)}</div>
        ${rechnung.faelligDatum ? `<div style="font-size:12px;color:#666">Fällig: ${fd(rechnung.faelligDatum)}</div>` : ""}
        ${rechnung.zeitraumVon && rechnung.zeitraumBis ? `<div style="font-size:11px;color:#666;margin-top:4px">Leistungszeitraum: ${fd(rechnung.zeitraumVon)} – ${fd(rechnung.zeitraumBis)}</div>` : ""}
      </div>
    </div>

    <div style="background:#f8f9fa;border-radius:6px;padding:14px;margin-bottom:24px">
      <div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">${rechnung.typ === "angebot" ? "Angebot an" : "Rechnungsempfänger"}</div>
      <div style="font-weight:600">${rechnung.kundeName}</div>
      <div style="font-size:12px;color:#666">${rechnung.kundeAdresse}</div>
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

    ${rechnung.notiz ? `<div style="margin-top:18px;padding:10px;background:#f8f9fa;border-radius:5px;font-size:11px;color:#666"><strong>Hinweis:</strong> ${rechnung.notiz}</div>` : ""}

    <div style="margin-top:28px;padding-top:14px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#999">
      <span>${firma.bankName ? firma.bankName + " · " : ""}${firma.iban ? "IBAN: " + firma.iban : ""}</span>
      <span>${firma.steuernr ? "St.Nr: " + firma.steuernr : ""}${firma.ustid ? " · USt-ID: " + firma.ustid : ""}</span>
    </div>
  </body></html>`;
}

function downloadPdf(rechnung, firma) {
  const html = generatePdfHtml(rechnung, firma);
  const win = window.open("", "_blank", "width=800,height=1000");
  if (!win) { alert("Bitte Pop-ups erlauben für den PDF-Download"); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => { win.print(); }, 500);
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
export default function App() {
  const [pg, setPg] = useState("dashboard");
  const [firma, setFirma] = useState(null);
  const [kunden, setKunden] = useState([]);
  const [rechnungen, setRechnungen] = useState([]);
  const [plan, setPlan] = useState("free");
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobNav, setMobNav] = useState(false);

  useEffect(() => {
    (async () => {
      const [f, k, r, p, ob] = await Promise.all([ld("inv-firma", null), ld("inv-kunden", []), ld("inv-rechnungen", []), ld("inv-plan", "free"), ld("inv-onboarded", false)]);
      setFirma(f); setKunden(k); setRechnungen(r); setPlan(p); setLoaded(true);
      if (!ob || !f) setPg("onboarding");
    })();
  }, []);

  const sf = async f => { setFirma(f); await sv("inv-firma", f); showT("Gespeichert!"); };
  const skn = async k => { setKunden(k); await sv("inv-kunden", k); };
  const sre = async r => { setRechnungen(r); await sv("inv-rechnungen", r); };
  const spl = async p => { setPlan(p); await sv("inv-plan", p); showT(`Plan: ${p.toUpperCase()}`); };
  const showT = m => { setToast(m); setTimeout(() => setToast(null), 2800); };

  const addRe = async r => { await sre([...rechnungen, r]); showT("Erstellt!"); };
  const updRe = async (rid, up) => { await sre(rechnungen.map(r => r.id === rid ? { ...r, ...up } : r)); };
  const addKu = async k => { const ex = kunden.find(x => x.name === k.name && x.strasse === k.strasse); if (ex) return ex; const nk = { ...k, id: uid() }; await skn([...kunden, nk]); return nk; };
  const dupRe = async o => { const nr = nxtNr(); const d = new Date().toISOString().split("T")[0]; const fdt = new Date(); fdt.setDate(fdt.getDate() + (o.zahlungsziel || 14)); await addRe({ ...o, id: uid(), nummer: nr, datum: d, faelligDatum: fdt.toISOString().split("T")[0], status: "offen" }); };
  const nxtNr = () => { const y = new Date().getFullYear(); return `RE-${y}-${String(rechnungen.filter(r => r.nummer?.startsWith(`RE-${y}`)).length + 1).padStart(4, "0")}`; };
  const lim = { free: { re: 5, ku: 3 }, starter: { re: 50, ku: 25 }, pro: { re: 500, ku: 999 }, enterprise: { re: 99999, ku: 99999 } }[plan] || { re: 5, ku: 3 };
  const nav = p => { setPg(p); setMobNav(false); };

  const completeOnboarding = async (firmaData) => {
    await sf(firmaData);
    await sv("inv-onboarded", true);
    setPg("dashboard");
    showT("Willkommen bei RechnungsKI!");
  };

  if (!loaded) return <div className="load-wrap"><div className="spinner" /><p style={{ color: "#64748b", fontSize: 13, marginTop: 12 }}>Laden...</p></div>;

  // Show onboarding fullscreen
  if (pg === "onboarding") return <div className="app-wrap"><style>{CSS}</style><OnboardingWizard onComplete={completeOnboarding} /></div>;

  const navItems = [
    { id: "dashboard", icon: IC.dash, l: "Dashboard" }, { id: "neue-rechnung", icon: IC.doc, l: "Neue Rechnung" },
    { id: "rechnungen", icon: IC.euro, l: "Rechnungen" }, { id: "kunden", icon: IC.users, l: "Kunden" },
    { id: "abo", icon: IC.crown, l: "Abo & Preise" }, { id: "supabase", icon: IC.db, l: "Backend" },
    { id: "settings", icon: IC.gear, l: "Einstellungen" },
  ];

  return (
    <div className="app-wrap">
      <style>{CSS}</style>
      <div className="mob-header"><button className="mob-menu-btn" onClick={() => setMobNav(!mobNav)}>{mobNav ? IC.x : IC.menu}</button><span style={{ fontWeight: 700, fontSize: 16 }}>RechnungsKI</span><span style={{ fontSize: 10, fontWeight: 700, color: "#818cf8" }}>{plan.toUpperCase()}</span></div>
      <nav className={`sidebar ${mobNav ? "open" : ""}`}>
        <div className="brand"><div className="brand-ico">{IC.star}</div><div><div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-.02em" }}>RechnungsKI</div><div style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", textTransform: "uppercase" }}>{plan}</div></div></div>
        <div className="nav-list">{navItems.map(n => <button key={n.id} onClick={() => nav(n.id)} className={`nav-btn ${pg === n.id ? "active" : ""}`}><span style={{ opacity: pg === n.id ? 1 : .5, display: "flex" }}>{n.icon}</span><span>{n.l}</span>{n.id === "rechnungen" && rechnungen.filter(r => r.status === "offen").length > 0 && <span className="nav-badge">{rechnungen.filter(r => r.status === "offen").length}</span>}</button>)}</div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12 }}><div className="usage-bar"><div className="usage-fill" style={{ width: `${Math.min(rechnungen.length / lim.re * 100, 100)}%` }} /></div><span style={{ fontSize: 10, color: "#475569", padding: "0 8px", display: "block", marginTop: 4 }}>{rechnungen.length}/{lim.re === 99999 ? "∞" : lim.re}</span></div>
      </nav>
      <main className="main-content">
        {pg === "dashboard" && <Dashboard {...{ rechnungen, kunden, firma, nav, updRe, plan, lim }} />}
        {pg === "neue-rechnung" && <NeueRechnung {...{ firma, kunden, addKu, addRe, nextNr: nxtNr(), nav, plan, lim, canCreate: rechnungen.length < lim.re }} />}
        {pg === "rechnungen" && <RechnungenListe {...{ rechnungen, updRe, nav, dupRe, firma }} />}
        {pg === "kunden" && <KundenListe {...{ kunden, rechnungen }} />}
        {pg === "abo" && <AboPage {...{ plan, spl }} />}
        {pg === "supabase" && <SupabasePage />}
        {pg === "settings" && <SettingsPage {...{ firma, sf, rechnungen, kunden, sre, skn }} />}
      </main>
      {toast && <div className="toast"><span style={{ color: "#34d399", display: "flex" }}>{IC.check}</span>{toast}</div>}
      {mobNav && <div className="mob-overlay" onClick={() => setMobNav(false)} />}
    </div>
  );
}

// ═══ ONBOARDING WIZARD ═══
function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0); // 0=welcome, 1=branche, 2=firma, 3=steuer, 4=bank, 5=logo, 6=fertig
  const [brancheKat, setBrancheKat] = useState("");
  const [form, setForm] = useState({ name: "", inhaber: "", strasse: "", plz: "", ort: "", telefon: "", email: "", web: "", steuernr: "", ustid: "", bankName: "", iban: "", bic: "", gewerk: "", logo: "" });
  const fRef = useRef();
  const handleLogo = e => { const f = e.target.files[0]; if (!f) return; if (f.size > 500000) return; const r = new FileReader(); r.onload = ev => setForm({ ...form, logo: ev.target.result }); r.readAsDataURL(f); };

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

  return (
    <div className="onboard-wrap">
      {/* Progress */}
      <div className="onboard-progress"><div className="onboard-progress-fill" style={{ width: `${progress}%` }} /></div>

      {/* Step indicators */}
      <div className="onboard-steps">
        {steps.map((s, i) => (
          <div key={i} className={`onboard-step-dot ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}>
            {i < step ? <span style={{ display: "flex" }}>{IC.check}</span> : <span style={{ fontSize: 14 }}>{s.icon}</span>}
          </div>
        ))}
      </div>

      <div className="onboard-card">
        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div className="onboard-center">
            <div style={{ fontSize: 52, marginBottom: 16 }}>👋</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginBottom: 8 }}>Willkommen bei RechnungsKI</h1>
            <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 440, lineHeight: 1.7, marginBottom: 8 }}>
              In 2 Minuten bist du startklar. Wir richten alles für dich ein – danach kannst du sofort deine erste Rechnung erstellen.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20, fontSize: 14 }}>
              {["Branche wählen – KI-Vorschläge passend für dich", "Firmendaten eingeben – erscheinen auf jeder Rechnung", "Steuern & Bank – für §14-konforme Rechnungen", "Logo hochladen – dein Branding auf jedem Dokument"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#818cf8", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: "#94a3b8" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Branche */}
        {step === 1 && (
          <div>
            <h2 className="onboard-title">Was ist deine Branche?</h2>
            <p className="onboard-desc">Wir passen die KI-Vorschläge, Einheiten und Preise an dein Geschäft an.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Object.entries(BRANCHEN_KATEGORIEN).map(([kat, branchen]) => (
                <div key={kat}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6, paddingLeft: 2 }}>{kat}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {branchen.map(b => (
                      <button key={b} onClick={() => { setForm({ ...form, gewerk: b }); setBrancheKat(kat); }}
                        style={{ padding: "8px 14px", borderRadius: 8, border: form.gewerk === b ? "2px solid #6366f1" : "1px solid #1e293b", background: form.gewerk === b ? "#1e1b4b" : "#111827", color: form.gewerk === b ? "#a5b4fc" : "#94a3b8", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .15s" }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Firmendaten */}
        {step === 2 && (
          <div>
            <h2 className="onboard-title">Deine Firmendaten</h2>
            <p className="onboard-desc">Diese Daten erscheinen auf jeder Rechnung. Du kannst sie später jederzeit ändern.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label className="onboard-lbl">Firmenname *</label><input className="inp" placeholder="z.B. Müller Webdesign" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div style={{ flex: 1 }}><label className="onboard-lbl">Inhaber</label><input className="inp" placeholder="Max Müller" value={form.inhaber} onChange={e => setForm({ ...form, inhaber: e.target.value })} /></div>
              </div>
              <div><label className="onboard-lbl">Straße + Nr.</label><input className="inp" placeholder="Musterstraße 42" value={form.strasse} onChange={e => setForm({ ...form, strasse: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 110 }}><label className="onboard-lbl">PLZ</label><input className="inp" placeholder="70173" value={form.plz} onChange={e => setForm({ ...form, plz: e.target.value })} /></div>
                <div style={{ flex: 1 }}><label className="onboard-lbl">Ort</label><input className="inp" placeholder="Stuttgart" value={form.ort} onChange={e => setForm({ ...form, ort: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}><label className="onboard-lbl">Telefon</label><input className="inp" placeholder="0711 123456" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} /></div>
                <div style={{ flex: 1 }}><label className="onboard-lbl">E-Mail</label><input className="inp" placeholder="info@firma.de" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Steuer */}
        {step === 3 && (
          <div>
            <h2 className="onboard-title">Steuerdaten</h2>
            <p className="onboard-desc">Mindestens eins davon ist Pflicht nach §14 UStG. Ohne wird deine Rechnung nicht rechtskonform sein.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
              <div><label className="onboard-lbl">Steuernummer</label><input className="inp" placeholder="12/345/67890" value={form.steuernr} onChange={e => setForm({ ...form, steuernr: e.target.value })} /></div>
              <div style={{ textAlign: "center", color: "#475569", fontSize: 12 }}>– oder –</div>
              <div><label className="onboard-lbl">USt-IdNr.</label><input className="inp" placeholder="DE123456789" value={form.ustid} onChange={e => setForm({ ...form, ustid: e.target.value })} /></div>
            </div>
            {!form.steuernr && !form.ustid && <div style={{ marginTop: 14, padding: 12, background: "#1c1917", borderRadius: 8, border: "1px solid #92400e", fontSize: 12, color: "#fbbf24" }}>{IC.shield} Du kannst diesen Schritt überspringen, aber deine Rechnungen werden ohne Steuernr./USt-ID nicht §14-konform sein.</div>}
          </div>
        )}

        {/* STEP 4: Bank */}
        {step === 4 && (
          <div>
            <h2 className="onboard-title">Bankverbindung</h2>
            <p className="onboard-desc">Damit deine Kunden wissen, wohin sie überweisen sollen. Erscheint im Footer jeder Rechnung.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 480 }}>
              <div><label className="onboard-lbl">Bank</label><input className="inp" placeholder="Sparkasse Stuttgart" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} /></div>
              <div><label className="onboard-lbl">IBAN</label><input className="inp" placeholder="DE89 3704 0044 0532 0130 00" value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} /></div>
              <div><label className="onboard-lbl">BIC (optional)</label><input className="inp" placeholder="COBADEFFXXX" value={form.bic} onChange={e => setForm({ ...form, bic: e.target.value })} /></div>
            </div>
          </div>
        )}

        {/* STEP 5: Logo */}
        {step === 5 && (
          <div>
            <h2 className="onboard-title">Dein Firmenlogo</h2>
            <p className="onboard-desc">Optional – aber es macht deine Rechnungen sofort professioneller. PNG oder JPG, max 500 KB.</p>
            <div className="onboard-center" style={{ marginTop: 20 }}>
              {form.logo ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={form.logo} alt="" style={{ maxHeight: 80, maxWidth: 240, borderRadius: 10, border: "2px solid #334155", background: "#fff", padding: 8, objectFit: "contain" }} />
                  <button className="i-btn" style={{ position: "absolute", top: -8, right: -8, background: "#1e293b", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #334155" }} onClick={() => setForm({ ...form, logo: "" })}>✕</button>
                </div>
              ) : (
                <div onClick={() => fRef.current?.click()} style={{ width: 200, height: 100, borderRadius: 12, border: "3px dashed #334155", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 8, color: "#64748b", transition: "border-color .2s" }}>
                  <span style={{ fontSize: 28 }}>📷</span>
                  <span style={{ fontSize: 13 }}>Klicken zum Hochladen</span>
                </div>
              )}
              <input ref={fRef} type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={handleLogo} />
              {!form.logo && <p style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>Du kannst diesen Schritt überspringen und das Logo später hinzufügen.</p>}
            </div>
          </div>
        )}

        {/* STEP 6: Fertig */}
        {step === 6 && (
          <div className="onboard-center">
            <div style={{ fontSize: 52, marginBottom: 12 }}>🚀</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 8 }}>Alles eingerichtet!</h2>
            <p style={{ fontSize: 15, color: "#94a3b8", maxWidth: 400, lineHeight: 1.7, marginBottom: 20 }}>
              Dein Profil ist fertig. Du kannst jetzt sofort deine erste Rechnung erstellen.
            </p>
            <div style={{ background: "#111827", borderRadius: 12, padding: 20, border: "1px solid #1e293b", maxWidth: 360, width: "100%", textAlign: "left" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                {form.logo && <img src={form.logo} alt="" style={{ maxHeight: 36, maxWidth: 100, objectFit: "contain", borderRadius: 4 }} />}
                <div><div style={{ fontWeight: 700, fontSize: 15 }}>{form.name}</div><div style={{ fontSize: 12, color: "#818cf8" }}>{form.gewerk}</div></div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{form.strasse && `${form.strasse}, `}{form.plz} {form.ort}</div>
              {form.email && <div style={{ fontSize: 12, color: "#64748b" }}>{form.email}</div>}
              {(form.steuernr || form.ustid) && <div style={{ fontSize: 11, color: "#34d399", marginTop: 6 }}>{IC.check} §14 UStG konform</div>}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="onboard-nav">
        {step > 0 && step < 6 && <button className="s-btn" onClick={() => setStep(step - 1)}>← Zurück</button>}
        <div style={{ flex: 1 }} />
        {step < 6 ? (
          <button className="p-btn" onClick={() => setStep(step + 1)} style={{ opacity: step > 0 && !canNext() ? .4 : 1 }} disabled={step > 0 && !canNext()}>
            {step === 0 ? "Los geht's →" : step === 5 ? (form.logo ? "Weiter →" : "Überspringen →") : "Weiter →"}
          </button>
        ) : (
          <button className="p-btn" style={{ fontSize: 15, padding: "10px 28px" }} onClick={() => onComplete(form)}>
            Erste Rechnung erstellen →
          </button>
        )}
      </div>
    </div>
  );
}

// ═══ DASHBOARD ═══
function Dashboard({ rechnungen, kunden, firma, nav, updRe, plan, lim }) {
  const paid = rechnungen.filter(r => r.status === "bezahlt");
  const offen = rechnungen.filter(r => r.status === "offen");
  const ueber = offen.filter(r => new Date(r.faelligDatum) < new Date());
  const fE = validateFirma(firma);
  const months = []; for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); months.push({ l: d.toLocaleDateString("de-DE", { month: "short" }), s: paid.filter(r => { const rd = new Date(r.datum); return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear(); }).reduce((s, r) => s + r.gesamt, 0), k: `${d.getFullYear()}-${d.getMonth()}` }); }
  const mx = Math.max(...months.map(m => m.s), 1);

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="h1">Dashboard</h1><p className="sub">{firma ? `Willkommen, ${firma.inhaber || firma.name}` : "Firmendaten einrichten"}</p></div><button className="p-btn" onClick={() => nav("neue-rechnung")}>{IC.plus} Neue Rechnung</button></div>
      {fE.length > 0 && <div className="warn-bar"><span style={{ display: "flex", color: "#f87171" }}>{IC.shield}</span><div><strong>§14 UStG:</strong> {fE.join(", ")} fehlt. <button className="link-btn" onClick={() => nav("settings")}>Beheben →</button></div></div>}
      {plan === "free" && <div className="upgrade-bar">{IC.crown}<span><strong>Free</strong> – {lim.re} Rechnungen</span><button className="upgrade-sm" onClick={() => nav("abo")}>Upgraden</button></div>}
      <div className="kpi-grid">{[{ l: "Umsatz", v: fc(paid.reduce((s, r) => s + r.gesamt, 0)), s: `${paid.length} bezahlt`, c: "#34d399" }, { l: "Offen", v: fc(offen.reduce((s, r) => s + r.gesamt, 0)), s: `${offen.length} offen`, c: "#fbbf24" }, { l: "Überfällig", v: ueber.length, s: ueber.length ? "Mahnen!" : "Alles gut", c: "#f87171" }, { l: "Kunden", v: kunden.length, c: "#818cf8", s: "gespeichert" }].map((k, i) => <div key={i} className="kpi" style={{ borderLeft: `4px solid ${k.c}` }}><div className="kpi-l">{k.l}</div><div className="kpi-v" style={k.l === "Überfällig" && ueber.length > 0 ? { color: "#f87171" } : {}}>{k.v}</div><div className="kpi-s">{k.s}</div></div>)}</div>
      <div className="dash-grid">
        <div className="card"><h3 className="card-t">Umsatz (6 Monate)</h3><div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>{months.map(m => <div key={m.k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ width: "100%", height: 100, display: "flex", alignItems: "flex-end" }}><div className="chart-bar" style={{ height: `${Math.max(m.s / mx * 100, 3)}%` }} /></div><span style={{ fontSize: 10, color: "#64748b" }}>{m.l}</span></div>)}</div></div>
        <div className="card"><h3 className="card-t">Letzte Rechnungen</h3>{rechnungen.length === 0 ? <p className="sub">Keine.</p> : [...rechnungen].reverse().slice(0, 5).map(r => <div key={r.id} className="recent-item"><div><div style={{ fontWeight: 600, fontSize: 13 }}>{r.kundeName}</div><div className="sub">{r.nummer}</div></div><div style={{ textAlign: "right" }}><div style={{ fontWeight: 600, fontSize: 13 }}>{fc(r.gesamt)}</div><SB s={r.status} /></div></div>)}</div>
      </div>
      {ueber.length > 0 && <div className="warn-card"><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontWeight: 600 }}><span style={{ color: "#f87171", display: "flex" }}>{IC.alert}</span>Überfällig</div>{ueber.map(r => <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 12, flexWrap: "wrap", borderBottom: "1px solid #33251a" }}><span style={{ fontWeight: 600 }}>{r.nummer}</span><span>{r.kundeName}</span><span style={{ fontWeight: 600 }}>{fc(r.gesamt)}</span><button className="s-btn" onClick={() => updRe(r.id, { status: "gemahnt" })}>Mahnen</button></div>)}</div>}
    </div>
  );
}

function SB({ s }) { const m = { offen: { b: "#fef3c7", c: "#92400e", l: "Offen" }, bezahlt: { b: "#d1fae5", c: "#065f46", l: "Bezahlt" }, gemahnt: { b: "#fee2e2", c: "#991b1b", l: "Gemahnt" }, storniert: { b: "#e5e7eb", c: "#374151", l: "Storniert" }, angebot: { b: "#e0e7ff", c: "#3730a3", l: "Angebot" } }; const v = m[s] || m.offen; return <span className="status-badge" style={{ background: v.b, color: v.c }}>{v.l}</span>; }

// ═══ NEUE RECHNUNG (compact – same logic as v3) ═══
function NeueRechnung({ firma, kunden, addKu, addRe, nextNr, nav, plan, lim, canCreate }) {
  const [gw, setGw] = useState(firma?.gewerk || ""); const [kS, setKS] = useState(""); const [selK, setSelK] = useState(null);
  const [neuK, setNeuK] = useState({ name: "", strasse: "", plz: "", ort: "", email: "" }); const [showN, setShowN] = useState(false);
  const [pos, setPos] = useState([]); const [ziel, setZiel] = useState(14); const [notiz, setNotiz] = useState("");
  const [showV, setShowV] = useState(false); const [saving, setSaving] = useState(false);
  const [rabatt, setRabatt] = useState(0); const [typ, setTyp] = useState("rechnung");
  const [zvon, setZvon] = useState(""); const [zbis, setZbis] = useState(""); const [valE, setValE] = useState([]);

  const fK = kunden.filter(k => k.name.toLowerCase().includes(kS.toLowerCase()));
  const addP = p => setPos([...pos, { ...p, id: uid(), menge: p.menge || 1, mwst: 19, typ: p.typ || "arbeit" }]);
  const updP = (pid, f, v) => setPos(pos.map(p => p.id === pid ? { ...p, [f]: v } : p));
  const rmP = pid => setPos(pos.filter(p => p.id !== pid));
  const netto = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = netto * rabatt / 100; const nettoNR = netto - rabattB;
  const mwstB = pos.reduce((s, p) => s + p.menge * p.preis * (1 - rabatt / 100) * p.mwst / 100, 0);
  const brutto = nettoNR + mwstB;
  const arbS = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const matS = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);

  const doSave = async () => {
    if (!canCreate) { nav("abo"); return; }
    let kunde = selK; if (showN && neuK.name) kunde = await addKu(neuK); if (!kunde) return;
    const d = new Date().toISOString().split("T")[0]; const fdt = new Date(); fdt.setDate(fdt.getDate() + ziel);
    const re = { id: uid(), nummer: nextNr, typ, datum: d, faelligDatum: fdt.toISOString().split("T")[0], kundeId: kunde.id, kundeName: kunde.name, kundeAdresse: `${kunde.strasse}, ${kunde.plz} ${kunde.ort}`, kundeEmail: kunde.email || "", positionen: pos, netto: nettoNR, mwst: mwstB, gesamt: brutto, zahlungsziel: ziel, notiz, status: typ === "angebot" ? "angebot" : "offen", gewerk: gw, rabatt, zeitraumVon: zvon, zeitraumBis: zbis };
    const errs = validateRechnung(re, firma); if (errs.length > 0) { setValE(errs); return; }
    setSaving(true); await addRe(re); setSaving(false); nav("rechnungen");
  };

  if (!firma) return <div className="page"><div className="empty"><div className="empty-ico">{IC.gear}</div><h2>Firmendaten fehlen</h2><button className="p-btn" style={{ marginTop: 14 }} onClick={() => nav("settings")}>Einstellungen</button></div></div>;

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="h1">{typ === "angebot" ? "Neues Angebot" : "Neue Rechnung"}</h1><p className="sub">Nr. {nextNr}</p></div>
        <div className="toggle-wrap"><button className={`tog-btn ${typ === "rechnung" ? "active" : ""}`} onClick={() => setTyp("rechnung")}>Rechnung</button><button className={`tog-btn ${typ === "angebot" ? "active" : ""}`} onClick={() => setTyp("angebot")}>Angebot</button></div>
      </div>
      {valE.length > 0 && <div className="warn-bar">{IC.alert}<div><strong>Fehler:</strong> {valE.join(", ")}</div></div>}
      <div className="form-grid">
        <div className="form-left">
          <div className="sec"><label className="lbl">Branche</label><select className="sel" value={gw} onChange={e => { setGw(e.target.value); setShowV(false); }}><option value="">–</option>{Object.entries(BRANCHEN_KATEGORIEN).map(([kat, branchen]) => <optgroup key={kat} label={kat}>{branchen.map(b => <option key={b} value={b}>{b}</option>)}</optgroup>)}</select></div>
          <div className="sec"><label className="lbl">Leistungszeitraum</label><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="date" className="inp" style={{ flex: 1 }} value={zvon} onChange={e => setZvon(e.target.value)} /><span className="sub">bis</span><input type="date" className="inp" style={{ flex: 1 }} value={zbis} onChange={e => setZbis(e.target.value)} /></div></div>
          <div className="sec"><label className="lbl">Kunde</label>
            {!showN ? <><div style={{ position: "relative" }}><span className="search-ico">{IC.search}</span><input className="inp search-inp" placeholder="Suchen..." value={kS} onChange={e => setKS(e.target.value)} /></div>
              {kS && fK.length > 0 && !selK && <div className="dd">{fK.map(k => <button key={k.id} className="dd-item" onClick={() => { setSelK(k); setKS(""); }}><strong>{k.name}</strong><span style={{ fontSize: 11, opacity: .6 }}>{k.plz} {k.ort}</span></button>)}</div>}
              {selK && <div className="sel-kunde"><div><strong>{selK.name}</strong><br /><span className="sub">{selK.strasse}, {selK.plz} {selK.ort}</span></div><button className="i-btn" onClick={() => setSelK(null)}>✕</button></div>}
              <button className="link-btn" onClick={() => setShowN(true)}>+ Neuer Kunde</button>
            </> : <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              <input className="inp" placeholder="Name *" value={neuK.name} onChange={e => setNeuK({ ...neuK, name: e.target.value })} />
              <input className="inp" placeholder="Straße" value={neuK.strasse} onChange={e => setNeuK({ ...neuK, strasse: e.target.value })} />
              <div style={{ display: "flex", gap: 6 }}><input className="inp" style={{ width: 90 }} placeholder="PLZ" value={neuK.plz} onChange={e => setNeuK({ ...neuK, plz: e.target.value })} /><input className="inp" style={{ flex: 1 }} placeholder="Ort" value={neuK.ort} onChange={e => setNeuK({ ...neuK, ort: e.target.value })} /></div>
              <input className="inp" placeholder="E-Mail" value={neuK.email} onChange={e => setNeuK({ ...neuK, email: e.target.value })} />
              <button className="link-btn" onClick={() => { setShowN(false); setNeuK({ name: "", strasse: "", plz: "", ort: "", email: "" }); }}>← Zurück</button>
            </div>}
          </div>
          <div className="sec">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
              <label className="lbl" style={{ marginBottom: 0 }}>Positionen</label>
              <div style={{ display: "flex", gap: 6 }}>{pos.length > 0 && <div style={{ fontSize: 10, color: "#64748b", display: "flex", gap: 8 }}><span>Arb: {fc(arbS)}</span><span>Mat: {fc(matS)}</span></div>}{gw && <button className="ai-btn" onClick={() => setShowV(!showV)}>{IC.star} KI</button>}</div>
            </div>
            {showV && gw && <div className="vor-wrap"><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{(GV[gw] || []).map((v, i) => <button key={i} className="vor-chip" onClick={() => addP(v)}><span style={{ fontSize: 12 }}>{v.beschreibung}</span><span style={{ opacity: .5, fontSize: 10 }}>{fc(v.preis)}/{v.einheit}</span></button>)}</div></div>}
            {pos.length > 0 && <div className="pos-table"><div className="pos-h"><span style={{ flex: 2.5 }}>Beschr.</span><span style={{ flex: .6 }}>Typ</span><span style={{ flex: .6 }}>Menge</span><span style={{ flex: .6 }}>Einh.</span><span style={{ flex: .7, textAlign: "right" }}>Preis</span><span style={{ flex: .5 }}>MwSt</span><span style={{ flex: .7, textAlign: "right" }}>Sum.</span><span style={{ width: 24 }} /></div>
              {pos.map(p => <div key={p.id} className="pos-r"><input className="pos-i" style={{ flex: 2.5 }} value={p.beschreibung} onChange={e => updP(p.id, "beschreibung", e.target.value)} /><select className="pos-i" style={{ flex: .6 }} value={p.typ} onChange={e => updP(p.id, "typ", e.target.value)}><option value="arbeit">Arb</option><option value="material">Mat</option></select><input className="pos-i" style={{ flex: .6, textAlign: "center" }} type="number" min=".01" step=".01" value={p.menge} onChange={e => updP(p.id, "menge", parseFloat(e.target.value) || 0)} /><input className="pos-i" style={{ flex: .6, textAlign: "center" }} value={p.einheit} onChange={e => updP(p.id, "einheit", e.target.value)} /><input className="pos-i" style={{ flex: .7, textAlign: "right" }} type="number" min="0" step=".01" value={p.preis} onChange={e => updP(p.id, "preis", parseFloat(e.target.value) || 0)} /><select className="pos-i" style={{ flex: .5 }} value={p.mwst} onChange={e => updP(p.id, "mwst", parseInt(e.target.value))}><option value={19}>19</option><option value={7}>7</option><option value={0}>0</option></select><span style={{ flex: .7, textAlign: "right", fontWeight: 600, fontSize: 11 }}>{fc(p.menge * p.preis)}</span><button className="i-btn" onClick={() => rmP(p.id)}>{IC.trash}</button></div>)}
            </div>}
            <button className="add-pos" onClick={() => addP({ beschreibung: "", einheit: "Stk", preis: 0, typ: "arbeit" })}>{IC.plus} Position</button>
          </div>
          <div className="sec"><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><div style={{ width: 90 }}><label className="lbl">Rabatt %</label><input className="inp" type="number" min="0" max="100" value={rabatt} onChange={e => setRabatt(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))} /></div><div style={{ flex: 1, minWidth: 180 }}><label className="lbl">Notiz</label><input className="inp" placeholder="..." value={notiz} onChange={e => setNotiz(e.target.value)} /></div></div></div>
        </div>
        <div className="form-right">
          <div className="sum-card">
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Zusammenfassung</h3>
            <div className="sum-r"><span>Nr.</span><span style={{ fontFamily: "'JetBrains Mono',mono", fontSize: 11 }}>{nextNr}</span></div>
            <div className="sum-r"><span>Ziel</span><select className="sel" style={{ width: "auto", padding: "2px 6px", fontSize: 11 }} value={ziel} onChange={e => setZiel(parseInt(e.target.value))}><option value={7}>7d</option><option value={14}>14d</option><option value={30}>30d</option></select></div>
            <div style={{ borderTop: "1px solid #1e293b", margin: "8px 0" }} />
            {arbS > 0 && <div className="sum-r" style={{ fontSize: 11 }}><span>Arbeit</span><span>{fc(arbS)}</span></div>}
            {matS > 0 && <div className="sum-r" style={{ fontSize: 11 }}><span>Material</span><span>{fc(matS)}</span></div>}
            <div className="sum-r"><span>Netto</span><span>{fc(netto)}</span></div>
            {rabatt > 0 && <div className="sum-r" style={{ color: "#f87171" }}><span>-{rabatt}%</span><span>-{fc(rabattB)}</span></div>}
            <div className="sum-r"><span>MwSt</span><span>{fc(mwstB)}</span></div>
            <div className="sum-r sum-total"><span>Brutto</span><span>{fc(brutto)}</span></div>
            <button className="p-btn" style={{ width: "100%", justifyContent: "center", marginTop: 12, opacity: (pos.length === 0 || (!selK && !neuK.name)) ? .4 : 1 }} disabled={pos.length === 0 || (!selK && !neuK.name) || saving} onClick={doSave}>{saving ? "..." : "Erstellen"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ RECHNUNGEN MIT PDF ═══
function RechnungenListe({ rechnungen, updRe, nav, dupRe, firma }) {
  const [filter, setFilter] = useState("alle"); const [search, setSearch] = useState("");
  const [mahnM, setMahnM] = useState(null); const [mahnS, setMahnS] = useState(1);
  const fl = rechnungen.filter(r => filter === "alle" || r.status === filter).filter(r => r.kundeName?.toLowerCase().includes(search.toLowerCase()) || r.nummer?.includes(search)).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const exportDatev = () => { const csv = datevCSV(rechnungen, firma); const b = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `DATEV_${new Date().toISOString().split("T")[0]}.csv`; a.click(); };

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="h1">Rechnungen</h1><p className="sub">{rechnungen.length} insgesamt</p></div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><button className="s-btn" onClick={exportDatev}>{IC.dl} DATEV</button><button className="p-btn" onClick={() => nav("neue-rechnung")}>{IC.plus} Neu</button></div></div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}><div style={{ position: "relative", flex: 1, minWidth: 160 }}><span className="search-ico">{IC.search}</span><input className="inp search-inp" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="tabs">{["alle", "offen", "bezahlt", "gemahnt", "angebot"].map(f => <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}</div></div>
      {fl.length === 0 ? <div className="empty"><div className="empty-ico">{IC.doc}</div><h2>Keine Ergebnisse</h2></div> :
        <div className="tbl-wrap"><div className="tbl-h"><span style={{ flex: 1 }}>Nr.</span><span style={{ flex: 1.5 }}>Kunde</span><span style={{ flex: .7 }}>Datum</span><span style={{ flex: .8, textAlign: "right" }}>Betrag</span><span style={{ flex: .6, textAlign: "center" }}>Status</span><span style={{ flex: 2, textAlign: "right" }}>Aktionen</span></div>
          {fl.map(r => <div key={r.id} className="tbl-r">
            <span style={{ flex: 1, fontWeight: 600, fontFamily: "'JetBrains Mono',mono", fontSize: 11 }}>{r.nummer}</span>
            <span style={{ flex: 1.5, fontSize: 13 }}>{r.kundeName}</span>
            <span style={{ flex: .7, opacity: .6, fontSize: 12 }}>{fd(r.datum)}</span>
            <span style={{ flex: .8, textAlign: "right", fontWeight: 600, fontSize: 13 }}>{fc(r.gesamt)}</span>
            <span style={{ flex: .6, textAlign: "center" }}><SB s={r.status} /></span>
            <span style={{ flex: 2, display: "flex", gap: 4, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {firma && <button className="s-btn pdf-btn" onClick={() => downloadPdf(r, firma)}>{IC.pdf} PDF</button>}
              {r.status === "offen" && <button className="s-btn-g" onClick={() => updRe(r.id, { status: "bezahlt" })}>{IC.check}</button>}
              {(r.status === "offen" || r.status === "gemahnt") && firma && <button className="s-btn" onClick={() => { setMahnM(r); setMahnS(r.status === "gemahnt" ? 2 : 1); }}>{IC.mail}</button>}
              {r.status === "angebot" && <button className="s-btn-g" onClick={() => updRe(r.id, { status: "offen", typ: "rechnung" })}>→RE</button>}
              <button className="s-btn" onClick={() => dupRe(r)}>{IC.copy}</button>
            </span>
          </div>)}</div>}

      {mahnM && firma && <div className="modal-overlay" onClick={() => setMahnM(null)}><div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}><div style={{ padding: 24 }}><h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#111" }}>Zahlungserinnerung</h2><div style={{ display: "flex", gap: 4, marginBottom: 12 }}>{[1, 2, 3].map(s => <button key={s} className={`tab ${mahnS === s ? "active" : ""}`} onClick={() => setMahnS(s)}>{s}. Mahnung</button>)}</div><textarea style={{ width: "100%", minHeight: 180, padding: 12, border: "1px solid #d1d5db", borderRadius: 7, fontSize: 12, fontFamily: "'DM Sans',sans-serif", color: "#111", resize: "vertical" }} value={mahnung(mahnM, firma, mahnS)} readOnly /><div style={{ display: "flex", gap: 6, marginTop: 12, justifyContent: "flex-end" }}><button className="p-btn" onClick={() => { navigator.clipboard.writeText(mahnung(mahnM, firma, mahnS)); setMahnM(null); updRe(mahnM.id, { status: "gemahnt" }); }}>Kopieren</button><button className="s-btn" onClick={() => setMahnM(null)}>Schließen</button></div></div></div></div>}
    </div>
  );
}

// ═══ KUNDEN ═══
function KundenListe({ kunden, rechnungen }) {
  const [search, setSearch] = useState("");
  const f = kunden.filter(k => k.name?.toLowerCase().includes(search.toLowerCase()));
  const st = kid => { const kr = rechnungen.filter(r => r.kundeId === kid); return { c: kr.length, u: kr.filter(r => r.status === "bezahlt").reduce((s, r) => s + r.gesamt, 0) }; };
  return (
    <div className="page"><div className="page-head"><div><h1 className="h1">Kunden</h1><p className="sub">{kunden.length}</p></div></div>
      <div style={{ position: "relative", maxWidth: 320, marginBottom: 16 }}><span className="search-ico">{IC.search}</span><input className="inp search-inp" placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      {f.length === 0 ? <div className="empty"><div className="empty-ico">{IC.users}</div><h2>Keine Kunden</h2></div> :
        <div className="kunden-grid">{f.map(k => { const s = st(k.id); return <div key={k.id} className="kunde-c"><div className="kunde-av">{k.name?.charAt(0)?.toUpperCase()}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{k.name}</div><div style={{ fontSize: 11, color: "#64748b" }}>{k.plz} {k.ort}</div></div><div style={{ fontSize: 11, textAlign: "right" }}><div>{s.c} RE</div><div>{fc(s.u)}</div></div></div>; })}</div>}
    </div>
  );
}

// ═══ ABO ═══
function AboPage({ plan, spl }) {
  const pls = [
    { id: "free", n: "Free", p: "0", feat: ["5 Rechnungen", "3 Kunden", "KI-Vorschläge"] },
    { id: "starter", n: "Starter", p: "9,99", feat: ["50 Rechnungen", "25 Kunden", "Logo", "Vorschau", "Angebote", "PDF-Export"], pop: true },
    { id: "pro", n: "Pro", p: "24,99", feat: ["500 Rechnungen", "Unbegr. Kunden", "Alles Starter", "Mahnwesen", "DATEV", "§14 Check"] },
    { id: "enterprise", n: "Enterprise", p: "49,99", feat: ["Unbegrenzt", "Multi-User", "API", "DATEV direkt", "PDF-Versand"] },
  ];
  return (
    <div className="page"><div style={{ textAlign: "center", marginBottom: 28 }}><h1 className="h1" style={{ fontSize: 26, background: "linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Wähle deinen Plan</h1></div>
      <div className="plan-grid">{pls.map(p => <div key={p.id} className={`plan-card ${p.pop ? "popular" : ""}`}>{p.pop && <div className="pop-badge">BELIEBT</div>}<div style={{ fontSize: 12, fontWeight: 600, color: "#818cf8" }}>{p.n}</div><div style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "4px 0" }}><span style={{ fontSize: 30, fontWeight: 800 }}>{p.p}€</span><span style={{ fontSize: 11, color: "#64748b" }}>/Mo</span></div><div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, margin: "12px 0 16px" }}>{p.feat.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}><span style={{ color: "#34d399", display: "flex" }}>{IC.check}</span>{f}</div>)}</div><button className={plan === p.id ? "s-btn" : p.pop ? "p-btn" : "s-btn"} style={{ width: "100%", justifyContent: "center" }} disabled={plan === p.id} onClick={() => spl(p.id)}>{plan === p.id ? "Aktuell" : "Wählen"}</button></div>)}</div>
    </div>
  );
}

// ═══ SUPABASE SETUP PAGE ═══
function SupabasePage() {
  const [tab, setTab] = useState("intro");
  const [copied, setCopied] = useState("");
  const copyCode = (code, label) => { navigator.clipboard.writeText(code); setCopied(label); setTimeout(() => setCopied(""), 2000); };

  return (
    <div className="page">
      <div className="page-head"><div><h1 className="h1">Backend-Integration</h1><p className="sub">Supabase Setup für Produktion</p></div></div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        {[{ id: "intro", l: "Übersicht" }, { id: "sql", l: "1. SQL Schema" }, { id: "code", l: "2. JS Client" }, { id: "deploy", l: "3. Deployment" }].map(t => <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.l}</button>)}
      </div>

      {tab === "intro" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card"><h3 className="card-t">Warum Supabase?</h3><p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>Supabase ist eine Open-Source Firebase-Alternative mit PostgreSQL. Kostenloser Tier mit 500MB Storage, Auth, Realtime und Row Level Security – perfekt für RechnungsKI.</p></div>
          <div className="card"><h3 className="card-t">Was du bekommst</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
              {["Auth (Login/Register)", "PostgreSQL Datenbank", "Row Level Security", "Realtime Updates", "Auto-generierte API", "Cloud Hosting (DE möglich)", "Edge Functions", "50k monatl. Requests (free)"].map((f, i) => <div key={i} style={{ display: "flex", gap: 6, fontSize: 13, alignItems: "center" }}><span style={{ color: "#34d399", display: "flex" }}>{IC.check}</span>{f}</div>)}
            </div>
          </div>
          <div className="card"><h3 className="card-t">3 Schritte zur Produktion</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
              {["Account auf supabase.com erstellen (kostenlos)", "SQL Schema in SQL Editor einfügen", "Supabase JS Client in dein React-Projekt einbauen"].map((s, i) => <div key={i} style={{ display: "flex", gap: 10, fontSize: 13 }}><span style={{ color: "#818cf8", fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>{s}</div>)}
            </div>
          </div>
        </div>
      )}

      {tab === "sql" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 className="card-t" style={{ marginBottom: 0 }}>SQL Schema</h3>
            <button className={`s-btn ${copied === "sql" ? "copied" : ""}`} onClick={() => copyCode(SUPABASE_SQL_SCHEMA, "sql")}>{copied === "sql" ? "✓ Kopiert!" : "Kopieren"}</button>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Kopiere dieses SQL und füge es in den Supabase SQL Editor ein (Dashboard → SQL Editor → New Query).</p>
          <pre style={{ background: "#0b0d14", border: "1px solid #1e293b", borderRadius: 8, padding: 16, fontSize: 11, color: "#94a3b8", overflow: "auto", maxHeight: 500, lineHeight: 1.6, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap" }}>{SUPABASE_SQL_SCHEMA}</pre>
        </div>
      )}

      {tab === "code" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 className="card-t" style={{ marginBottom: 0 }}>JavaScript Client</h3>
            <button className={`s-btn ${copied === "js" ? "copied" : ""}`} onClick={() => copyCode(SUPABASE_JS_CODE, "js")}>{copied === "js" ? "✓ Kopiert!" : "Kopieren"}</button>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>Erstelle eine Datei <code style={{ background: "#1e293b", padding: "2px 6px", borderRadius: 4 }}>lib/supabase.js</code> mit diesem Code.</p>
          <pre style={{ background: "#0b0d14", border: "1px solid #1e293b", borderRadius: 8, padding: 16, fontSize: 11, color: "#94a3b8", overflow: "auto", maxHeight: 500, lineHeight: 1.6, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap" }}>{SUPABASE_JS_CODE}</pre>
        </div>
      )}

      {tab === "deploy" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card"><h3 className="card-t">Deployment-Checkliste</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              {[
                { title: "1. Supabase Projekt erstellen", desc: "supabase.com → New Project → Region: Frankfurt (eu-central-1)" },
                { title: "2. SQL ausführen", desc: "Dashboard → SQL Editor → Paste Schema → Run" },
                { title: "3. npm install", desc: "npm install " + _SB_PKG },
                { title: "4. Environment Vars", desc: "NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local" },
                { title: "5. Auth aktivieren", desc: "Dashboard → Auth → Email/Password aktivieren" },
                { title: "6. Storage ersetzen", desc: "window.storage Calls durch Supabase Client Calls ersetzen" },
                { title: "7. Vercel/Netlify Deploy", desc: "git push → automatisches Deployment" },
              ].map((s, i) => <div key={i} style={{ padding: 12, background: "#0b0d14", borderRadius: 8, border: "1px solid #1e293b" }}><div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{s.title}</div><div style={{ fontSize: 12, color: "#64748b" }}>{s.desc}</div></div>)}
            </div>
          </div>
          <div className="card"><h3 className="card-t">Kosten-Schätzung</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 8 }}>
              {[{ n: "Supabase Free", p: "0€/Mo", d: "Bis 50.000 Requests" }, { n: "Supabase Pro", p: "25$/Mo", d: "Ab 100.000 Requests" }, { n: "Vercel Hosting", p: "0-20$/Mo", d: "Gratis bis 100GB" }].map((c, i) => <div key={i} style={{ padding: 14, background: "#0b0d14", borderRadius: 8, border: "1px solid #1e293b", textAlign: "center" }}><div style={{ fontWeight: 600, fontSize: 13 }}>{c.n}</div><div style={{ fontSize: 22, fontWeight: 800, color: "#818cf8", margin: "4px 0" }}>{c.p}</div><div style={{ fontSize: 11, color: "#64748b" }}>{c.d}</div></div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ SETTINGS ═══
function SettingsPage({ firma, sf, rechnungen, kunden, sre, skn }) {
  const [form, setForm] = useState(firma || { name: "", inhaber: "", strasse: "", plz: "", ort: "", telefon: "", email: "", web: "", steuernr: "", ustid: "", bankName: "", iban: "", bic: "", gewerk: "", logo: "" });
  const [showR, setShowR] = useState(false); const fRef = useRef();
  const handleLogo = e => { const f = e.target.files[0]; if (!f) return; if (f.size > 500000) { alert("Max 500KB"); return; } const r = new FileReader(); r.onload = ev => setForm({ ...form, logo: ev.target.result }); r.readAsDataURL(f); };

  return (
    <div className="page"><div className="page-head"><div><h1 className="h1">Einstellungen</h1></div></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        <div className="sec"><h3 className="sec-title">Logo</h3><div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {form.logo ? <div style={{ position: "relative" }}><img src={form.logo} alt="" style={{ maxHeight: 50, maxWidth: 150, borderRadius: 6, border: "1px solid #334155", background: "#fff", padding: 2, objectFit: "contain" }} /><button className="i-btn" style={{ position: "absolute", top: -5, right: -5, background: "#1e293b", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #334155", fontSize: 10 }} onClick={() => setForm({ ...form, logo: "" })}>✕</button></div>
            : <div style={{ width: 90, height: 50, borderRadius: 6, border: "2px dashed #334155", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", cursor: "pointer" }} onClick={() => fRef.current?.click()}>{IC.img}</div>}
          <button className="s-btn" onClick={() => fRef.current?.click()}>{form.logo ? "Ändern" : "Hochladen"}</button><input ref={fRef} type="file" accept="image/png,image/jpeg" style={{ display: "none" }} onChange={handleLogo} /></div></div>
        <div className="sec"><h3 className="sec-title">Firmendaten</h3><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ display: "flex", gap: 7 }}><FI l="Firma *" v={form.name} k="name" f={form} s={setForm} /><FI l="Inhaber" v={form.inhaber} k="inhaber" f={form} s={setForm} /></div>
          <FI l="Straße *" v={form.strasse} k="strasse" f={form} s={setForm} />
          <div style={{ display: "flex", gap: 7 }}><FI l="PLZ *" v={form.plz} k="plz" f={form} s={setForm} w={100} /><FI l="Ort *" v={form.ort} k="ort" f={form} s={setForm} /></div>
          <div style={{ display: "flex", gap: 7 }}><FI l="Tel" v={form.telefon} k="telefon" f={form} s={setForm} /><FI l="E-Mail" v={form.email} k="email" f={form} s={setForm} /></div>
        </div></div>
        <div className="sec"><h3 className="sec-title">Steuern (§14 Pflicht)</h3><div style={{ display: "flex", gap: 7 }}><FI l="Steuernr." v={form.steuernr} k="steuernr" f={form} s={setForm} /><FI l="USt-ID" v={form.ustid} k="ustid" f={form} s={setForm} /></div></div>
        <div className="sec"><h3 className="sec-title">Bank</h3><div style={{ display: "flex", flexDirection: "column", gap: 7 }}><FI l="Bank" v={form.bankName} k="bankName" f={form} s={setForm} /><div style={{ display: "flex", gap: 7 }}><FI l="IBAN" v={form.iban} k="iban" f={form} s={setForm} /><FI l="BIC" v={form.bic} k="bic" f={form} s={setForm} w={140} /></div></div></div>
        <button className="p-btn" onClick={() => { if (!form.name) return; sf(form); }}>Speichern</button>
        <div style={{ background: "#1c1917", borderRadius: 10, padding: 16, border: "1px solid #7f1d1d" }}><h3 style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 6 }}>Gefahrenzone</h3>
          {!showR ? <button className="d-btn" onClick={() => setShowR(true)}>Alles löschen</button> : <div style={{ display: "flex", gap: 6 }}><button className="d-btn" onClick={async () => { await sre([]); await skn([]); await sf(null); window.location.reload(); }}>Ja</button><button className="s-btn" onClick={() => setShowR(false)}>Nein</button></div>}
        </div>
      </div>
    </div>
  );
}
function FI({ l, v, k, f, s, w }) { return <div style={{ flex: 1, ...(w ? { maxWidth: w } : {}) }}><label style={{ fontSize: 10, color: "#64748b", marginBottom: 1, display: "block" }}>{l}</label><input className="inp" value={v || ""} onChange={e => s({ ...f, [k]: e.target.value })} /></div>; }

// ═══ CSS ═══
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
input,select,textarea,button{font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

.app-wrap{display:flex;min-height:100vh;font-family:'DM Sans',sans-serif;background:#0b1120;color:#e2e8f0}
.load-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;width:100%;background:#0b1120}
.spinner{width:24px;height:24px;border:3px solid #1e293b;border-top:3px solid #818cf8;border-radius:50%;animation:spin .7s linear infinite}

.mob-header{display:none;position:sticky;top:0;z-index:50;background:#0f172a;border-bottom:1px solid #1e293b;padding:10px 14px;align-items:center;gap:10}
.mob-menu-btn{background:none;border:none;color:#e2e8f0;cursor:pointer;display:flex;padding:4px}
.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:90}

.sidebar{width:216px;background:#0f172a;border-right:1px solid #1e293b;display:flex;flex-direction:column;padding:14px 8px;flex-shrink:0;position:sticky;top:0;height:100vh;z-index:100}
.brand{display:flex;align-items:center;gap:8;padding:0 6px;margin-bottom:20}
.brand-ico{width:28px;height:28px;border-radius:7px;background:linear-gradient(135deg,#6366f1,#a78bfa);display:flex;align-items:center;justify-content:center;color:#fff}
.nav-list{display:flex;flex-direction:column;gap:1px;flex:1}
.main-content{flex:1;min-width:0;overflow-y:auto}

.nav-btn{display:flex;align-items:center;gap:7px;padding:7px 9px;background:transparent;border:none;color:#94a3b8;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;text-align:left;position:relative;transition:all .12s}
.nav-btn.active{background:#1e293b;color:#e2e8f0}
.nav-btn:hover{background:#1e293b44}
.nav-badge{position:absolute;right:7px;background:#ef4444;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:10px}
.usage-bar{height:3px;background:#1e293b;border-radius:2px;overflow:hidden;margin:0 8px}
.usage-fill{height:100%;background:linear-gradient(90deg,#818cf8,#6366f1);border-radius:2px;transition:width .3s}

.page{padding:20px 24px;animation:fadeIn .2s ease}
.page-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;gap:8}
.h1{font-size:21px;font-weight:700;letter-spacing:-.03em}
.sub{font-size:12px;color:#64748b;margin-top:2px}
.card-t{font-size:13px;font-weight:600;margin-bottom:12px}
.card{background:#111827;border-radius:10px;padding:18px;border:1px solid #1e293b}
.sec{background:#111827;border-radius:10px;padding:14px;border:1px solid #1e293b}
.sec-title{font-size:13px;font-weight:700;margin-bottom:10px}
.lbl{font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:4px;display:block}
.status-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;white-space:nowrap}

.p-btn{display:flex;align-items:center;gap:5px;padding:8px 15px;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap}
.s-btn{display:flex;align-items:center;gap:3px;padding:4px 9px;background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:5px;font-size:11px;cursor:pointer;white-space:nowrap}
.s-btn-g{display:flex;align-items:center;gap:3px;padding:4px 9px;background:#065f46;color:#34d399;border:1px solid #059669;border-radius:5px;font-size:11px;cursor:pointer;white-space:nowrap}
.pdf-btn{background:#1e1b4b;color:#a5b4fc;border-color:#4338ca}
.link-btn{background:none;border:none;color:#818cf8;font-size:12px;cursor:pointer;padding:4px 0;font-weight:500}
.ai-btn{display:flex;align-items:center;gap:4px;padding:4px 9px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer}
.i-btn{background:none;border:none;color:#64748b;cursor:pointer;padding:2px;display:flex;border-radius:3px}
.d-btn{padding:5px 10px;background:#7f1d1d;color:#fca5a5;border:1px solid #991b1b;border-radius:5px;font-size:11px;cursor:pointer}
.add-pos{display:flex;align-items:center;gap:5px;padding:8px;background:transparent;border:2px dashed #334155;border-radius:7px;color:#64748b;font-size:12px;cursor:pointer;width:100%;justify-content:center;margin-top:6px}

.upgrade-bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(90deg,#1e1b4b,#312e81);border:1px solid #4338ca;border-radius:8px;margin-bottom:16px;font-size:12px;color:#c7d2fe;flex-wrap:wrap}
.upgrade-sm{padding:4px 10px;background:#6366f1;color:#fff;border:none;border-radius:5px;font-size:11px;font-weight:600;cursor:pointer;margin-left:auto}
.warn-bar{display:flex;align-items:flex-start;gap:7px;padding:9px 12px;background:#1c1917;border:1px solid #92400e;border-radius:8px;margin-bottom:14px;font-size:12px;color:#fbbf24}
.warn-card{background:#1c1917;border:1px solid #92400e;border-radius:10px;padding:14px;margin-top:6px}

.toggle-wrap{display:flex;background:#111827;border-radius:7px;padding:2px;border:1px solid #1e293b}
.tog-btn{padding:5px 11px;background:transparent;border:none;color:#64748b;border-radius:5px;font-size:12px;cursor:pointer;font-weight:500}
.tog-btn.active{background:#1e293b;color:#e2e8f0}

.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
.kpi{background:#111827;border-radius:10px;padding:14px;border:1px solid #1e293b}
.kpi-l{font-size:10px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.kpi-v{font-size:22px;font-weight:700;margin-top:4px}
.kpi-s{font-size:11px;color:#64748b;margin-top:2px}

.dash-grid{display:grid;grid-template-columns:1.7fr 1fr;gap:10px;margin-bottom:18px}
.chart-bar{width:100%;background:linear-gradient(180deg,#818cf8,#4f46e5);border-radius:3px 3px 0 0;transition:height .5s;min-height:2px}
.recent-item{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #1e293b}

.form-grid{display:grid;grid-template-columns:1fr 280px;gap:18px}
.form-left{display:flex;flex-direction:column;gap:12px}
.form-right{position:sticky;top:20px;align-self:start}
.sum-card{background:#111827;border-radius:10px;padding:18px;border:1px solid #1e293b}
.sum-r{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px}
.sum-total{font-size:17px;font-weight:700;color:#818cf8;padding-top:8px;border-top:1px solid #1e293b;margin-top:4px}

.inp{width:100%;padding:7px 10px;background:#0b1120;border:1px solid #1e293b;border-radius:6px;color:#e2e8f0;font-size:13px;outline:none}
.inp:focus{border-color:#4f46e5}
.sel{width:100%;padding:7px 10px;background:#0b1120;border:1px solid #1e293b;border-radius:6px;color:#e2e8f0;font-size:13px;outline:none;cursor:pointer}
.search-ico{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:#475569;display:flex}
.search-inp{padding-left:30px}

.dd{background:#1e293b;border:1px solid #334155;border-radius:7px;margin-top:3px;max-height:140px;overflow-y:auto}
.dd-item{display:flex;flex-direction:column;gap:1px;padding:7px 9px;background:none;border:none;color:#e2e8f0;cursor:pointer;width:100%;text-align:left;border-bottom:1px solid #334155;font-size:12px}
.dd-item:hover{background:#334155}
.sel-kunde{display:flex;justify-content:space-between;align-items:center;background:#1e293b;border-radius:7px;padding:8px 10px;margin-top:5px}

.vor-wrap{background:#1a1136;border:1px solid #4f46e5;border-radius:8px;padding:10px;margin-top:6px}
.vor-chip{display:flex;flex-direction:column;gap:1px;padding:5px 9px;background:#0f172a;border:1px solid #334155;border-radius:5px;color:#e2e8f0;cursor:pointer;font-size:11px;text-align:left}
.vor-chip:hover{border-color:#6366f1}

.pos-table{margin-top:8px}
.pos-h{display:flex;gap:4px;padding:5px 1px;font-size:9px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #1e293b}
.pos-r{display:flex;gap:4px;align-items:center;padding:3px 0;border-bottom:1px solid #1e293b}
.pos-i{padding:5px 5px;background:#0b1120;border:1px solid #1e293b;border-radius:4px;color:#e2e8f0;font-size:11px;outline:none}

.tabs{display:flex;gap:2px;background:#111827;border-radius:6px;padding:2px}
.tab{padding:5px 9px;background:transparent;border:none;color:#64748b;border-radius:4px;font-size:12px;cursor:pointer;font-weight:500}
.tab.active{background:#1e293b;color:#e2e8f0}

.tbl-wrap{background:#111827;border-radius:10px;border:1px solid #1e293b;overflow:hidden}
.tbl-h{display:flex;gap:4px;padding:8px 14px;font-size:10px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.05em;background:#0f172a;border-bottom:1px solid #1e293b}
.tbl-r{display:flex;gap:4px;padding:9px 14px;align-items:center;border-bottom:1px solid #1e293b;font-size:13px}
.tbl-r:hover{background:#1e293b33}

.kunden-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.kunde-c{display:flex;gap:10px;background:#111827;border-radius:10px;padding:14px;border:1px solid #1e293b;align-items:center}
.kunde-av{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}

.plan-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.plan-card{background:#111827;border:1px solid #1e293b;border-radius:14px;padding:20px;display:flex;flex-direction:column;position:relative}
.plan-card.popular{background:linear-gradient(160deg,#1e1b4b,#312e81);border:2px solid #6366f1}
.pop-badge{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#6366f1,#a78bfa);color:#fff;font-size:9px;font-weight:700;padding:2px 11px;border-radius:20px}

.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 16px;text-align:center}
.empty-ico{width:44px;height:44px;border-radius:11px;background:#1e293b;display:flex;align-items:center;justify-content:center;margin-bottom:10px;color:#64748b}

.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:1000;padding:14px}
.modal-box{background:#fff;border-radius:14px;max-width:720px;width:100%;max-height:90vh;overflow-y:auto}

.toast{position:fixed;bottom:16px;right:16px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:8px 14px;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;animation:slideUp .25s ease;z-index:999;box-shadow:0 4px 18px rgba(0,0,0,.4)}

/* ═══ ONBOARDING ═══ */
.onboard-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:20px;background:#0b1120;width:100%}
.onboard-progress{width:100%;max-width:600px;height:4px;background:#1e293b;border-radius:2px;overflow:hidden;margin-bottom:20px}
.onboard-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#a78bfa);border-radius:2px;transition:width .4s ease}
.onboard-steps{display:flex;gap:12px;margin-bottom:28px;flex-wrap:wrap;justify-content:center}
.onboard-step-dot{width:32px;height:32px;border-radius:50%;background:#1e293b;border:2px solid #1e293b;display:flex;align-items:center;justify-content:center;transition:all .3s}
.onboard-step-dot.current{border-color:#6366f1;background:#1e1b4b;box-shadow:0 0 12px rgba(99,102,241,.3)}
.onboard-step-dot.done{background:#065f46;border-color:#059669;color:#34d399}
.onboard-card{background:#111827;border:1px solid #1e293b;border-radius:16px;padding:32px;max-width:680px;width:100%;flex:1;max-height:calc(100vh - 200px);overflow-y:auto;animation:fadeIn .3s ease}
.onboard-center{display:flex;flex-direction:column;align-items:center;text-align:center}
.onboard-title{font-size:22px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.onboard-desc{font-size:14px;color:#64748b;margin-bottom:20px;line-height:1.6}
.onboard-lbl{font-size:11px;font-weight:600;color:#94a3b8;margin-bottom:3px;display:block}
.onboard-nav{display:flex;align-items:center;gap:10px;max-width:680px;width:100%;margin-top:20px}

@keyframes confetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(-20px) rotate(360deg);opacity:0}}

@media(max-width:768px){
  .mob-header{display:flex}
  .mob-overlay{display:block}
  .sidebar{position:fixed;left:-260px;top:0;bottom:0;transition:left .25s ease;width:230px}
  .sidebar.open{left:0}
  .page{padding:14px}
  .page-head{flex-direction:column;gap:6}
  .kpi-grid{grid-template-columns:repeat(2,1fr);gap:6}
  .dash-grid{grid-template-columns:1fr;gap:8}
  .form-grid{grid-template-columns:1fr}
  .form-right{position:static}
  .plan-grid{grid-template-columns:1fr 1fr;gap:8}
  .tbl-h{display:none}
  .tbl-r{flex-wrap:wrap;gap:4px;padding:10px 12px}
  .tbl-r>span{flex:none!important}
  .h1{font-size:19px}
}
@media(max-width:480px){
  .kpi-grid{grid-template-columns:1fr}
  .plan-grid{grid-template-columns:1fr}
}
`;
