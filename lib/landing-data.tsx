// Statische Daten für die Landing-Page

import {
  Zap,
  Palette,
  Camera,
  Monitor,
  Dumbbell,
  UtensilsCrossed,
  Leaf,
  Heart,
  Globe,
  Music,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Branch {
  name: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}

export interface Step {
  title: string;
  desc: string;
  color: string;
}

export interface Feature {
  title: string;
  desc: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Plan {
  name: string;
  price: number;
  priceYearly: number;
  desc: string;
  features: string[];
  popular?: boolean;
}

export const BRANCHES: Branch[] = [
  { name: "Elektriker", icon: Zap, gradient: "from-amber-50 to-amber-100", iconColor: "text-amber-600" },
  { name: "Grafikdesign", icon: Palette, gradient: "from-pink-50 to-pink-100", iconColor: "text-pink-600" },
  { name: "Fotografie", icon: Camera, gradient: "from-indigo-50 to-indigo-100", iconColor: "text-indigo-600" },
  { name: "IT-Beratung", icon: Monitor, gradient: "from-emerald-50 to-emerald-100", iconColor: "text-emerald-600" },
  { name: "Personal Training", icon: Dumbbell, gradient: "from-red-50 to-red-100", iconColor: "text-red-500" },
  { name: "Catering", icon: UtensilsCrossed, gradient: "from-orange-50 to-orange-100", iconColor: "text-orange-600" },
  { name: "Gartenbau", icon: Leaf, gradient: "from-green-50 to-green-100", iconColor: "text-green-600" },
  { name: "Massage", icon: Heart, gradient: "from-violet-50 to-violet-100", iconColor: "text-violet-600" },
  { name: "Webentwicklung", icon: Globe, gradient: "from-blue-50 to-blue-100", iconColor: "text-blue-600" },
  { name: "DJ & Events", icon: Music, gradient: "from-fuchsia-50 to-fuchsia-100", iconColor: "text-fuchsia-600" },
  { name: "Reinigung", icon: Sparkles, gradient: "from-teal-50 to-teal-100", iconColor: "text-teal-600" },
  { name: "+ 20 weitere", icon: ArrowRight, gradient: "from-slate-50 to-slate-100", iconColor: "text-slate-500" },
];

export const STEPS: Step[] = [
  { title: "Branche wählen", desc: "30+ Branchen mit passenden KI-Preisen", color: "bg-brand-600" },
  { title: "Positionen hinzufügen", desc: "KI schlägt branchenübliche Preise vor", color: "bg-amber-500" },
  { title: "Vorschau prüfen", desc: "Professionelles Layout, §14-konform", color: "bg-success-600" },
  { title: "PDF exportieren", desc: "Download, drucken oder per Mail", color: "bg-danger-500" },
];

export const FEATURES: Feature[] = [
  { title: "§14 UStG-konform", desc: "Automatische Validierung aller Pflichtangaben." },
  { title: "Angebote → Rechnungen", desc: "Ein Klick konvertiert Angebote in Rechnungen." },
  { title: "DATEV CSV-Export", desc: "Im richtigen Format für deinen Steuerberater." },
  { title: "Material & Arbeit getrennt", desc: "Transparente Aufschlüsselung für Kunden." },
  { title: "3-Stufen-Mahnwesen", desc: "Professionelle Mahntexte, 1 Klick versenden." },
  { title: "Logo & Branding", desc: "Dein Logo auf jeder Rechnung." },
];

export interface Testimonial {
  name: string;
  beruf: string;
  ort: string;
  zitat: string;
  sterne: number;
  initiale: string;
  farbe: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Markus S.",
    beruf: "Elektriker",
    ort: "München",
    zitat: "Früher hab ich samstags 2 Stunden Rechnungen getippt. Jetzt bin ich in 5 Minuten fertig — inklusive PDF. Das ist keine Übertreibung.",
    sterne: 5,
    initiale: "M",
    farbe: "bg-amber-500",
  },
  {
    name: "Jana K.",
    beruf: "Grafikdesignerin",
    ort: "Berlin",
    zitat: "Endlich eine Rechnungssoftware die nicht aussieht wie von 2008. Die KI-Preisvorschläge für Grafikdesign treffen es erstaunlich gut.",
    sterne: 5,
    initiale: "J",
    farbe: "bg-brand-600",
  },
  {
    name: "Thomas W.",
    beruf: "IT-Berater",
    ort: "Hamburg",
    zitat: "Der DATEV-Export hat mir die erste Gespräch mit meinem Steuerberater um eine halbe Stunde verkürzt. Der war selbst überrascht wie sauber die Daten rauskamen.",
    sterne: 5,
    initiale: "T",
    farbe: "bg-emerald-600",
  },
];

export const FAQS: Faq[] = [
  { q: "Wie kündige ich?", a: "Jederzeit — monatlich kündbar, kein Mindestvertrag. Kündigung per Klick in den Einstellungen, keine Formulare, kein Ärger." },
  { q: "Kann ich Lexoffice-Daten importieren?", a: "Ein direkter Import ist aktuell nicht verfügbar. Du kannst deine Kundenstammdaten manuell anlegen — das dauert in der Regel weniger als 5 Minuten." },
  { q: "Werden meine Kundendaten geteilt?", a: "Nein. Deine Daten werden nie an Dritte weitergegeben, nicht für Werbung genutzt und nicht verkauft. Alles liegt auf deutschen Servern, DSGVO-konform." },
  { q: "Funktioniert das auch als GbR oder GmbH?", a: "Ja. Du kannst alle Unternehmensformen anlegen: Einzelunternehmen, GbR, UG, GmbH. §14 UStG-Pflichtangaben werden automatisch geprüft." },
  { q: "Was passiert mit meinen Daten nach Kündigung?", a: "Du kannst alle Rechnungen vor der Kündigung als PDF exportieren. Nach Kündigung werden deine Daten gemäß DSGVO nach 30 Tagen gelöscht." },
  { q: "Kann ich mein eigenes Logo hochladen?", a: "Ja — ab dem Starter-Plan. Dein Logo erscheint auf jeder Rechnung und jedem Angebot. Unterstützte Formate: PNG, JPG, SVG." },
];

export const PLANS: Plan[] = [
  { name: "Free", price: 0, priceYearly: 0, desc: "Zum Ausprobieren", features: ["3 Rechnungen & Angebote/Monat", "3 Kunden", "KI-Preisvorschläge", "PDF-Export", "§14-konforme Rechnungen"] },
  { name: "Starter", price: 7.90, priceYearly: 6.30, desc: "Für Einzelunternehmer", features: ["100 Rechnungen & Angebote/Monat", "100 Kunden", "Alles aus Free", "Firmenlogo auf PDFs", "E-Mail-Versand", "Wiederkehrende Rechnungen", "Mahnwesen"], popular: true },
  { name: "Pro", price: 17.90, priceYearly: 14.30, desc: "Für wachsende Betriebe", features: ["Alles aus Starter", "3-Stufen-Mahnwesen", "DATEV CSV-Export", "Angebote → Rechnungen (1 Klick)", "Prioritäts-Support"] },
];
