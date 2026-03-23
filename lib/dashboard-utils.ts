// Hilfsfunktionen für das Dashboard

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
