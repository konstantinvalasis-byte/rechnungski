// CII-XML Generator für ZUGFeRD BASIC-WL und XRechnung 3.0
// Beide Profile nutzen dieselbe Cross Industry Invoice (CII) Syntax

import type { Firma, Rechnung } from "@/lib/db";

export type ERechnungProfil = "zugferd" | "xrechnung";

const PROFIL_ID: Record<ERechnungProfil, string> = {
  zugferd: "urn:factur-x.eu:1p0:basicwl",
  xrechnung: "urn:cen.eu:en16931:2017#compliant#urn:xoev-de:kosit:standard:xrechnung_3.0",
};

// Datum von ISO (2026-03-23) in CII-Format (20260323) umwandeln
function ciiDatum(iso: string): string {
  return iso.replace(/-/g, "").slice(0, 8);
}

// Zahl auf 2 Dezimalstellen formatieren (kein Tausendertrennzeichen)
function xmlBetrag(n: number): string {
  return n.toFixed(2);
}

// Adresse in Zeile 1 + Zeile 2 aufteilen (Format: "Musterstraße 1, 12345 Musterstadt")
function parseAdresse(adresse: string): { strasse: string; plz: string; ort: string } {
  const teile = adresse.split(",").map((t) => t.trim());
  const strasse = teile[0] || "";
  const rest = teile[1] || "";
  const match = rest.match(/^(\d{4,5})\s+(.+)$/);
  return {
    strasse,
    plz: match ? match[1] : "",
    ort: match ? match[2] : rest,
  };
}

// MwSt-Kategorien gruppieren (für ApplicableTradeTax-Blöcke)
interface MwStGruppe {
  satz: number;
  netto: number;
  mwst: number;
}

function gruppierteMwSt(rechnung: Rechnung, kleinunternehmer: boolean): MwStGruppe[] {
  if (kleinunternehmer) {
    return [{ satz: 0, netto: rechnung.netto, mwst: 0 }];
  }

  const gruppen = new Map<number, MwStGruppe>();
  for (const pos of rechnung.positionen) {
    const satz = pos.mwst ?? 19;
    const posNetto = pos.menge * pos.preis;
    const posMwst = posNetto * (satz / 100);
    const existing = gruppen.get(satz);
    if (existing) {
      existing.netto += posNetto;
      existing.mwst += posMwst;
    } else {
      gruppen.set(satz, { satz, netto: posNetto, mwst: posMwst });
    }
  }

  // Fallback falls keine Positionen
  if (gruppen.size === 0) {
    const mwstSatz = rechnung.gesamt > 0 ? Math.round((rechnung.mwst / rechnung.netto) * 100) : 19;
    gruppen.set(mwstSatz, { satz: mwstSatz, netto: rechnung.netto, mwst: rechnung.mwst });
  }

  return Array.from(gruppen.values());
}

export function generiereERechnungXml(
  rechnung: Rechnung,
  firma: Firma,
  profil: ERechnungProfil
): string {
  const klein = firma.kleinunternehmer ?? false;
  const kaeuferAdresse = parseAdresse(rechnung.kundeAdresse || "");
  const mwstGruppen = gruppierteMwSt(rechnung, klein);

  // Steuerkennzeichen
  const steuerTyp = firma.ustid ? "VA" : "FC";
  const steuerNr = firma.ustid || firma.steuernr || "";

  // Positionen (für BASIC-WL optional, für XRechnung/EN16931 Pflicht)
  const positionenXml = rechnung.positionen
    .map(
      (pos, idx) => `
  <ram:IncludedSupplyChainTradeLineItem>
    <ram:AssociatedDocumentLineDocument>
      <ram:LineID>${idx + 1}</ram:LineID>
    </ram:AssociatedDocumentLineDocument>
    <ram:SpecifiedTradeProduct>
      <ram:Name>${escapeXml(pos.beschreibung)}</ram:Name>
    </ram:SpecifiedTradeProduct>
    <ram:SpecifiedLineTradeAgreement>
      <ram:NetPriceProductTradePrice>
        <ram:ChargeAmount>${xmlBetrag(pos.preis)}</ram:ChargeAmount>
      </ram:NetPriceProductTradePrice>
    </ram:SpecifiedLineTradeAgreement>
    <ram:SpecifiedLineTradeDelivery>
      <ram:BilledQuantity unitCode="${escapeXml(pos.einheit || "C62")}">${xmlBetrag(pos.menge)}</ram:BilledQuantity>
    </ram:SpecifiedLineTradeDelivery>
    <ram:SpecifiedLineTradeSettlement>
      <ram:ApplicableTradeTax>
        <ram:TypeCode>VAT</ram:TypeCode>
        <ram:CategoryCode>${klein ? "E" : "S"}</ram:CategoryCode>${
          !klein
            ? `
        <ram:RateApplicablePercent>${pos.mwst ?? 19}</ram:RateApplicablePercent>`
            : ""
        }
      </ram:ApplicableTradeTax>
      <ram:SpecifiedTradeSettlementLineMonetarySummation>
        <ram:LineTotalAmount>${xmlBetrag(pos.menge * pos.preis)}</ram:LineTotalAmount>
      </ram:SpecifiedTradeSettlementLineMonetarySummation>
    </ram:SpecifiedLineTradeSettlement>
  </ram:IncludedSupplyChainTradeLineItem>`
    )
    .join("");

  // MwSt-Blöcke
  const mwstXml = mwstGruppen
    .map(
      (g) => `
    <ram:ApplicableTradeTax>
      <ram:CalculatedAmount>${xmlBetrag(g.mwst)}</ram:CalculatedAmount>
      <ram:TypeCode>VAT</ram:TypeCode>
      <ram:BasisAmount>${xmlBetrag(g.netto)}</ram:BasisAmount>
      <ram:CategoryCode>${klein ? "E" : "S"}</ram:CategoryCode>${
        !klein
          ? `
      <ram:RateApplicablePercent>${g.satz}</ram:RateApplicablePercent>`
          : ""
      }${
        klein
          ? `
      <ram:ExemptionReason>Gemäß §19 UStG wird keine Umsatzsteuer berechnet.</ram:ExemptionReason>`
          : ""
      }
    </ram:ApplicableTradeTax>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
  xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
  xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
  xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">

  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>${PROFIL_ID[profil]}</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>

  <rsm:ExchangedDocument>
    <ram:ID>${escapeXml(rechnung.nummer)}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${ciiDatum(rechnung.datum)}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>

  <rsm:SupplyChainTradeTransaction>
    ${positionenXml}
    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${escapeXml(firma.name)}</ram:Name>
        <ram:PostalTradeAddress>
          <ram:LineOne>${escapeXml(firma.strasse || "")}</ram:LineOne>
          <ram:PostcodeCode>${escapeXml(firma.plz || "")}</ram:PostcodeCode>
          <ram:CityName>${escapeXml(firma.ort || "")}</ram:CityName>
          <ram:CountryID>DE</ram:CountryID>
        </ram:PostalTradeAddress>
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="${steuerTyp}">${escapeXml(steuerNr)}</ram:ID>
        </ram:SpecifiedTaxRegistration>
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${escapeXml(rechnung.kundeName)}</ram:Name>
        <ram:PostalTradeAddress>
          <ram:LineOne>${escapeXml(kaeuferAdresse.strasse)}</ram:LineOne>
          <ram:PostcodeCode>${escapeXml(kaeuferAdresse.plz)}</ram:PostcodeCode>
          <ram:CityName>${escapeXml(kaeuferAdresse.ort)}</ram:CityName>
          <ram:CountryID>DE</ram:CountryID>
        </ram:PostalTradeAddress>
      </ram:BuyerTradeParty>
    </ram:ApplicableHeaderTradeAgreement>

    <ram:ApplicableHeaderTradeDelivery/>

    <ram:ApplicableHeaderTradeSettlement>
      <ram:PaymentReference>${escapeXml(rechnung.nummer)}</ram:PaymentReference>
      <ram:InvoiceCurrencyCode>EUR</ram:InvoiceCurrencyCode>
      ${
        firma.iban
          ? `<ram:SpecifiedTradeSettlementPaymentMeans>
        <ram:TypeCode>58</ram:TypeCode>
        <ram:PayeePartyCreditorFinancialAccount>
          <ram:IBANID>${escapeXml(firma.iban)}</ram:IBANID>
        </ram:PayeePartyCreditorFinancialAccount>
      </ram:SpecifiedTradeSettlementPaymentMeans>`
          : ""
      }
      ${mwstXml}
      <ram:SpecifiedTradePaymentTerms>
        <ram:DueDateDateTime>
          <udt:DateTimeString format="102">${ciiDatum(rechnung.faelligDatum)}</udt:DateTimeString>
        </ram:DueDateDateTime>
      </ram:SpecifiedTradePaymentTerms>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${xmlBetrag(rechnung.netto)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${xmlBetrag(rechnung.netto)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="EUR">${xmlBetrag(rechnung.mwst)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${xmlBetrag(rechnung.gesamt)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${xmlBetrag(rechnung.gesamt)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>

</rsm:CrossIndustryInvoice>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
