// EPC QR-Code (GiroCode) für SEPA-Überweisungen
// Standard: European Payments Council Quick Response Code, Version 002
// Kompatibel mit DKB, Sparkasse, ING, Commerzbank, etc.

import QRCode from "qrcode";

interface GiroCodeParams {
  empfaengerName: string;
  iban: string;
  bic?: string;
  betrag: number;
  verwendungszweck: string;
}

function erstelleEpcString(params: GiroCodeParams): string {
  const { empfaengerName, iban, bic, betrag, verwendungszweck } = params;

  const ibanBereinigt = iban.replace(/\s/g, "").toUpperCase();
  const nameBereinigt = empfaengerName.slice(0, 70);
  const betragStr = `EUR${betrag.toFixed(2)}`;
  const zweckBereinigt = verwendungszweck.slice(0, 140);

  // EPC QR-Code Format (Zeile für Zeile)
  return [
    "BCD",           // Service Tag
    "002",           // Version
    "1",             // Zeichensatz: UTF-8
    "SCT",           // SEPA Credit Transfer
    bic ?? "",       // BIC (optional ab Version 002)
    nameBereinigt,   // Name des Empfängers
    ibanBereinigt,   // IBAN
    betragStr,       // Betrag (z.B. "EUR1234.56")
    "",              // Verwendungszweck-Code (leer)
    "",              // Strukturierter Verwendungszweck (leer)
    zweckBereinigt,  // Unstrukturierter Verwendungszweck
  ].join("\n");
}

export async function erstelleGiroCodeDataUrl(params: GiroCodeParams): Promise<string> {
  const epcString = erstelleEpcString(params);

  return QRCode.toDataURL(epcString, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 200,
    color: {
      dark: "#111111",
      light: "#ffffff",
    },
  });
}
