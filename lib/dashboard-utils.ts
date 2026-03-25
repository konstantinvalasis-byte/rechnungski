// Hilfsfunktionen für das Dashboard
import type { Rechnung } from "@/lib/db";

export const uid = (): string => crypto.randomUUID();

export const fc = (v: number): string =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(v);

export const fd = (d: string): string =>
  d ? new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }) : "–";

export const fcn = (v: number): string => v.toFixed(2).replace(".", ",");

export const he = (s: unknown): string =>
  s == null
    ? ""
    : String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

export const safeSrc = (s: unknown): string | null =>
  s && /^data:image\/(jpeg|png|gif|webp|svg\+xml);base64,/.test(String(s))
    ? String(s)
    : null;

// Nächste Rechnungsnummer berechnen (RE-YYYY-NNNN)
export function naechsteRechnungsnummer(rechnungen: Pick<Rechnung, "nummer">[], jahr?: number): string {
  const y = jahr ?? new Date().getFullYear();
  const prefix = `RE-${y}-`;
  const maxNr = rechnungen
    .filter(r => r.nummer?.startsWith(prefix))
    .reduce((max, r) => {
      const n = parseInt(r.nummer.slice(prefix.length), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
  return `${prefix}${String(maxNr + 1).padStart(4, "0")}`;
}

// Nächste Angebotsnummer berechnen (AN-YYYY-NNNN)
export function naechsteAngebotsnummer(rechnungen: Pick<Rechnung, "nummer">[], jahr?: number): string {
  const y = jahr ?? new Date().getFullYear();
  const prefix = `AN-${y}-`;
  const maxNr = rechnungen
    .filter(r => r.nummer?.startsWith(prefix))
    .reduce((max, r) => {
      const n = parseInt(r.nummer.slice(prefix.length), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
  return `${prefix}${String(maxNr + 1).padStart(4, "0")}`;
}
