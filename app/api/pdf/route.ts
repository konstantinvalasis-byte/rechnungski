// Server-seitige PDF-Generierung mit @react-pdf/renderer

import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { RechnungPdf, MahnungPdf } from "@/lib/pdf-rechnung";
import type { Firma, Rechnung } from "@/lib/db";
import { generiereERechnungXml } from "@/lib/erechnung-xml";
import { betteXmlEin } from "@/lib/erechnung-embed";
import { erstelleGiroCodeDataUrl } from "@/lib/girocode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rechnung, firma, typ, mahnStufe, format } = body as {
      rechnung: Rechnung;
      firma: Firma;
      typ: "rechnung" | "mahnung";
      mahnStufe?: number;
      format?: "pdf" | "zugferd" | "xrechnung";
    };

    if (!rechnung || !firma) {
      return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 });
    }

    // XRechnung: nur XML zurückgeben
    if (format === "xrechnung") {
      const xml = generiereERechnungXml(rechnung, firma, "xrechnung");
      const dateiname = `${rechnung.nummer || "xrechnung"}.xml`.replace(/[^a-zA-Z0-9._-]/g, "_");
      return new NextResponse(xml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="${dateiname}"`,
        },
      });
    }

    // GiroCode nur für Rechnungen mit IBAN generieren (nicht für Angebote/Mahnungen)
    let giroCodeUrl: string | undefined;
    if (typ === "rechnung" && rechnung.typ !== "angebot" && firma.iban) {
      giroCodeUrl = await erstelleGiroCodeDataUrl({
        empfaengerName: firma.inhaber || firma.name,
        iban: firma.iban,
        bic: firma.bic,
        betrag: rechnung.gesamt,
        verwendungszweck: rechnung.nummer,
      });
    }

    // PDF generieren (für plain PDF und ZUGFeRD)
    const doc =
      typ === "mahnung"
        ? React.createElement(MahnungPdf, { rechnung, firma, stufe: mahnStufe ?? 1 })
        : React.createElement(RechnungPdf, { rechnung, firma, giroCodeUrl });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let buffer: Buffer = await renderToBuffer(doc as any);

    // ZUGFeRD: XML in PDF einbetten
    if (format === "zugferd") {
      const xml = generiereERechnungXml(rechnung, firma, "zugferd");
      buffer = await betteXmlEin(buffer, xml, "zugferd");
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PDF-Generierung fehlgeschlagen:", err);
    return NextResponse.json({ error: msg || "PDF-Generierung fehlgeschlagen" }, { status: 500 });
  }
}
