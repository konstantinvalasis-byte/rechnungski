// Server-seitige PDF-Dokumente mit @react-pdf/renderer

import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { Firma, Rechnung } from "@/lib/db";
import { fc, fd } from "@/lib/dashboard-utils";
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
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 48,
    paddingRight: 48,
    fontFamily: "Helvetica",
    fontSize: 13,
    color: "#111111",
    lineHeight: 1.5,
  },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  firmaName: { fontSize: 17, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  firmaDetail: { fontSize: 11, color: MUTED, lineHeight: 1.4 },
  docTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: BRAND, textAlign: "right" },
  docMeta: { fontSize: 12, color: MUTED, textAlign: "right", marginTop: 3, lineHeight: 1.4 },

  // Empfänger-Box
  recipientBox: {
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 14,
    marginBottom: 24,
  },
  recipientLabel: {
    fontSize: 9,
    color: VERY_MUTED,
    letterSpacing: 0.8,
    marginBottom: 3,
    fontFamily: "Helvetica-Bold",
  },
  recipientName: { fontFamily: "Helvetica-Bold", fontSize: 13, marginBottom: 2 },
  recipientAddress: { fontSize: 12, color: MUTED },

  // Tabelle
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: BORDER,
    paddingBottom: 7,
    marginBottom: 0,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: VERY_MUTED,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: ROW_BORDER,
    paddingTop: 7,
    paddingBottom: 7,
    minHeight: 24,
  },
  tableCell: { fontSize: 12, paddingHorizontal: 3 },
  tableCellBold: { fontSize: 12, fontFamily: "Helvetica-Bold", paddingHorizontal: 3 },
  tableCellMuted: { fontSize: 10, color: "#888888", paddingHorizontal: 3 },

  // Spaltenbreiten (flex-Anteile)
  colPos: { width: "5%" },
  colDesc: { width: "34%" },
  colTyp: { width: "11%" },
  colMenge: { width: "13%", alignItems: "flex-end" },
  colPreis: { width: "13%", alignItems: "flex-end" },
  colMwst: { width: "9%", alignItems: "flex-end" },
  colSumme: { width: "15%", alignItems: "flex-end" },

  // Summen-Block
  summaryOuter: { flexDirection: "row", justifyContent: "flex-end", marginTop: 22 },
  summaryBox: { width: 260 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    fontSize: 13,
  },
  summaryRowMuted: { color: MUTED, fontSize: 12 },
  summaryRowRed: { color: RED, fontSize: 12 },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 2,
    borderTopColor: "#111111",
    paddingTop: 8,
    marginTop: 4,
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },

  // Notiz
  noteBox: {
    marginTop: 18,
    padding: 10,
    backgroundColor: LIGHT_BG,
    borderRadius: 5,
  },
  noteText: { fontSize: 11, color: MUTED },
  noteBold: { fontFamily: "Helvetica-Bold", fontSize: 11, color: MUTED },

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
  kleinText: { fontSize: 11, color: YELLOW_TEXT },

  // Footer
  footer: {
    marginTop: 28,
    paddingTop: 14,
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
export function RechnungPdf({ rechnung, firma }: { rechnung: Rechnung; firma: Firma }) {
  const pos = rechnung.positionen || [];
  const arbeit = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const mat = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);
  const nettoVR = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = nettoVR * (rechnung.rabatt || 0) / 100;
  const mwstB = pos.reduce((s, p) => s + p.menge * p.preis * (1 - (rechnung.rabatt || 0) / 100) * p.mwst / 100, 0);

  const docLabel = rechnung.typ === "angebot" ? "ANGEBOT" : "RECHNUNG";
  const empfLabel = rechnung.typ === "angebot" ? "ANGEBOT AN" : "RECHNUNGSEMPFÄNGER";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── HEADER ── */}
        <View style={s.header}>
          {/* Links: Firma */}
          <View>
            {firma.logo ? (
              <Image src={firma.logo} style={{ maxHeight: 55, maxWidth: 170, marginBottom: 8, objectFit: "contain" }} />
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
                : ""}
            </Text>
          </View>
        </View>

        {/* ── EMPFÄNGER ── */}
        <View style={s.recipientBox}>
          <Text style={s.recipientLabel}>{empfLabel}</Text>
          <Text style={s.recipientName}>{rechnung.kundeName}</Text>
          <Text style={s.recipientAddress}>{rechnung.kundeAdresse}</Text>
        </View>

        {/* ── TABELLE ── */}
        {/* Kopfzeile */}
        <View style={s.tableHeaderRow}>
          <View style={s.colPos}><Text style={s.tableHeaderCell}>POS</Text></View>
          <View style={s.colDesc}><Text style={s.tableHeaderCell}>BESCHREIBUNG</Text></View>
          <View style={s.colTyp}><Text style={s.tableHeaderCell}>TYP</Text></View>
          <View style={s.colMenge}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>MENGE</Text></View>
          <View style={s.colPreis}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>PREIS</Text></View>
          <View style={s.colMwst}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>MWST</Text></View>
          <View style={s.colSumme}><Text style={[s.tableHeaderCell, { textAlign: "right" }]}>SUMME</Text></View>
        </View>
        {/* Positionen */}
        {pos.map((p, i) => (
          <View key={i} style={s.tableRow} wrap={false}>
            <View style={s.colPos}><Text style={[s.tableCell, { color: MUTED }]}>{i + 1}</Text></View>
            <View style={s.colDesc}><Text style={s.tableCell}>{p.beschreibung}</Text></View>
            <View style={s.colTyp}><Text style={s.tableCellMuted}>{p.typ === "material" ? "Material" : "Arbeit"}</Text></View>
            <View style={s.colMenge}><Text style={[s.tableCell, { textAlign: "right" }]}>{p.menge} {p.einheit}</Text></View>
            <View style={s.colPreis}><Text style={[s.tableCell, { textAlign: "right" }]}>{fc(p.preis)}</Text></View>
            <View style={s.colMwst}><Text style={[s.tableCell, { textAlign: "right" }]}>{Number(p.mwst)}%</Text></View>
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
            <View style={s.summaryRow}>
              <Text>Netto</Text><Text>{fc(nettoVR)}</Text>
            </View>
            {rechnung.rabatt > 0 && (
              <View style={[s.summaryRow, s.summaryRowRed]}>
                <Text>Rabatt ({rechnung.rabatt}%)</Text><Text>-{fc(rabattB)}</Text>
              </View>
            )}
            <View style={s.summaryRow}>
              <Text>MwSt</Text><Text>{fc(mwstB)}</Text>
            </View>
            <View style={s.summaryTotal}>
              <Text>Brutto</Text><Text>{fc(rechnung.gesamt)}</Text>
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
            {firma.logo ? (
              <Image src={firma.logo} style={{ maxHeight: 50, maxWidth: 160, marginBottom: 6, objectFit: "contain" }} />
            ) : null}
            <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 3 }}>{firma.name}</Text>
            <Text style={s.firmaDetail}>{firma.strasse || ""}, {firma.plz || ""} {firma.ort || ""}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 20, fontFamily: "Helvetica-Bold", color: farbe, textAlign: "right" }}>{label}</Text>
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
