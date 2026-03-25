import { describe, it, expect } from "vitest";
import { validateFirma, validateRechnung } from "../dashboard-validation";
import type { Firma, Rechnung } from "../db";

const firmaOk: Firma = {
  id: "1",
  name: "Muster GmbH",
  strasse: "Musterstraße 1",
  plz: "12345",
  ort: "Musterstadt",
  steuernr: "12/345/67890",
  ustid: "",
  telefon: "",
  email: "",
  iban: "",
  bic: "",
  gewerk: "Elektriker",
  logo: "",
  kleinunternehmer: false,
};

const rechnungOk: Rechnung = {
  id: "r1",
  nummer: "RE-2026-0001",
  typ: "rechnung",
  datum: "2026-03-24",
  faelligDatum: "2026-04-07",
  kundeId: "k1",
  kundeName: "Max Mustermann",
  kundeAdresse: "Hauptstraße 5, 10115 Berlin",
  kundeEmail: "",
  positionen: [
    { id: "p1", beschreibung: "Stundenlohn", einheit: "Std", preis: 80, menge: 5, typ: "arbeit", mwst: 19 },
  ],
  netto: 400,
  mwst: 76,
  gesamt: 476,
  zahlungsziel: 14,
  notiz: "",
  status: "offen",
  gewerk: "Elektriker",
  rabatt: 0,
  zeitraumVon: "",
  zeitraumBis: "",
};

// --- validateFirma ---

describe("validateFirma", () => {
  it("gibt keine Fehler bei vollständiger Firma zurück", () => {
    expect(validateFirma(firmaOk)).toEqual([]);
  });

  it("meldet fehlenden Firmennamen", () => {
    const f = { ...firmaOk, name: "" };
    expect(validateFirma(f)).toContain("Firmenname");
  });

  it("meldet fehlende Anschrift", () => {
    const f = { ...firmaOk, strasse: "" };
    expect(validateFirma(f)).toContain("Anschrift");
  });

  it("meldet fehlende PLZ", () => {
    const f = { ...firmaOk, plz: "" };
    expect(validateFirma(f)).toContain("PLZ/Ort");
  });

  it("meldet fehlende Steuernr. wenn weder steuernr noch ustid gesetzt", () => {
    const f = { ...firmaOk, steuernr: "", ustid: "" };
    expect(validateFirma(f)).toContain("Steuernr./USt-ID (§14)");
  });

  it("akzeptiert USt-ID statt Steuernummer", () => {
    const f = { ...firmaOk, steuernr: "", ustid: "DE123456789" };
    expect(validateFirma(f)).not.toContain("Steuernr./USt-ID (§14)");
  });

  it("gibt Fehler bei null zurück", () => {
    expect(validateFirma(null)).toContain("Firmenname");
  });
});

// --- validateRechnung ---

describe("validateRechnung", () => {
  it("gibt keine Fehler bei gültiger Rechnung zurück", () => {
    expect(validateRechnung(rechnungOk, firmaOk)).toEqual([]);
  });

  it("meldet fehlenden Kundennamen", () => {
    const r = { ...rechnungOk, kundeName: "" };
    expect(validateRechnung(r, firmaOk)).toContain("Kundenname");
  });

  it("meldet fehlende Kundenadresse", () => {
    const r = { ...rechnungOk, kundeAdresse: "" };
    expect(validateRechnung(r, firmaOk)).toContain("Kundenadresse");
  });

  it("meldet Kundenadresse mit 'undefined'", () => {
    const r = { ...rechnungOk, kundeAdresse: "undefined, undefined" };
    expect(validateRechnung(r, firmaOk)).toContain("Kundenadresse");
  });

  it("meldet fehlende Positionen", () => {
    const r = { ...rechnungOk, positionen: [] };
    expect(validateRechnung(r, firmaOk)).toContain("Positionen");
  });

  it("meldet unvollständige Position (Preis 0)", () => {
    const r = { ...rechnungOk, positionen: [{ ...rechnungOk.positionen[0], preis: 0 }] };
    expect(validateRechnung(r, firmaOk)).toContain("Pos. unvollständig");
  });

  it("meldet unvollständige Position (leere Beschreibung)", () => {
    const r = { ...rechnungOk, positionen: [{ ...rechnungOk.positionen[0], beschreibung: "" }] };
    expect(validateRechnung(r, firmaOk)).toContain("Pos. unvollständig");
  });

  it("enthält auch Firma-Fehler", () => {
    const errs = validateRechnung(rechnungOk, null);
    expect(errs).toContain("Firmenname");
  });
});
