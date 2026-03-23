"use client";
import { useState } from "react";
import type { Firma, Kunde, Rechnung, WiederkehrendItem } from "@/lib/db";
import { fc, fd } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";

export default function WiederkehrendPage({ wiederkehrend, addWdk, updWdk, delWdk, kunden, rechnungen, firma }: { wiederkehrend: WiederkehrendItem[]; addWdk: (w: Omit<WiederkehrendItem, "id">) => void; updWdk: (id: string, up: Partial<WiederkehrendItem>) => void; delWdk: (id: string) => void; kunden: Kunde[]; rechnungen: Rechnung[]; firma: Firma | null }) {
  const [showForm, setShowForm] = useState(false);
  const emptyForm: Omit<WiederkehrendItem, "id"> = { name: "", kundeId: "", kundeName: "", kundeAdresse: "", kundeEmail: "", positionen: [], zahlungsziel: 14, notiz: "", gewerk: "", rabatt: 0, netto: 0, mwst: 0, gesamt: 0, interval: "monatlich", nextDue: new Date(new Date().setMonth(new Date().getMonth()+1)).toISOString().split("T")[0], aktiv: true };
  const [form, setForm] = useState<Omit<WiederkehrendItem, "id">>(emptyForm);
  const [kS, setKS] = useState(""); const [selK, setSelK] = useState<Kunde | null>(null);
  const fK = kunden.filter(k => k.name.toLowerCase().includes(kS.toLowerCase()));

  const calcFromRe = (reId: string) => {
    const re = rechnungen.find(r => r.id === reId);
    if (!re) return;
    const k = kunden.find(k => k.id === re.kundeId);
    setForm(prev => ({ ...prev, kundeId: re.kundeId, kundeName: re.kundeName, kundeAdresse: re.kundeAdresse, kundeEmail: re.kundeEmail || "", positionen: re.positionen, zahlungsziel: re.zahlungsziel, notiz: re.notiz || "", gewerk: re.gewerk || "", rabatt: re.rabatt || 0, netto: re.netto, mwst: re.mwst, gesamt: re.gesamt, name: `${re.kundeName} – ${re.gewerk || "Wiederkehrend"}` }));
    if (k) setSelK(k);
  };

  const doAdd = () => {
    if (!form.name || !form.kundeName || form.positionen.length === 0) return;
    addWdk(form); setShowForm(false); setForm(emptyForm); setSelK(null); setKS("");
  };

  const intervals: Record<string, string> = { monatlich: "Monatlich", quartal: "Quartal", jaehrlich: "Jährlich" };

  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const sel = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none cursor-pointer";
  const lbl = "text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5"><div><h1 className="text-xl font-bold tracking-tight">Wiederkehrende Rechnungen</h1><p className="text-[13px] text-slate-500 mt-1">Automatisch erstellt wenn fällig</p></div><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => setShowForm(!showForm)}>{IC.plus} Neue Vorlage</button></div>

      {showForm && <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06] mb-5">
        <h3 className="text-[14px] font-semibold mb-4">Neue Vorlage</h3>
        <div className="flex flex-col gap-3 max-w-[500px]">
          <div><label className={lbl}>Name der Vorlage *</label><input className={inp} placeholder="z.B. Müller GmbH – Wartung" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={lbl}>Aus vorhandener Rechnung übernehmen</label><select className={sel} onChange={e => e.target.value && calcFromRe(e.target.value)}><option value="">– Manuell eingeben –</option>{rechnungen.filter(r => r.status !== "storniert").map(r => <option key={r.id} value={r.id}>{r.nummer} – {r.kundeName} ({fc(r.gesamt)})</option>)}</select></div>
          <div><label className={lbl}>Kunde *</label>
            {!selK ? <><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span><input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={kS} onChange={e => setKS(e.target.value)} /></div>
              {kS && fK.length > 0 && <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl mt-1.5 max-h-[140px] overflow-y-auto">{fK.map(k => <button key={k.id} className="flex flex-col gap-px py-2 px-3 bg-transparent border-none text-slate-200 cursor-pointer w-full text-left border-b border-white/[0.04] text-[13px] hover:bg-white/[0.04] transition-colors" onClick={() => { setSelK(k); setForm({...form, kundeId: k.id, kundeName: k.name, kundeAdresse: [k.strasse, [k.plz, k.ort].filter(Boolean).join(" ")].filter(Boolean).join(", "), kundeEmail: k.email || ""}); setKS(""); }}><strong>{k.name}</strong></button>)}</div>}</>
              : <div className="flex justify-between items-center bg-brand-500/[0.06] border border-brand-500/15 rounded-xl py-2.5 px-3 mt-1.5"><div><strong>{selK.name}</strong></div><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-lg hover:bg-white/[0.05] transition-colors" onClick={() => { setSelK(null); setForm({...form, kundeId: "", kundeName: ""}); }}>✕</button></div>}
          </div>
          <div className="flex gap-3">
            <div className="flex-1"><label className={lbl}>Intervall</label><select className={sel} value={form.interval} onChange={e => setForm({...form, interval: e.target.value as "monatlich" | "quartal" | "jaehrlich"})}><option value="monatlich">Monatlich</option><option value="quartal">Quartal</option><option value="jaehrlich">Jährlich</option></select></div>
            <div className="flex-1"><label className={lbl}>Erste Fälligkeit</label><input type="date" className={inp} value={form.nextDue} onChange={e => setForm({...form, nextDue: e.target.value})} /></div>
          </div>
          {form.positionen.length > 0 && <div className="text-[13px] text-slate-400 py-2.5 px-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">{form.positionen.length} Position(en) übernommen · {fc(form.gesamt)}</div>}
          {form.positionen.length === 0 && form.kundeName && <p className="text-[12px] text-warning-500 -mt-1">Bitte Positionen über „Aus vorhandener Rechnung übernehmen" hinzufügen.</p>}
          <div className="flex gap-2"><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all disabled:opacity-40 disabled:cursor-not-allowed" disabled={!form.name || !form.kundeName || form.positionen.length === 0} onClick={doAdd}>Speichern</button><button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setShowForm(false)}>Abbrechen</button></div>
        </div>
      </div>}

      {wiederkehrend.length === 0 && !showForm ? <div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-2xl">🔄</div><h2 className="text-lg font-bold">Noch keine Vorlagen</h2><p className="text-[13px] text-slate-500 mt-2 max-w-[400px] leading-relaxed">Erstelle Vorlagen für Wartungsverträge, monatliche Retainer oder Abonnements.</p></div> :
        <div className="flex flex-col gap-3">
          {wiederkehrend.map(w => <div key={w.id} className={`bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06] flex gap-3 items-center hover:border-white/[0.1] transition-all max-md:flex-wrap ${w.aktiv ? "" : "opacity-40"}`}>
            <div className="flex-1 min-w-0"><div className="font-semibold text-[14px] truncate">{w.name}</div><div className="text-[13px] text-slate-500 mt-0.5">{w.kundeName} · {intervals[w.interval]} · Nächste: {fd(w.nextDue)}</div></div>
            <div className="flex items-center gap-3 max-md:w-full max-md:justify-between">
              <div className="font-extrabold text-[16px] whitespace-nowrap">{fc(w.gesamt)}</div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => updWdk(w.id, { aktiv: !w.aktiv })}>{w.aktiv ? "Pausieren" : "Aktivieren"}</button>
                <button className="px-2.5 py-2 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer hover:bg-danger-500/15 transition-all" onClick={() => delWdk(w.id)}>{IC.trash}</button>
              </div>
            </div>
          </div>)}
        </div>}
    </div>
  );
}
