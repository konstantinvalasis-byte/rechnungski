import { describe, it, expect } from "vitest";
import { naechsteRechnungsnummer, naechsteAngebotsnummer, fc, fd, he } from "../dashboard-utils";

// --- Rechnungsnummer ---

describe("naechsteRechnungsnummer", () => {
  it("gibt RE-YYYY-0001 zurück wenn keine Rechnungen vorhanden", () => {
    expect(naechsteRechnungsnummer([], 2026)).toBe("RE-2026-0001");
  });

  it("ermittelt korrekt die nächste Nummer", () => {
    const rechnungen = [
      { nummer: "RE-2026-0001" },
      { nummer: "RE-2026-0003" },
      { nummer: "RE-2026-0002" },
    ];
    expect(naechsteRechnungsnummer(rechnungen, 2026)).toBe("RE-2026-0004");
  });

  it("ignoriert Rechnungen aus anderen Jahren", () => {
    const rechnungen = [{ nummer: "RE-2025-0099" }];
    expect(naechsteRechnungsnummer(rechnungen, 2026)).toBe("RE-2026-0001");
  });

  it("ignoriert Angebotsnummern", () => {
    const rechnungen = [{ nummer: "AN-2026-0005" }];
    expect(naechsteRechnungsnummer(rechnungen, 2026)).toBe("RE-2026-0001");
  });

  it("padded Nummer auf 4 Stellen", () => {
    const rechnungen = [{ nummer: "RE-2026-0009" }];
    expect(naechsteRechnungsnummer(rechnungen, 2026)).toBe("RE-2026-0010");
  });

  it("behandelt ungültige Nummern robust", () => {
    const rechnungen = [{ nummer: "RE-2026-abc" }, { nummer: "RE-2026-0002" }];
    expect(naechsteRechnungsnummer(rechnungen, 2026)).toBe("RE-2026-0003");
  });
});

describe("naechsteAngebotsnummer", () => {
  it("gibt AN-YYYY-0001 zurück wenn keine Angebote vorhanden", () => {
    expect(naechsteAngebotsnummer([], 2026)).toBe("AN-2026-0001");
  });

  it("ignoriert Rechnungsnummern", () => {
    const rechnungen = [{ nummer: "RE-2026-0010" }];
    expect(naechsteAngebotsnummer(rechnungen, 2026)).toBe("AN-2026-0001");
  });

  it("ermittelt korrekt die nächste Angebotsnummer", () => {
    const rechnungen = [{ nummer: "AN-2026-0001" }, { nummer: "AN-2026-0002" }];
    expect(naechsteAngebotsnummer(rechnungen, 2026)).toBe("AN-2026-0003");
  });
});

// --- Formatierungsfunktionen ---

describe("fc (Währungsformatierung)", () => {
  it("formatiert Betrag auf Deutsch mit EUR", () => {
    const result = fc(1234.56);
    expect(result).toContain("1.234,56");
    expect(result).toContain("€");
  });

  it("formatiert 0 korrekt", () => {
    expect(fc(0)).toContain("0,00");
  });
});

describe("fd (Datumsformatierung)", () => {
  it("formatiert ISO-Datum auf TT.MM.JJJJ", () => {
    expect(fd("2026-03-24")).toBe("24.03.2026");
  });

  it("gibt Strich zurück bei leerem String", () => {
    expect(fd("")).toBe("–");
  });
});

describe("he (HTML-Escaping)", () => {
  it("escaped Sonderzeichen korrekt", () => {
    expect(he('<script>alert("xss")</script>')).toBe("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
  });

  it("escaped Ampersand", () => {
    expect(he("Müller & Söhne")).toBe("Müller &amp; Söhne");
  });

  it("gibt leeren String bei null zurück", () => {
    expect(he(null)).toBe("");
  });
});
