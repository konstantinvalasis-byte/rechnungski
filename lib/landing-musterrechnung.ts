// Musterrechnung HTML für Landing-Page-Vorschau

import { he, fc } from "@/lib/dashboard-utils";

export function getMusterRechnungHtml(): string {
  const pos = [
    { beschreibung: "Elektroinstallation – Stundenlohn", typ: "arbeit", menge: 8, einheit: "Std", preis: 85, mwst: 19 },
    { beschreibung: "Wanddose & Schalterdose montieren", typ: "arbeit", menge: 3, einheit: "Stk", preis: 45, mwst: 19 },
    { beschreibung: "LED-Einbaustrahler (dimmbar)", typ: "material", menge: 12, einheit: "Stk", preis: 28, mwst: 19 },
    { beschreibung: "Installationskabel NYM-J 3\u00d71,5mm\u00b2", typ: "material", menge: 25, einheit: "m", preis: 3.2, mwst: 19 },
    { beschreibung: "Sicherungsautomat B16", typ: "material", menge: 4, einheit: "Stk", preis: 22, mwst: 19 },
  ];

  const arbeit = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const mat = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);
  const netto = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const mwstB = pos.reduce((s, p) => s + p.menge * p.preis * p.mwst / 100, 0);
  const brutto = netto + mwstB;

  const rows = pos.map((p, i) => `
    <tr>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;color:#666">${i + 1}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;font-weight:500">${he(p.beschreibung)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:10px;color:#888">${p.typ === "material" ? "Material" : "Arbeit"}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${p.menge} ${he(p.einheit)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${fc(p.preis)}</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right">${p.mwst}%</td>
      <td style="padding:7px 8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-weight:600">${fc(p.menge * p.preis)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#111;padding:40px 48px;font-size:13px;line-height:1.5;background:#fff}
    @media print{body{padding:30px 36px}@page{margin:15mm 12mm;size:A4}}
    table{width:100%;border-collapse:collapse}
    .sum-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px}
    .sum-total{font-size:18px;font-weight:700;border-top:2px solid #111;padding-top:8px;margin-top:4px}
  </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px">
      <div>
        <div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);display:inline-flex;align-items:center;justify-content:center;margin-bottom:10px">
          <span style="color:#fff;font-weight:800;font-size:13px;font-family:sans-serif">ME</span>
        </div>
        <div style="font-size:17px;font-weight:700">Müller Elektrotechnik</div>
        <div style="font-size:11px;color:#666">Hans Müller · Schillerstraße 18<br>80336 München</div>
        <div style="font-size:11px;color:#666;margin-top:2px">Tel: +49 89 123456</div>
        <div style="font-size:11px;color:#666">info@mueller-elektro.de</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:24px;font-weight:800;color:#4f46e5;text-transform:uppercase">Rechnung</div>
        <div style="font-size:12px;color:#666;margin-top:4px">Nr. RE-2026-0047</div>
        <div style="font-size:12px;color:#666">Datum: 10.03.2026</div>
        <div style="font-size:12px;color:#666">Fällig: 24.03.2026</div>
        <div style="font-size:11px;color:#666;margin-top:4px">Leistungszeitraum: 06.03.2026\u2013 10.03.2026</div>
      </div>
    </div>
    <div style="background:#f8f9fa;border-radius:6px;padding:14px;margin-bottom:24px">
      <div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">Rechnungsempfänger</div>
      <div style="font-weight:600">Weber Hausverwaltung GmbH</div>
      <div style="font-size:12px;color:#666">Maximilianstraße 42<br>80538 München</div>
    </div>
    <table style="margin-bottom:22px">
      <thead><tr style="border-bottom:2px solid #e5e7eb">
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:left">Pos</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:left">Beschreibung</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:left">Typ</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">Menge</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">Preis</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">MwSt</th>
        <th style="padding:7px 8px;font-size:10px;font-weight:600;color:#999;text-transform:uppercase;text-align:right">Summe</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="display:flex;justify-content:flex-end">
      <div style="width:280px">
        <div class="sum-row" style="font-size:12px;color:#666"><span>Arbeitskosten</span><span>${fc(arbeit)}</span></div>
        <div class="sum-row" style="font-size:12px;color:#666"><span>Materialkosten</span><span>${fc(mat)}</span></div>
        <div class="sum-row"><span>Netto</span><span>${fc(netto)}</span></div>
        <div class="sum-row"><span>MwSt (19 %)</span><span>${fc(mwstB)}</span></div>
        <div class="sum-row sum-total"><span>Brutto</span><span>${fc(brutto)}</span></div>
      </div>
    </div>
    <div style="margin-top:18px;padding:10px 14px;background:#f8f9fa;border-radius:5px;font-size:11px;color:#666">
      <strong>Hinweis:</strong> Bitte überweisen Sie den Betrag bis zum 24.03.2026 auf unser Konto. Vielen Dank für Ihren Auftrag!
    </div>
    <div style="margin-top:28px;padding-top:14px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#999">
      <span>Sparkasse München · IBAN: DE89 3704 0044 0532 0130 00</span>
      <span>St.Nr: 143/234/56789 · USt-ID: DE287654321</span>
    </div>
  </body></html>`;
}

export const MUSTER_HTML = getMusterRechnungHtml();
