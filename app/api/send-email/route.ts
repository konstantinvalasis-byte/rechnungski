import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// ═══════════════════════════════════════════════════════════
// E-MAIL API — RechnungsKI
// POST /api/send-email
// ═══════════════════════════════════════════════════════════

function formatAmount(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

function formatDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function createEmailHtml(
  type: string,
  data: {
    firmaName: string;
    kundeName: string;
    rechnungNummer: string;
    gesamt: number;
    faelligDatum: string;
    mahnStufe?: number;
  }
): string {
  const { firmaName, kundeName, rechnungNummer, gesamt, faelligDatum, mahnStufe } = data;

  const tableStyle = `width:100%;border-collapse:collapse;margin:24px 0;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;`;
  const trEven = `background:#f8fafc;`;
  const td1 = `padding:12px 16px;font-weight:600;color:#64748b;font-size:14px;border-bottom:1px solid #e2e8f0;`;
  const td2 = `padding:12px 16px;font-size:14px;border-bottom:1px solid #e2e8f0;`;

  const footer = `
    <hr style="margin-top:40px;border:none;border-top:1px solid #e2e8f0;">
    <p style="font-size:12px;color:#94a3b8;margin-top:16px;">
      Diese E-Mail wurde über <strong>RechnungsKI</strong> versendet.
    </p>
  `;

  if (type === "mahnung") {
    const stufen: Record<number, string> = { 1: "erste", 2: "zweite", 3: "dritte" };
    const stufeText = stufen[mahnStufe ?? 1] ?? "erste";
    const headerColor = mahnStufe === 3 ? "#dc2626" : mahnStufe === 2 ? "#f97316" : "#f59e0b";

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff;">
  <div style="background:${headerColor};border-radius:10px;padding:20px 24px;margin-bottom:28px;">
    <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.8);">${stufeText.toUpperCase()} ZAHLUNGSERINNERUNG</p>
    <h1 style="margin:4px 0 0;font-size:22px;color:#ffffff;">${rechnungNummer}</h1>
  </div>

  <p style="line-height:1.7;">Sehr geehrte Damen und Herren,</p>
  <p style="line-height:1.7;">trotz unserer vorherigen ${mahnStufe && mahnStufe > 1 ? "Mahnungen" : "Rechnung"} ist der folgende Betrag noch nicht auf unserem Konto eingegangen:</p>

  <table style="${tableStyle}">
    <tr style="${trEven}"><td style="${td1}">Rechnungsnummer</td><td style="${td2}">${rechnungNummer}</td></tr>
    <tr><td style="${td1}">Rechnungsempfänger</td><td style="${td2}">${kundeName}</td></tr>
    <tr style="${trEven}"><td style="${td1}">Offener Betrag</td><td style="${td2}"><strong style="color:${headerColor};font-size:16px;">${formatAmount(gesamt)}</strong></td></tr>
    <tr><td style="${td1}">Ursprüngliches Zahlungsziel</td><td style="${td2}">${formatDate(faelligDatum)}</td></tr>
  </table>

  <p style="line-height:1.7;">Wir bitten Sie, den ausstehenden Betrag innerhalb von <strong>7 Tagen</strong> auf das Ihnen bekannte Konto zu überweisen.</p>
  <p style="line-height:1.7;">Falls Sie die Zahlung bereits veranlasst haben, bitten wir Sie, dieses Schreiben als gegenstandslos zu betrachten.</p>

  <p style="line-height:1.7;">Mit freundlichen Grüßen<br><strong>${firmaName}</strong></p>
  ${footer}
</body></html>`;
  }

  const isAngebot = type === "angebot";
  const docLabel = isAngebot ? "Angebot" : "Rechnung";
  const numLabel = isAngebot ? "Angebotsnummer" : "Rechnungsnummer";

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,Helvetica,sans-serif;color:#1e293b;max-width:600px;margin:0 auto;padding:40px 24px;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);border-radius:10px;padding:20px 24px;margin-bottom:28px;">
    <p style="margin:0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.7);">${docLabel.toUpperCase()}</p>
    <h1 style="margin:4px 0 0;font-size:22px;color:#ffffff;">${rechnungNummer}</h1>
  </div>

  <p style="line-height:1.7;">Sehr geehrte Damen und Herren,</p>
  <p style="line-height:1.7;">anbei ${isAngebot ? "unser Angebot" : "unsere Rechnung"} als PDF-Anhang.</p>

  <table style="${tableStyle}">
    <tr style="${trEven}"><td style="${td1}">${numLabel}</td><td style="${td2}">${rechnungNummer}</td></tr>
    <tr><td style="${td1}">Empfänger</td><td style="${td2}">${kundeName}</td></tr>
    <tr style="${trEven}"><td style="${td1}">Gesamtbetrag</td><td style="${td2}"><strong style="font-size:16px;">${formatAmount(gesamt)}</strong></td></tr>
    ${!isAngebot ? `<tr><td style="${td1}">Zahlungsziel</td><td style="${td2}">${formatDate(faelligDatum)}</td></tr>` : ""}
  </table>

  ${isAngebot
    ? `<p style="line-height:1.7;">Wir freuen uns auf Ihre Rückmeldung und stehen für Rückfragen gerne zur Verfügung.</p>`
    : `<p style="line-height:1.7;">Bitte überweisen Sie den Betrag bis zum <strong>${formatDate(faelligDatum)}</strong> auf das Ihnen bekannte Konto. Vielen Dank!</p>`
  }

  <p style="line-height:1.7;">Mit freundlichen Grüßen<br><strong>${firmaName}</strong></p>
  ${footer}
</body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      to,
      ccSelf,
      firmaEmail,
      subject,
      type,
      rechnungNummer,
      kundeName,
      gesamt,
      faelligDatum,
      firmaName,
      mahnStufe,
      pdfBase64,
      pdfName,
    } = body;

    // Validation
    if (!to || !pdfBase64 || !rechnungNummer) {
      return NextResponse.json({ error: "Pflichtfelder fehlen (to, pdfBase64, rechnungNummer)" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "E-Mail-Dienst nicht konfiguriert. Bitte RESEND_API_KEY in .env.local setzen." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlBody = createEmailHtml(type ?? "rechnung", {
      firmaName: firmaName ?? "Ihr Absender",
      kundeName: kundeName ?? "",
      rechnungNummer,
      gesamt: gesamt ?? 0,
      faelligDatum: faelligDatum ?? "",
      mahnStufe,
    });

    const autoSubject = type === "angebot"
      ? `Angebot ${rechnungNummer} von ${firmaName}`
      : type === "mahnung"
      ? `${mahnStufe}. Mahnung zu Rechnung ${rechnungNummer} – ${firmaName}`
      : `Rechnung ${rechnungNummer} von ${firmaName}`;

    const cc = ccSelf && firmaEmail ? [firmaEmail] : undefined;

    const fromDomain = process.env.RESEND_FROM_DOMAIN ?? "rechnungski.de";
    const fromName = firmaName ?? "RechnungsKI";

    const { data, error } = await resend.emails.send({
      from: `${fromName} <noreply@${fromDomain}>`,
      to: [to],
      cc,
      subject: subject || autoSubject,
      html: htmlBody,
      attachments: [
        {
          filename: pdfName ?? `${rechnungNummer}.pdf`,
          content: Buffer.from(pdfBase64, "base64"),
        },
      ],
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
