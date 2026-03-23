"use client";
import type { Firma, Rechnung, Kunde } from "@/lib/db";
import { uid, fc, fd } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";
import { validateFirma } from "@/lib/dashboard-validation";
import { downloadPdf } from "@/lib/dashboard-pdf";

const STATUS_BADGE_MAP: Record<string, { cls: string; l: string }> = {
  offen:     { cls: "bg-warning-500/15 text-warning-500 border-warning-500/20", l: "Offen" },
  bezahlt:   { cls: "bg-success-500/15 text-success-500 border-success-500/20", l: "Bezahlt" },
  gemahnt:   { cls: "bg-danger-500/15 text-danger-500 border-danger-500/20",   l: "Gemahnt" },
  storniert: { cls: "bg-white/[0.06] text-slate-500 border-white/[0.08]",      l: "Storniert" },
  angebot:   { cls: "bg-brand-500/15 text-brand-400 border-brand-500/20",      l: "Angebot" },
};

function StatusBadge({ s }: { s: string }) {
  const variante = STATUS_BADGE_MAP[s] || STATUS_BADGE_MAP.offen;
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap border ${variante.cls}`}>{variante.l}</span>;
}

export default function DashboardOverview({ rechnungen, kunden, firma, nav, navNewDoc, updRe, addRe, addKu, nxtNr, plan, lim }: { rechnungen: Rechnung[]; kunden: Kunde[]; firma: Firma | null; nav: (pg: string, search?: string) => void; navNewDoc: (typ: "rechnung" | "angebot") => void; updRe: (id: string, up: Partial<Rechnung>) => void; addRe: (r: Rechnung) => Promise<void>; addKu: (k: Omit<Kunde, "id">) => Promise<Kunde>; nxtNr: () => string; plan: string; lim: { re: number; ku: number } }) {
  const paid = rechnungen.filter(r => r.status === "bezahlt");
  const offen = rechnungen.filter(r => r.status === "offen");
  const ueber = offen.filter(r => new Date(r.faelligDatum) < new Date());
  const firmaFehler = validateFirma(firma);
  const months = []; for (let i = 5; i >= 0; i--) { const d = new Date(); d.setMonth(d.getMonth() - i); months.push({ l: d.toLocaleDateString("de-DE", { month: "short" }), s: paid.filter(r => { const rd = new Date(r.datum); return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear(); }).reduce((s, r) => s + r.gesamt, 0), k: `${d.getFullYear()}-${d.getMonth()}` }); }
  const maxUmsatz = Math.max(...months.map(m => m.s), 1);
  const totalUmsatz = paid.reduce((s, r) => s + r.gesamt, 0);
  const offenSum = offen.reduce((s, r) => s + r.gesamt, 0);
  // Quartals-MwSt
  const now = new Date(); const quartal = Math.floor(now.getMonth() / 3); const qStart = new Date(now.getFullYear(), quartal * 3, 1); const qEnd = new Date(now.getFullYear(), quartal * 3 + 3, 0);
  const qPaid = paid.filter(r => { const d = new Date(r.datum); return d >= qStart && d <= qEnd; });
  const qNetto = qPaid.reduce((s, r) => s + (r.netto || 0), 0); const qMwst = qPaid.reduce((s, r) => s + (r.mwst || 0), 0);
  // Angebots-Follow-up
  const nowMs = now.getTime();
  const alteAngebote = rechnungen.filter(r => r.status === "angebot" && new Date(r.datum) < new Date(nowMs - 7 * 24 * 60 * 60 * 1000));
  // Leer-Zustand
  const isEmpty = rechnungen.length === 0 && kunden.length === 0;

  // Musterrechnung
  const loadMuster = async () => {
    const musterKunde = await addKu({ name: "Müller Haustechnik GmbH", strasse: "Industriestr. 42", plz: "70563", ort: "Stuttgart", email: "info@mueller-haustechnik.de", telefon: "0711 987654" });
    const heute = new Date().toISOString().split("T")[0];
    const faellig = new Date(); faellig.setDate(faellig.getDate() + 14);
    const mwstSatz = firma?.kleinunternehmer ? 0 : 19;
    const positionen = [
      { beschreibung: "Elektroinstallation Büro EG – 12 Doppelsteckdosen setzen, Kabel verlegen, Sicherungskasten anpassen", einheit: "Pauschal", menge: 1, preis: 1850, mwst: mwstSatz, typ: "arbeit" },
      { beschreibung: "Netzwerkverkabelung Cat7 inkl. Patchpanel", einheit: "Stk", menge: 12, preis: 45, mwst: mwstSatz, typ: "arbeit" },
      { beschreibung: "LED-Deckenleuchten (Philips CoreLine)", einheit: "Stk", menge: 8, preis: 89, mwst: mwstSatz, typ: "material" },
      { beschreibung: "Kabelkanäle weiss 60x40mm", einheit: "m", menge: 35, preis: 8.50, mwst: mwstSatz, typ: "material" },
      { beschreibung: "Kleinmaterial (Dübel, Schrauben, Klemmen)", einheit: "Pauschal", menge: 1, preis: 95, mwst: mwstSatz, typ: "material" },
      { beschreibung: "Anfahrt und Entsorgung", einheit: "Pauschal", menge: 1, preis: 65, mwst: mwstSatz, typ: "arbeit" },
    ];
    const netto = positionen.reduce((s, p) => s + p.menge * p.preis, 0);
    const mwst = positionen.reduce((s, p) => s + p.menge * p.preis * p.mwst / 100, 0);
    const re = {
      id: uid(), nummer: "", datum: heute, faelligDatum: faellig.toISOString().split("T")[0],
      kundeId: musterKunde.id, kundeName: musterKunde.name, kundeAdresse: `${musterKunde.strasse}, ${musterKunde.plz} ${musterKunde.ort}`, kundeEmail: musterKunde.email || "",
      positionen, netto, mwst, gesamt: netto + mwst, zahlungsziel: 14, notiz: "Leistungszeitraum: siehe Auftragsbestätigung AB-2026-003.\nZahlbar innerhalb 14 Tagen ohne Abzug.", status: "offen", gewerk: firma?.gewerk || "", rabatt: 0, zeitraumVon: "", zeitraumBis: "", typ: "rechnung",
    };
    await addRe(re as Rechnung);
    if (firma) downloadPdf(re as Rechnung, firma);
    nav("rechnungen");
  };

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Guten {now.getHours() < 12 ? "Morgen" : now.getHours() < 18 ? "Tag" : "Abend"}{firma?.inhaber ? `, ${firma.inhaber.split(" ")[0]}` : ""}</h1>
          <p className="text-[13px] text-slate-500 mt-1.5">{now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}{firma?.name ? ` · ${firma.name}` : ""}</p>
        </div>
        <div className="flex gap-2.5">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 font-medium" onClick={() => nav("rechnungen")}>{IC.euro} Rechnungen</button>
          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer whitespace-nowrap hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => nav("neue-rechnung")}>{IC.plus} Neue Rechnung</button>
        </div>
      </div>

      {firmaFehler.length > 0 && <div className="flex items-start gap-2.5 px-4 py-3 bg-warning-500/[0.06] border border-warning-500/20 rounded-xl mb-4 text-[13px] text-warning-500"><span className="flex text-warning-500 mt-0.5">{IC.shield}</span><div><strong>§14 UStG:</strong> {firmaFehler.join(", ")} fehlt. <button className="bg-transparent border-none text-brand-400 text-[13px] cursor-pointer p-0 font-medium hover:underline" onClick={() => nav("settings")}>Beheben →</button></div></div>}
      {plan === "free" && <div className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-brand-950/60 to-brand-900/40 border border-brand-500/20 rounded-xl mb-5 text-[13px] text-brand-200 flex-wrap backdrop-blur-sm">{IC.crown}<span><strong>Free</strong> – {lim.re} Rechnungen</span><button className="px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer ml-auto hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all" onClick={() => nav("abo")}>Upgraden</button></div>}

      {/* Empty state */}
      {isEmpty && (
        <div className="relative bg-gradient-to-br from-[#0c0c20] to-brand-950/40 rounded-2xl p-8 mb-5 border border-brand-500/15 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.08),transparent_70%)]" />
          <div className="text-center max-w-[460px] mx-auto relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 text-brand-400">{IC.star}</div>
            <h2 className="text-xl font-bold mb-2 tracking-tight">Willkommen bei RechnungsKI</h2>
            <p className="text-[14px] text-slate-400 leading-relaxed mb-6">Erstelle deine erste Rechnung in unter 2 Minuten.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              {[
                { l: "Kunde anlegen", ico: IC.users, pg: "kunden" },
                { l: "Erste Rechnung", ico: IC.doc, pg: "neue-rechnung" },
                { l: "Firmendaten prüfen", ico: IC.gear, pg: "settings" },
              ].map((a, i) => (
                <button key={i} onClick={() => nav(a.pg)} className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] font-medium cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.12] hover:translate-y-[-1px] transition-all duration-200">
                  <span className="opacity-50 flex">{a.ico}</span>{a.l}
                </button>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <button onClick={loadMuster} className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-dashed border-brand-500/30 rounded-xl text-brand-300 text-[13px] font-medium cursor-pointer mx-auto hover:bg-brand-500/[0.06] hover:border-brand-500/50 transition-all duration-200">
                {IC.eye} Musterrechnung laden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-3 mb-5">
        {[
          { l: "Umsatz", v: fc(totalUmsatz), s: `${paid.length} bezahlt`, c: "text-success-500", gc: "from-success-500/10 to-success-600/5", glow: "rgba(16,185,129,0.06)", ico: IC.euro, link: "rechnungen" },
          { l: "Offen", v: fc(offenSum), s: `${offen.length} Rechnungen`, c: "text-warning-500", gc: "from-warning-500/10 to-warning-600/5", glow: "rgba(245,158,11,0.06)", ico: IC.doc, link: "rechnungen" },
          { l: "Überfällig", v: ueber.length, s: ueber.length ? "Jetzt mahnen" : "Alles im Griff", c: "text-danger-500", gc: "from-danger-500/10 to-danger-600/5", glow: "rgba(239,68,68,0.06)", ico: IC.alert, link: "rechnungen" },
          { l: "Kunden", v: kunden.length, c: "text-brand-400", gc: "from-brand-500/10 to-brand-600/5", glow: "rgba(99,102,241,0.06)", s: "gespeichert", ico: IC.users, link: "kunden" },
        ].map((k, i) => (
          <button key={i} onClick={() => nav(k.link)} className={`group relative bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06] overflow-hidden hover:border-white/[0.1] hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 text-left w-full cursor-pointer`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${k.gc} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute top-3 right-3 opacity-[0.06] ${k.c}`}><svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">{k.ico.props.children}</svg></div>
            <div className="relative z-10">
              <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.1em]">{k.l}</div>
              <div className={`text-[24px] font-extrabold mt-1.5 tracking-tight ${k.l === "Überfällig" && ueber.length > 0 ? "text-danger-500" : ""}`}>{k.v}</div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">{k.s}<span className="opacity-0 group-hover:opacity-60 transition-opacity ml-auto text-slate-400">→</span></div>
            </div>
          </button>
        ))}
      </div>

      {/* Overdue alert */}
      {ueber.length > 0 && <div className="bg-danger-500/[0.04] border border-danger-500/15 rounded-2xl p-5 mb-5"><div className="flex items-center gap-2.5 mb-3 font-semibold text-[14px]"><span className="w-7 h-7 rounded-lg bg-danger-500/10 flex items-center justify-center text-danger-500">{IC.alert}</span>Überfällig ({ueber.length})</div>{ueber.map(r => <div key={r.id} className="flex items-center gap-3 py-2.5 text-[13px] flex-wrap border-b border-white/[0.04] last:border-0"><span className="font-semibold font-mono text-[11px] text-slate-400">{r.nummer}</span><span className="flex-1">{r.kundeName}</span><span className="font-semibold">{fc(r.gesamt)}</span><span className="text-[11px] text-danger-400 bg-danger-500/10 px-2 py-0.5 rounded-md font-medium">{Math.floor((nowMs - new Date(r.faelligDatum).getTime()) / 86400000)}d überfällig</span><button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium" onClick={() => nav("rechnungen", r.nummer)}>{IC.alert} Mahnen</button></div>)}</div>}

      {/* Chart + Recent */}
      <div className="grid grid-cols-[1.7fr_1fr] max-md:grid-cols-1 gap-3 mb-5">
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[14px] font-semibold">Umsatz (6 Monate)</h3>
            <span className="text-lg font-bold text-success-500">{fc(totalUmsatz)}</span>
          </div>
          <div className="flex items-end gap-2.5 h-[150px]">
            {months.map(m => (
              <div key={m.k} className="flex-1 flex flex-col items-center gap-1.5">
                {m.s > 0 && <span className="text-[9px] text-slate-500 font-medium">{m.s >= 1000 ? `${(m.s/1000).toFixed(1)}k` : fc(m.s)}</span>}
                <div className="w-full h-[120px] flex items-end">
                  <div className="w-full bg-gradient-to-t from-brand-600 via-brand-500 to-brand-400 rounded-t-md transition-[height] duration-700 ease-out min-h-[3px] relative overflow-hidden" style={{ height: `${Math.max(m.s / maxUmsatz * 100, 4)}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{m.l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
          <h3 className="text-[14px] font-semibold mb-4">Letzte Aktivität</h3>
          {rechnungen.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-600">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 opacity-40">{IC.doc}</div>
              <p className="text-[13px]">Noch keine Rechnungen</p>
              <button className="bg-transparent border-none text-brand-400 text-[13px] cursor-pointer p-0 mt-1.5 font-medium hover:underline" onClick={() => nav("neue-rechnung")}>Erste Rechnung erstellen →</button>
            </div>
          ) : [...rechnungen].reverse().slice(0, 5).map(r => (
            <button key={r.id} onClick={() => nav("rechnungen", r.nummer)} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0 group w-full text-left cursor-pointer bg-transparent hover:bg-white/[0.03] rounded-lg px-1.5 -mx-1.5 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-[11px] font-bold text-brand-400 shrink-0 border border-brand-500/10">{r.kundeName?.charAt(0)?.toUpperCase()}</div>
                <div><div className="font-semibold text-[13px] group-hover:text-white transition-colors">{r.kundeName}</div><div className="text-[11px] text-slate-500">{r.nummer} · {fd(r.datum)}</div></div>
              </div>
              <div className="text-right"><div className="font-semibold text-[13px]">{fc(r.gesamt)}</div><StatusBadge s={r.status} /></div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      {!isEmpty && <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-2.5 mb-5">
        {[
          { l: "Neue Rechnung", ico: IC.doc, action: () => navNewDoc("rechnung"), c: "text-brand-400" },
          { l: "Neues Angebot", ico: IC.eye, action: () => navNewDoc("angebot"), c: "text-purple-400" },
          { l: "Kunden", ico: IC.users, action: () => nav("kunden"), c: "text-blue-400" },
          { l: "DATEV Export", ico: IC.dl, action: () => nav("rechnungen"), c: "text-teal-400" },
        ].map((a, i) => (
          <button key={i} onClick={a.action} className="group flex items-center gap-2.5 px-4 py-3.5 bg-[#0a0a1a]/80 border border-white/[0.06] rounded-xl text-slate-200 text-[13px] font-medium cursor-pointer text-left hover:bg-white/[0.04] hover:border-white/[0.1] hover:translate-y-[-1px] transition-all duration-200">
            <span className={`${a.c} flex opacity-60 group-hover:opacity-100 transition-opacity`}>{a.ico}</span>{a.l}
          </button>
        ))}
      </div>}

      {/* Old offers */}
      {alteAngebote.length > 0 && <div className="bg-brand-500/[0.04] border border-brand-500/15 rounded-2xl p-5 mb-5"><div className="flex items-center gap-2.5 mb-3 font-semibold text-[14px]"><span className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">{IC.eye}</span>Angebote ohne Antwort ({alteAngebote.length})</div>{alteAngebote.map(r => <div key={r.id} className="flex items-center gap-3 py-2.5 text-[13px] flex-wrap border-b border-white/[0.04] last:border-0"><span className="font-semibold font-mono text-[11px] text-slate-400">{r.nummer}</span><span className="flex-1">{r.kundeName}</span><span className="font-semibold">{fc(r.gesamt)}</span><span className="opacity-50 text-[11px]">{Math.floor((nowMs - new Date(r.datum).getTime()) / 86400000)} Tage</span><button className="flex items-center gap-1.5 px-3 py-1.5 bg-success-500/10 text-success-400 border border-success-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-success-500/15 transition-all" onClick={() => { updRe(r.id, { status: "offen", typ: "rechnung", nummer: nxtNr() }); }}>→ Rechnung</button><button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-white/[0.08] transition-all" onClick={() => updRe(r.id, { status: "storniert" })}>Ablehnen</button></div>)}</div>}

      {/* Quarterly tax */}
      {!firma?.kleinunternehmer && (qNetto > 0 || qMwst > 0) && (
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06] mb-5">
          <h3 className="text-[14px] font-semibold mb-4">Q{quartal + 1}/{now.getFullYear()} – Steuerübersicht</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
            <div className="p-2.5 sm:p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] min-w-0">
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.08em] font-medium truncate">Nettoumsatz</div>
              <div className="text-[13px] sm:text-[22px] font-extrabold mt-1 sm:mt-1.5 tracking-tight truncate">{fc(qNetto)}</div>
            </div>
            <div className="p-2.5 sm:p-4 bg-danger-500/[0.03] rounded-xl border border-danger-500/10 min-w-0">
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.08em] font-medium truncate">MwSt-Schuld</div>
              <div className="text-[13px] sm:text-[22px] font-extrabold mt-1 sm:mt-1.5 text-danger-400 tracking-tight truncate">{fc(qMwst)}</div>
            </div>
            <div className="p-2.5 sm:p-4 bg-success-500/[0.03] rounded-xl border border-success-500/10 min-w-0">
              <div className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.08em] font-medium truncate">Brutto</div>
              <div className="text-[13px] sm:text-[22px] font-extrabold mt-1 sm:mt-1.5 text-success-400 tracking-tight truncate">{fc(qNetto + qMwst)}</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">Nur bezahlte Rechnungen · {qStart.toLocaleDateString("de-DE")} – {qEnd.toLocaleDateString("de-DE")}</p>
        </div>
      )}

    </div>
  );
}
