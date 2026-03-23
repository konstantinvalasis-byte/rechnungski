import { useEffect } from "react";
import type { Rechnung, WiederkehrendItem } from "@/lib/db";
import { rechnungHinzufuegen, wiederkehrendAktualisieren } from "@/lib/db";
import { uid } from "@/lib/dashboard-utils";

/**
 * Erstellt automatisch fällige wiederkehrende Rechnungen beim ersten Laden.
 * Trennt Business-Logik von der UI-Komponente (AppShell).
 */
export function useWiederkehrendAutoCreate(
  loaded: boolean,
  wdk: WiederkehrendItem[],
  rechnungen: Rechnung[],
  aktualisierteRechnungenSetzen: (re: Rechnung[]) => void,
  toastZeigen: (msg: string) => void,
) {
  useEffect(() => {
    if (!loaded) return;
    if (wdk.length === 0) return;

    const today = new Date().toISOString().split("T")[0];
    const faellige = wdk.filter((w) => w.aktiv && w.nextDue <= today);
    if (faellige.length === 0) return;

    let abgebrochen = false;

    async function erstelleFaellige() {
      const alleRe = [...rechnungen];
      for (const w of faellige) {
        const faelligDatum = new Date();
        faelligDatum.setDate(faelligDatum.getDate() + (w.zahlungsziel || 14));
        const neueRe: Rechnung = {
          id: uid(),
          nummer: "",
          datum: today,
          faelligDatum: faelligDatum.toISOString().split("T")[0],
          kundeId: w.kundeId,
          kundeName: w.kundeName,
          kundeAdresse: w.kundeAdresse || "",
          kundeEmail: w.kundeEmail || "",
          positionen: w.positionen || [],
          netto: w.netto || 0,
          mwst: w.mwst || 0,
          gesamt: w.gesamt || 0,
          zahlungsziel: w.zahlungsziel || 14,
          notiz: w.notiz || "",
          status: "offen",
          gewerk: w.gewerk || "",
          rabatt: w.rabatt || 0,
          zeitraumVon: "",
          zeitraumBis: "",
        };
        const gespeicherteRe = await rechnungHinzufuegen(neueRe);
        alleRe.push(gespeicherteRe);

        const neuesDatum = (() => {
          const d = new Date(w.nextDue);
          if (w.interval === "monatlich") d.setMonth(d.getMonth() + 1);
          else if (w.interval === "quartal") d.setMonth(d.getMonth() + 3);
          else d.setFullYear(d.getFullYear() + 1);
          return d.toISOString().split("T")[0];
        })();
        await wiederkehrendAktualisieren(w.id, { nextDue: neuesDatum });
      }

      if (!abgebrochen) {
        aktualisierteRechnungenSetzen(alleRe);
        const n = faellige.length;
        toastZeigen(`${n} wiederkehrende Rechnung${n > 1 ? "en" : ""} automatisch erstellt`);
      }
    }

    erstelleFaellige().catch((e) => console.error("Fehler bei wiederkehrenden Rechnungen:", e));

    return () => { abgebrochen = true; };
  // Läuft genau einmal wenn `loaded` true wird — Daten sind dann frisch aus der DB
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);
}
