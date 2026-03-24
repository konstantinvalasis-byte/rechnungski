"use client";
import FadeIn from "@/components/ui/FadeIn";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PartialIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

type CellValue = "yes" | "no" | "partial" | string;

interface Row {
  feature: string;
  rechnungski: CellValue;
  sevdesk: CellValue;
  lexoffice: CellValue;
  note?: string;
}

const ROWS: Row[] = [
  {
    feature: "Preis (Einsteiger-Plan)",
    rechnungski: "7,90 €/Mo",
    sevdesk: "19,90 €/Mo",
    lexoffice: "14,90 €/Mo",
    note: "Günstigster Einstieg",
  },
  {
    feature: "KI-Preisvorschläge pro Branche",
    rechnungski: "yes",
    sevdesk: "no",
    lexoffice: "no",
    note: "Alleinstellungsmerkmal",
  },
  {
    feature: "§14 UStG Validierung",
    rechnungski: "yes",
    sevdesk: "yes",
    lexoffice: "yes",
  },
  {
    feature: "Kleinunternehmer §19 UStG",
    rechnungski: "yes",
    sevdesk: "partial",
    lexoffice: "partial",
  },
  {
    feature: "Setup-Zeit bis erste Rechnung",
    rechnungski: "~2 Min",
    sevdesk: "~30 Min",
    lexoffice: "~20 Min",
  },
  {
    feature: "DATEV CSV-Export",
    rechnungski: "yes",
    sevdesk: "yes",
    lexoffice: "yes",
  },
  {
    feature: "Mahnwesen (3-stufig)",
    rechnungski: "yes",
    sevdesk: "yes",
    lexoffice: "yes",
  },
  {
    feature: "Mobile App / vollständig responsiv",
    rechnungski: "yes",
    sevdesk: "partial",
    lexoffice: "partial",
  },
  {
    feature: "Kostenloser Plan verfügbar",
    rechnungski: "yes",
    sevdesk: "no",
    lexoffice: "no",
  },
  {
    feature: "Daten in EU (DSGVO)",
    rechnungski: "yes",
    sevdesk: "yes",
    lexoffice: "yes",
  },
];

function Cell({ value, isHighlighted }: { value: CellValue; isHighlighted?: boolean }) {
  if (value === "yes") {
    return (
      <div className="flex justify-center">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center ${isHighlighted ? "bg-brand-600 shadow-md shadow-brand-600/25" : "bg-success-100"}`}>
          <CheckIcon className={`w-3.5 h-3.5 ${isHighlighted ? "text-white" : "text-success-600"}`} />
        </span>
      </div>
    );
  }
  if (value === "no") {
    return (
      <div className="flex justify-center">
        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
          <XIcon className="w-3.5 h-3.5 text-slate-300" />
        </span>
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="flex justify-center">
        <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
          <PartialIcon className="w-3.5 h-3.5 text-amber-400" />
        </span>
      </div>
    );
  }
  return (
    <div className={`text-center text-xs font-semibold ${isHighlighted ? "text-brand-700" : "text-slate-500"}`}>
      {value}
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <FadeIn className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">
            Direkter Vergleich
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Warum nicht sevDesk oder Lexoffice?
          </h2>
          <p className="mt-3 text-slate-500 text-sm max-w-xl mx-auto">
            Gute Frage — hier ist die ehrliche Antwort, Punkt für Punkt.
          </p>
        </div>

        {/* Tabelle */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm shadow-slate-100">
          <table className="w-full text-sm">
            {/* Kopfzeile */}
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold text-slate-500 text-xs w-[40%]">Kriterium</th>
                <th className="p-4 text-center w-[20%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">RechnungsKI</span>
                    <span className="text-[10px] text-slate-400 font-normal">ab 0 €/Mo</span>
                  </div>
                </th>
                <th className="p-4 text-center w-[20%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">sevDesk</span>
                    <span className="text-[10px] text-slate-400 font-normal">ab 19,90 €/Mo</span>
                  </div>
                </th>
                <th className="p-4 text-center w-[20%]">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Lexoffice</span>
                    <span className="text-[10px] text-slate-400 font-normal">ab 14,90 €/Mo</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                >
                  {/* Feature-Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-medium text-xs leading-snug">{row.feature}</span>
                      {row.note && (
                        <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 border border-brand-100 shrink-0">
                          {row.note}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* RechnungsKI — highlighted */}
                  <td className="p-4 bg-brand-50/60">
                    <Cell value={row.rechnungski} isHighlighted />
                  </td>

                  {/* sevDesk */}
                  <td className="p-4">
                    <Cell value={row.sevdesk} />
                  </td>

                  {/* Lexoffice */}
                  <td className="p-4">
                    <Cell value={row.lexoffice} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legende */}
        <div className="mt-5 flex flex-wrap items-center gap-5 justify-center text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center">
              <CheckIcon className="w-2.5 h-2.5 text-white" />
            </span>
            Vollständig verfügbar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <PartialIcon className="w-2.5 h-2.5 text-amber-400" />
            </span>
            Eingeschränkt / Aufpreis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
              <XIcon className="w-2.5 h-2.5 text-slate-300" />
            </span>
            Nicht verfügbar
          </span>
        </div>

        {/* Fazit */}
        <div className="mt-8 bg-slate-950 rounded-2xl p-6 text-center">
          <p className="text-slate-300 text-sm leading-relaxed">
            sevDesk und Lexoffice sind solide Tools — für Buchhalter.{" "}
            <span className="text-white font-semibold">
              RechnungsKI ist gebaut für Handwerker und Freelancer: schneller, günstiger, mit KI-Unterstützung.
            </span>
          </p>
          <a
            href="/registrieren"
            className="inline-flex items-center gap-2 mt-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-brand-600/25"
          >
            Kostenlos starten
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </FadeIn>
  );
}
