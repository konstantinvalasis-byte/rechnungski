// §14 UStG Validierungsfunktionen

import type { Firma, Rechnung } from "@/lib/db";

export function validateFirma(f: Firma | null): string[] {
  const e: string[] = [];
  if (!f?.name) e.push("Firmenname");
  if (!f?.strasse) e.push("Anschrift");
  if (!f?.plz || !f?.ort) e.push("PLZ/Ort");
  if (!f?.steuernr && !f?.ustid) e.push("Steuernr./USt-ID (§14)");
  return e;
}

export function validateRechnung(r: Rechnung, f: Firma | null): string[] {
  const e = validateFirma(f);
  if (!r.kundeName) e.push("Kundenname");
  if (!r.kundeAdresse || r.kundeAdresse.includes("undefined")) e.push("Kundenadresse");
  if (!r.positionen?.length) e.push("Positionen");
  if (r.positionen?.some(p => !p.beschreibung || p.preis <= 0)) e.push("Pos. unvollständig");
  return e;
}
