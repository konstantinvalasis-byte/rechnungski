// Export-Funktionen: DATEV-CSV und Mahnungstext

import type { Firma, Rechnung } from "@/lib/db";
import { fc, fd, fcn } from "@/lib/dashboard-utils";

export function datevCSV(re: Rechnung[]): string {
  const h = "Umsatz;S/H;WKZ;Kurs;Basis;WKZ-B;Konto;Gegenkonto;BU;Belegdatum;Beleg1;Beleg2;Skonto;Text";
  const rows = re.filter(r => r.status === "bezahlt").map(r => {
    const d = new Date(r.datum);
    return `${fcn(r.gesamt)};S;EUR;;;;;;8400;;${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")};${r.nummer};;0,00;${r.kundeName}`;
  });
  return h + "\n" + rows.join("\n");
}

export function mahnung(r: Rechnung, f: Firma, s: number = 1): string {
  const t: Record<number, string> = {
    1: `Sehr geehrte Damen und Herren,\n\nwir erinnern freundlich an die Zahlung unserer Rechnung ${r.nummer} vom ${fd(r.datum)} über ${fc(r.gesamt)}.\n\nZahlungsziel: ${fd(r.faelligDatum)}. Bitte überweisen Sie innerhalb von 7 Tagen.\n\nBank: ${f.bankName || "–"}\nIBAN: ${f.iban || "–"}\n\nMit freundlichen Grüßen\n${f.name}`,
    2: `Sehr geehrte Damen und Herren,\n\nbis heute liegt kein Zahlungseingang für Rechnung ${r.nummer} über ${fc(r.gesamt)} vor.\n\nBitte begleichen Sie den Betrag innerhalb von 5 Werktagen.\n\nMit freundlichen Grüßen\n${f.name}`,
    3: `LETZTE MAHNUNG\n\nRechnung ${r.nummer} über ${fc(r.gesamt)}.\n\nBei Nichtzahlung innerhalb 3 Werktagen erfolgt Übergabe an Inkasso.\n\n${f.name}`,
  };
  return t[s] || t[1];
}
