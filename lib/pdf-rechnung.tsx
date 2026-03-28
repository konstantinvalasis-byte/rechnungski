// Server-seitige PDF-Dokumente mit @react-pdf/renderer

import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { Firma, Rechnung } from "@/lib/db";
import { fc, fd, safeSrc } from "@/lib/dashboard-utils";
import { mahnung } from "@/lib/dashboard-export";

// ─────────────────────────────────────────────
// Farben
// ─────────────────────────────────────────────
const BRAND = "#4f46e5";
const MUTED = "#666666";
const VERY_MUTED = "#999999";
const LIGHT_BG = "#f8f9fa";
const BORDER = "#e5e7eb";
const ROW_BORDER = "#eeeeee";
const RED = "#ef4444";
const YELLOW_BG = "#fffbeb";
const YELLOW_BORDER = "#fde68a";
const YELLOW_TEXT = "#92400e";

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 48,
    paddingLeft: 44,
    paddingRight: 44,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#111111",
    lineHeight: 1.4,
  },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  firmaName: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  firmaDetail: { fontSize: 9, color: MUTED, lineHeight: 1.4 },
  docTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: BRAND, textAlign: "right" },
  docMeta: { fontSize: 10, color: MUTED, textAlign: "right", marginTop: 3, lineHeight: 1.4 },

  // Empfänger-Box
  recipientBox: {
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 9,
    marginBottom: 12,
  },
  recipientLabel: {
    fontSize: 8,
    color: VERY_MUTED,
    letterSpacing: 0.8,
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  recipientName: { fontFamily: "Helvetica-Bold", fontSize: 11, marginBottom: 1 },
  recipientAddress: { fontSize: 10, color: MUTED },

  // Tabelle
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: BORDER,
    paddingBottom: 5,
    marginBottom: 0,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: VERY_MUTED,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: ROW_BORDER,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 18,
  },
  tableCell: { fontSize: 10, paddingHorizontal: 3 },
  tableCellBold: { fontSize: 10, fontFamily: "Helvetica-Bold", paddingHorizontal: 3 },
  tableCellMuted: { fontSize: 9, color: "#888888", paddingHorizontal: 3 },

  // Spaltenbreiten (flex-Anteile)
  colPos: { width: "5%" },
  colDesc: { width: "34%" },
  colTyp: { width: "11%" },
  colMenge: { width: "13%", alignItems: "flex-end" },
  colPreis: { width: "13%", alignItems: "flex-end" },
  colMwst: { width: "9%", alignItems: "flex-end" },
  colSumme: { width: "15%", alignItems: "flex-end" },

  // Summen-Block
  summaryOuter: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  summaryBox: { width: 240 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 11,
  },
  summaryRowMuted: { color: MUTED, fontSize: 10 },
  summaryRowRed: { color: RED, fontSize: 10 },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: "#111111",
    paddingTop: 6,
    marginTop: 3,
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
  },

  // Einleitungstext
  introText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.5,
    marginBottom: 10,
  },

  // Abschlusstext
  outroBox: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  outroText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.6,
  },
  outroSignoff: {
    fontSize: 10,
    color: MUTED,
    marginTop: 5,
    lineHeight: 1.4,
  },

  // Notiz
  noteBox: {
    marginTop: 12,
    padding: 8,
    backgroundColor: LIGHT_BG,
    borderRadius: 5,
  },
  noteText: { fontSize: 9, color: MUTED },
  noteBold: { fontFamily: "Helvetica-Bold", fontSize: 9, color: MUTED },

  // §19 Hinweis
  kleinBox: {
    marginTop: 12,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: YELLOW_BG,
    borderWidth: 1,
    borderColor: YELLOW_BORDER,
    borderRadius: 5,
  },
  kleinText: { fontSize: 9, color: YELLOW_TEXT },

  // GiroCode QR-Box
  giroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  giroLeft: { flex: 1 },
  giroLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: MUTED, letterSpacing: 0.5, marginBottom: 4 },
  giroText: { fontSize: 9, color: MUTED, lineHeight: 1.5 },
  giroRight: { alignItems: "center", marginLeft: 16 },
  giroQr: { width: 72, height: 72 },
  giroCaption: { fontSize: 7, color: VERY_MUTED, marginTop: 3, textAlign: "center" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 10, color: VERY_MUTED },
});

// ─────────────────────────────────────────────
// Rechnung-Dokument
// ─────────────────────────────────────────────
export function RechnungPdf({ rechnung, firma, giroCodeUrl }: { rechnung: Rechnung; firma: Firma; giroCodeUrl?: string }) {
  const pos = rechnung.positionen || [];
  const klein = !!firma.kleinunternehmer;
  const arbeit = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const mat = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);
  const nettoVR = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = nettoVR * (rechnung.rabatt || 0) / 100;
  const mwstB = klein ? 0 : pos.reduce((s, p) => s + p.menge * p.preis * (1 - (rechnung.rabatt || 0) / 100) * p.mwst / 100, 0);

  const docLabel = rechnung.typ === "angebot" ? "ANGEBOT" : "RECHNUNG";
  const empfLabel = rechnung.typ === "angebot" ? "ANGEBOT AN" : "RECHNUNGSEMPFÄNGER";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Links: Firma */}
          <View>
            {safeSrc(firma.logo) ? (
              <Image src={safeSrc(firma.logo)!} style={{ maxHeight: 55, maxWidth: 170, marginBottom: 8, objectFit: "contain" }} />
            ) : null}
            <Text style={s.firmaName}>{firma.name}</Text>
            <Text style={s.firmaDetail}>
              {firma.inhaber ? firma.inhaber + " · " : ""}{firma.strasse || ""}{"\n"}{firma.plz || ""} {firma.ort || ""}
            </Text>
            {firma.telefon ? <Text style={s.firmaDetail}>Tel: {firma.telefon}</Text> : null}
            {firma.email ? <Text style={s.firmaDetail}>{firma.email}</Text> : null}
          </View>
          {/* Rechts: Dok-Typ + Metadaten */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.docTitle}>{docLabel}</Text>
            <Text style={s.docMeta}>
              Nr. {rechnung.nummer}{"\n"}
              Datum: {fd(rechnung.datum)}
              {rechnung.faelligDatum ? "\nFällig: " + fd(rechnung.faelligDatum) : ""}
              {rechnung.zeitraumVon && rechnung.zeitraumBis
                ? "\nLeistungszeitraum: " + fd(rechnung.zeitraumVon) + " – " + fd(rechnung.zeitraumBis)
                : rechnung.typ !== "angebot" ? "\nLeistungsdatum entspricht\nRechnungsdatum" : ""}
            </Text>
          </View>
        </View>

        {/* ── EMPFÄNGER ── */}
        <View style={s.recipientBox}>
          <Text style={s.recipientLabel}>{empfLabel}</Text>
          <Text style={s.recipientName}>{rechnung.kundeName}</Text>
          <Text style={s.recipientAddress}>{rechnung.kundeAdresse}</Text>
        </View>

        {/* ── EINLEITUNGSTEXT ── */}
        <Text style={s.introText}>
          {rechnung.typ === "angebot"
            ? `vielen Dank für Ihr Interesse. Gerne unterbreiten wir Ihnen folgendes Angebot für die angefragten Leistungen:`
            : `für die erbrachten Leistungen erlauben wir uns, Ihnen folgende Positionen in Rechnung zu stellen:`}
        </Text>

        {/* ── TABELLE ── */}
        {/* Kopfzeile */}
        <View style={s.tableHeaderRow}>
          <View style={s.colPos}><Text style={s.tableHeaderCell}>POS</Text></View>
          <View style={s.colDesc}><Text style={s.tableHeaderCell}>BESCHREIBUNG</Text></View>
          <View style={s.colTyp}><Text style={s.tableHeaderCell}>TYP</Text></View>
          <View style={s.colMenge}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>MENGE</Text></View>
          <View style={s.colPreis}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>PREIS</Text></View>
          {!klein && <View style={s.colMwst}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>MWST</Text></View>}
          <View style={s.colSumme}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>SUMME</Text></View>
        </View>
        {/* Positionen */}
        {pos.map((p, i) => (
          <View key={i} style={s.tableRow} wrap={false}>
            <View style={s.colPos}><Text style={[s.tableCell, { color: MUTED }]}>{i + 1}</Text></View>
            <View style={s.colDesc}><Text style={s.tableCell}>{p.beschreibung}</Text></View>
            <View style={s.colTyp}><Text style={s.tableCellMuted}>{p.typ === "material" ? "Material" : p.typ === "arbeit" ? "Arbeit" : ""}</Text></View>
            <View style={s.colMenge}><Text style={[s.tableCell, { textAlign: "right" }]}>{p.menge} {p.einheit}</Text></View>
            <View style={s.colPreis}><Text style={[s.tableCell, { textAlign: "right" }]}>{fc(p.preis)}</Text></View>
            {!klein && <View style={s.colMwst}><Text style={[s.tableCell, { textAlign: "right" }]}>{Number(p.mwst)}%</Text></View>}
            <View style={s.colSumme}><Text style={[s.tableCellBold, { textAlign: "right" }]}>{fc(p.menge * p.preis)}</Text></View>
          </View>
        ))}

        {/* ── SUMMEN ── */}
        <View style={s.summaryOuter}>
          <View style={s.summaryBox}>
            {arbeit > 0 && (
              <View style={[s.summaryRow, s.summaryRowMuted]}>
                <Text>Arbeitskosten</Text><Text>{fc(arbeit)}</Text>
              </View>
            )}
            {mat > 0 && (
              <View style={[s.summaryRow, s.summaryRowMuted]}>
                <Text>Materialkosten</Text><Text>{fc(mat)}</Text>
              </View>
            )}
            {!klein && (
              <View style={s.summaryRow}>
                <Text>Netto</Text><Text>{fc(nettoVR)}</Text>
              </View>
            )}
            {rechnung.rabatt > 0 && (
              <View style={[s.summaryRow, s.summaryRowRed]}>
                <Text>Rabatt ({rechnung.rabatt}%)</Text><Text>-{fc(rabattB)}</Text>
              </View>
            )}
            {!klein && (
              <View style={s.summaryRow}>
                <Text>MwSt</Text><Text>{fc(mwstB)}</Text>
              </View>
            )}
            <View style={s.summaryTotal}>
              <Text>{klein ? "Gesamtbetrag" : "Brutto"}</Text><Text>{fc(rechnung.gesamt)}</Text>
            </View>
          </View>
        </View>

        {/* ── NOTIZ ── */}
        {rechnung.notiz ? (
          <View style={s.noteBox}>
            <Text style={s.noteText}><Text style={s.noteBold}>Hinweis: </Text>{rechnung.notiz}</Text>
          </View>
        ) : null}

        {/* ── §19 HINWEIS ── */}
        {firma.kleinunternehmer ? (
          <View style={s.kleinBox}>
            <Text style={s.kleinText}>Gemäß §19 UStG wird keine Umsatzsteuer berechnet.</Text>
          </View>
        ) : null}

        {/* ── ABSCHLUSSTEXT ── */}
        <View style={s.outroBox} wrap={false}>
          <Text style={s.outroText}>
            {rechnung.typ === "angebot"
              ? `Dieses Angebot ist freibleibend und gilt für 30 Tage ab dem Angebotsdatum. Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.`
              : `Wir bitten Sie, den Gesamtbetrag von ${fc(rechnung.gesamt)} innerhalb von 14 Tagen${rechnung.faelligDatum ? " bis zum " + fd(rechnung.faelligDatum) : ""} auf das unten angegebene Konto zu überweisen. Bitte geben Sie dabei die Rechnungsnummer ${rechnung.nummer} als Verwendungszweck an.`}
          </Text>
          <Text style={s.outroSignoff}>
            {rechnung.typ === "angebot"
              ? `Wir freuen uns auf Ihren Auftrag und eine gute Zusammenarbeit.\nMit freundlichen Grüßen\n${firma.inhaber || firma.name}`
              : `Vielen Dank für Ihr Vertrauen und Ihren Auftrag.\nMit freundlichen Grüßen\n${firma.inhaber || firma.name}`}
          </Text>
        </View>

        {/* ── GIROCODE ── */}
        {giroCodeUrl && rechnung.typ !== "angebot" && firma.iban ? (
          <View style={s.giroRow} wrap={false}>
            <View style={s.giroLeft}>
              <Text style={s.giroLabel}>ZAHLUNG PER QR-CODE</Text>
              <Text style={s.giroText}>
                Scannen Sie diesen Code mit Ihrer Banking-App,{"\n"}
                um die Überweisung automatisch vorzubefüllen.
              </Text>
              <Text style={[s.giroText, { marginTop: 5 }]}>
                Empfänger: {firma.inhaber || firma.name}{"\n"}
                IBAN: {firma.iban}{"\n"}
                Betrag: {fc(rechnung.gesamt)}{"\n"}
                Verwendungszweck: {rechnung.nummer}
              </Text>
            </View>
            <View style={s.giroRight}>
              <Image src={giroCodeUrl} style={s.giroQr} />
              <Text style={s.giroCaption}>GiroCode (EPC)</Text>
            </View>
          </View>
        ) : null}

        {/* ── FOOTER ── */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            {firma.bankName ? firma.bankName + " · " : ""}{firma.iban ? "IBAN: " + firma.iban : ""}
          </Text>
          <Text style={s.footerText}>
            {firma.steuernr ? "St.Nr: " + firma.steuernr : ""}
            {firma.ustid ? " · USt-ID: " + firma.ustid : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// ─────────────────────────────────────────────
// Mahnung-Dokument
// ─────────────────────────────────────────────
export function MahnungPdf({ rechnung, firma, stufe }: { rechnung: Rechnung; firma: Firma; stufe: number }) {
  const stufenLabel: Record<number, string> = { 1: "ZAHLUNGSERINNERUNG", 2: "ZWEITE MAHNUNG", 3: "LETZTE MAHNUNG" };
  const stufenFarbe: Record<number, string> = { 1: "#f59e0b", 2: "#f97316", 3: "#ef4444" };
  const label = stufenLabel[stufe] || "MAHNUNG";
  const farbe = stufenFarbe[stufe] || "#ef4444";
  const text = mahnung(rechnung, firma, stufe);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={[s.header, { marginBottom: 40 }]}>
          <View>
            {safeSrc(firma.logo) ? (
              <Image src={safeSrc(firma.logo)!} style={{ maxHeight: 50, maxWidth: 160, marginBottom: 6, objectFit: "contain" }} />
            ) : null}
            <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{firma.name}</Text>
            <Text style={s.firmaDetail}>{firma.strasse || ""}, {firma.plz || ""} {firma.ort || ""}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 18, fontFamily: "Helvetica-Bold", color: farbe, textAlign: "right" }}>{label}</Text>
            <Text style={s.docMeta}>
              Datum: {fd(new Date().toISOString())}{"\n"}Zu Rechnung: {rechnung.nummer}
            </Text>
          </View>
        </View>

        {/* Empfänger */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[s.recipientLabel, { marginBottom: 4 }]}>AN</Text>
          <Text style={s.recipientName}>{rechnung.kundeName}</Text>
          <Text style={s.recipientAddress}>{rechnung.kundeAdresse || ""}</Text>
        </View>

        {/* Mahnungstext */}
        <Text style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 32 }}>{text}</Text>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            {firma.bankName ? firma.bankName + " · " : ""}{firma.iban ? "IBAN: " + firma.iban : ""}
          </Text>
          <Text style={s.footerText}>
            {firma.steuernr ? "St.Nr: " + firma.steuernr : ""}
            {firma.ustid ? " · USt-ID: " + firma.ustid : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
