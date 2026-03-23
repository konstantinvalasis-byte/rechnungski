"use client";
import { useState, useEffect, useRef } from "react";
import type { Firma, Rechnung, Kunde, FavoritItem, Position } from "@/lib/db";
import { uid, fc } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";
import { BRANCHEN_KATEGORIEN, GV } from "@/lib/dashboard-data";
import { validateRechnung } from "@/lib/dashboard-validation";
import { openAsPdf } from "@/lib/dashboard-pdf";

export default function NeueRechnung({ firma, kunden, addKu, addRe, updRe, nextNr, nextAnNr, nav, plan, lim: _lim, canCreate, editRechnung, onEditDone, favoriten = [], addFav, delFav, initDocTyp = "rechnung" }: { firma: Firma | null; kunden: Kunde[]; addKu: (k: Omit<Kunde, "id">) => Promise<Kunde>; addRe: (r: Rechnung) => Promise<void>; updRe: (id: string, up: Partial<Rechnung>) => void; nextNr: string; nextAnNr: string; nav: (pg: string) => void; plan: string; lim: { re: number; ku: number }; canCreate: boolean; editRechnung: Rechnung | null; onEditDone?: () => void; favoriten?: FavoritItem[]; addFav: (v: Omit<FavoritItem, "id">) => void; delFav: (id: string) => void; initDocTyp?: string }) {
  // Im Free-Plan kein Logo auf PDFs
  const firmaForPdf = firma && plan === "free" ? { ...firma, logo: "" } : firma;
  const [gw, setGw] = useState(firma?.gewerk || "");
  const [sonstigesGw, setSonstigesGw] = useState(() => { const g = firma?.gewerk || ""; return !!g && !Object.values(BRANCHEN_KATEGORIEN).flat().includes(g); });
  const [kS, setKS] = useState(""); const [selK, setSelK] = useState<Kunde | null>(null); const [showKD, setShowKD] = useState(false);
  const [neuK, setNeuK] = useState({ name: "", strasse: "", plz: "", ort: "", email: "" }); const [showN, setShowN] = useState(false);
  const kRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position[]>([]); const [ziel, setZiel] = useState(14); const [notiz, setNotiz] = useState("");
  const [showV, setShowV] = useState(false); const [saving, setSaving] = useState(false);
  const [rabatt, setRabatt] = useState(0); const [typ, setTyp] = useState(initDocTyp || "rechnung");
  const [datum, setDatum] = useState(new Date().toISOString().split("T")[0]);
  const [zvon, setZvon] = useState(""); const [zbis, setZbis] = useState(""); const [valE, setValE] = useState<string[]>([]);
  const zbisRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editRechnung) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setGw(editRechnung.gewerk || "");
    setSonstigesGw(!!(editRechnung.gewerk && !Object.values(BRANCHEN_KATEGORIEN).flat().includes(editRechnung.gewerk)));
    setPos(editRechnung.positionen || []);
    setZiel(editRechnung.zahlungsziel || 14);
    setNotiz(editRechnung.notiz || "");
    setRabatt(editRechnung.rabatt || 0);
    setTyp(editRechnung.typ === "angebot" ? "angebot" : "rechnung");
    setDatum(editRechnung.datum || new Date().toISOString().split("T")[0]);
    setZvon(editRechnung.zeitraumVon || "");
    setZbis(editRechnung.zeitraumBis || "");
    const k = kunden.find(k => k.id === editRechnung.kundeId);
    if (k) setSelK(k);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [editRechnung, kunden]);

  // Dropdown bei Klick außerhalb schließen
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (kRef.current && !kRef.current.contains(e.target as Node)) setShowKD(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fK = kS ? kunden.filter(k => k.name.toLowerCase().includes(kS.toLowerCase())) : kunden;
  const addP = (p: Partial<Position> & { beschreibung: string; einheit: string; preis: number; typ?: "arbeit" | "material" }) => setPos([...pos, { beschreibung: p.beschreibung, einheit: p.einheit, preis: p.preis, typ: p.typ || "arbeit", id: uid(), menge: p.menge || 1, mwst: firma?.kleinunternehmer ? 0 : (p.mwst ?? 19) }]);
  const updP = (pid: string, f: string, v: string | number) => setPos(pos.map(p => p.id === pid ? { ...p, [f]: v } : p));
  const rmP = (pid: string) => setPos(pos.filter(p => p.id !== pid));
  const netto = pos.reduce((s, p) => s + p.menge * p.preis, 0);
  const rabattB = netto * rabatt / 100; const nettoNR = netto - rabattB;
  const mwstB = pos.reduce((s, p) => s + p.menge * p.preis * (1 - rabatt / 100) * p.mwst / 100, 0);
  const brutto = nettoNR + mwstB;
  const arbS = pos.filter(p => p.typ === "arbeit").reduce((s, p) => s + p.menge * p.preis, 0);
  const matS = pos.filter(p => p.typ === "material").reduce((s, p) => s + p.menge * p.preis, 0);

  const doSave = async () => {
    if (!canCreate) { nav("abo"); return; }
    let kunde = selK; if (showN && neuK.name) kunde = await addKu(neuK);
    if (!kunde) { setValE(["Bitte einen Kunden auswählen oder neu anlegen"]); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const cleanPos = pos.filter(p => p.beschreibung.trim() !== "");
    const fdt = new Date(datum); fdt.setDate(fdt.getDate() + ziel);
    const r2 = (v: number) => Math.round(v * 100) / 100;
    const kundeAdresse = [kunde.strasse, [kunde.plz, kunde.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
    const cleanNetto = cleanPos.reduce((s, p) => s + p.menge * p.preis, 0);
    const cleanRabattB = cleanNetto * rabatt / 100;
    const cleanMwstB = cleanPos.reduce((s, p) => s + p.menge * p.preis * (1 - rabatt / 100) * p.mwst / 100, 0);
    const cleanBrutto = cleanNetto - cleanRabattB + cleanMwstB;
    const newStatus = editRechnung ? editRechnung.status : (typ === "angebot" ? "angebot" : "offen");
    const re = { id: uid(), nummer: typ === "angebot" ? nextAnNr : nextNr, typ, datum, faelligDatum: fdt.toISOString().split("T")[0], kundeId: kunde.id, kundeName: kunde.name, kundeAdresse, kundeEmail: kunde.email || "", positionen: cleanPos, netto: r2(cleanNetto - cleanRabattB), mwst: r2(cleanMwstB), gesamt: r2(cleanBrutto), zahlungsziel: ziel, notiz, status: newStatus, gewerk: gw, rabatt, zeitraumVon: zvon, zeitraumBis: zbis };
    const errs = validateRechnung(re, firma); if (errs.length > 0) { setValE(errs); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setSaving(true);
    try {
      if (editRechnung) {
        await updRe(editRechnung.id, { ...re, id: editRechnung.id, nummer: editRechnung.nummer });
        onEditDone?.();
      } else {
        await addRe(re);
      }
      nav("rechnungen");
    } catch (err) {
      setValE([err instanceof Error ? err.message : "Fehler beim Speichern. Bitte versuche es erneut."]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600";
  const sel = "w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none cursor-pointer";
  const posI = "py-[6px] px-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors";

  if (!firma) return <div className="p-6 px-7 animate-fade-in"><div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">{IC.gear}</div><h2 className="text-lg font-bold">Firmendaten fehlen</h2><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer mt-4 hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={() => nav("settings")}>Einstellungen</button></div></div>;

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5">
        <div><h1 className="text-xl font-bold tracking-tight">{editRechnung ? "Rechnung bearbeiten" : typ === "angebot" ? "Neues Angebot" : "Neue Rechnung"}</h1><p className="text-[13px] text-slate-500 mt-1">Nr. {editRechnung ? editRechnung.nummer : (typ === "angebot" ? nextAnNr : nextNr)}</p></div>
        <div className="flex bg-white/[0.04] rounded-xl p-0.5 border border-white/[0.06]">
          <button className={`px-3.5 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${typ === "rechnung" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setTyp("rechnung")}>Rechnung</button>
          <button className={`px-3.5 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${typ === "angebot" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setTyp("angebot")}>Angebot</button>
        </div>
      </div>
      {!canCreate && !editRechnung && (
        <div className="flex items-start gap-3 px-4 py-4 bg-amber-500/[0.08] border border-amber-500/30 rounded-xl mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/15 shrink-0 text-amber-400 text-lg">{IC.star}</div>
          <div>
            <p className="text-[13px] font-bold text-amber-300 mb-1">Free-Plan: Limit erreicht</p>
            <p className="text-[13px] text-amber-400/80">Du hast das Limit von 5 Rechnungen im kostenlosen Plan erreicht. Upgrade auf Starter oder Pro, um unbegrenzt Rechnungen zu erstellen.</p>
            <button
              onClick={() => nav("abo")}
              className="mt-2.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 rounded-lg text-[12px] font-bold cursor-pointer border-none hover:opacity-90 transition-opacity"
            >
              Jetzt upgraden →
            </button>
          </div>
        </div>
      )}
      {valE.length > 0 && <div key={valE.join()} className="animate-error-shake flex items-start gap-3 px-4 py-4 bg-danger-500/[0.1] border-2 border-danger-500/50 rounded-xl mb-5 shadow-[0_0_24px_rgba(239,68,68,0.12)]"><div className="flex items-center justify-center w-9 h-9 rounded-xl bg-danger-500/20 shrink-0 text-danger-400 text-lg">{IC.alert}</div><div><p className="text-[13px] font-bold text-danger-300 mb-1.5">Bitte überprüfe folgende Felder:</p><ul className="flex flex-col gap-1">{valE.map((e, i) => <li key={i} className="flex items-start gap-1.5 text-[13px] text-danger-400"><span className="shrink-0 mt-px">•</span>{e}</li>)}</ul></div></div>}
      <div className="grid grid-cols-[1fr_300px] max-md:grid-cols-1 gap-5">
        <div className="flex flex-col gap-3">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
            <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Branche</label>
            <select className={sel} value={sonstigesGw ? "__sonstiges__" : gw} onChange={e => { if (e.target.value === "__sonstiges__") { setSonstigesGw(true); setGw(""); } else { setSonstigesGw(false); setGw(e.target.value); } setShowV(false); }}>
              <option value="">–</option>
              {Object.entries(BRANCHEN_KATEGORIEN).map(([kat, branchen]) => <optgroup key={kat} label={kat}>{branchen.map(b => <option key={b} value={b}>{b}</option>)}</optgroup>)}
              <option value="__sonstiges__">Sonstiges / Frei eingeben …</option>
            </select>
            {sonstigesGw && (
              <input
                type="text"
                autoFocus
                placeholder="Eigene Branche eingeben …"
                className="mt-2 w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200 placeholder:text-slate-600"
                value={gw}
                onChange={e => { setGw(e.target.value); setShowV(false); }}
              />
            )}
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[160px]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Rechnungsdatum</label><input type="date" className={inp} value={datum} onChange={e => setDatum(e.target.value)} /></div>
              <div className="flex-1 min-w-[220px]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Leistungszeitraum</label><div className="flex gap-2.5 items-center"><input type="date" className={`${inp} flex-1`} value={zvon} onChange={e => setZvon(e.target.value)} tabIndex={-1} onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); zbisRef.current?.focus(); } }} /><span className="text-[13px] text-slate-500">–</span><input type="date" className={`${inp} flex-1`} value={zbis} onChange={e => setZbis(e.target.value)} ref={zbisRef} /></div></div>
            </div>
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
            <label className="text-[11px] font-semibold text-slate-400 mb-2 block tracking-wide">Kunde</label>
            {!showN ? (
              selK ? (
                /* Ausgewählter Kunde */
                <div className="flex justify-between items-center bg-brand-500/[0.07] border border-brand-500/20 rounded-xl py-2.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center text-brand-300 text-[13px] font-bold shrink-0 select-none">{selK.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <strong className="text-[13px] block leading-tight">{selK.name}</strong>
                      {(selK.strasse || selK.plz || selK.ort) && <span className="text-[11px] text-slate-500">{[selK.strasse, [selK.plz, selK.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</span>}
                    </div>
                  </div>
                  <button className="bg-transparent border border-white/[0.08] text-slate-400 text-[12px] cursor-pointer px-2.5 py-1 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 hover:border-white/[0.14] transition-all font-medium" onClick={() => { setSelK(null); setKS(""); setShowKD(true); }}>Ändern</button>
                </div>
              ) : (
                /* Suche + Dropdown */
                <div className="relative" ref={kRef}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex pointer-events-none">{IC.search}</span>
                  <input
                    className={`${inp} pl-[34px]`}
                    placeholder={kunden.length > 0 ? `${kunden.length} Kunden – tippen zum Suchen …` : "Name eingeben …"}
                    value={kS}
                    onChange={e => { setKS(e.target.value); setShowKD(true); }}
                    onFocus={() => setShowKD(true)}
                    autoFocus={false}
                  />
                  {showKD && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#0d0d20] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
                      {fK.length > 0 && (
                        <div className="max-h-[220px] overflow-y-auto">
                          {fK.map(k => (
                            <button key={k.id} className="flex items-center gap-2.5 py-2.5 px-3 bg-transparent border-none text-slate-200 cursor-pointer w-full text-left hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] last:border-0" onClick={() => { setSelK(k); setKS(""); setShowKD(false); }}>
                              <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center text-[12px] font-bold text-slate-400 shrink-0 select-none">{k.name.charAt(0).toUpperCase()}</div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[13px] font-semibold block truncate">{k.name}</span>
                                {(k.plz || k.ort) && <span className="text-[11px] text-slate-500">{[k.plz, k.ort].filter(Boolean).join(" ")}</span>}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {kS && fK.length === 0 && (
                        <div className="px-3 py-3">
                          <p className="text-[12px] text-slate-500 mb-2">Kein Treffer für „{kS}"</p>
                          <button className="flex items-center gap-2 w-full py-2 px-3 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-400 text-[13px] font-medium cursor-pointer hover:bg-brand-500/15 transition-colors" onClick={() => { setShowN(true); setShowKD(false); setNeuK(prev => ({ ...prev, name: kS })); }}>
                            <span className="text-base leading-none">+</span> „{kS}" als neuen Kunden anlegen
                          </button>
                        </div>
                      )}
                      <div className="border-t border-white/[0.06] px-3 py-2.5">
                        <button className="flex items-center gap-1.5 text-brand-400 text-[12px] font-medium cursor-pointer hover:text-brand-300 transition-colors bg-transparent border-none p-0" onClick={() => { setShowN(true); setShowKD(false); }}>
                          <span className="text-base leading-none font-bold">+</span> Neuen Kunden anlegen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* Neuer-Kunde-Formular */
              <div className="flex flex-col gap-2 mt-1">
                <input className={inp} placeholder="Name *" autoFocus value={neuK.name} onChange={e => setNeuK({ ...neuK, name: e.target.value })} />
                <input className={inp} placeholder="Straße" value={neuK.strasse} onChange={e => setNeuK({ ...neuK, strasse: e.target.value })} />
                <div className="flex gap-2">
                  <input className={`${inp} !w-[90px]`} placeholder="PLZ" value={neuK.plz} onChange={e => setNeuK({ ...neuK, plz: e.target.value })} />
                  <input className={`${inp} flex-1`} placeholder="Ort" value={neuK.ort} onChange={e => setNeuK({ ...neuK, ort: e.target.value })} />
                </div>
                <input className={inp} placeholder="E-Mail" value={neuK.email} onChange={e => setNeuK({ ...neuK, email: e.target.value })} />
                <button className="bg-transparent border-none text-slate-500 text-[12px] cursor-pointer p-0 mt-0.5 font-medium hover:text-slate-300 transition-colors text-left" onClick={() => { setShowN(false); setNeuK({ name: "", strasse: "", plz: "", ort: "", email: "" }); }}>← Zurück zur Suche</button>
              </div>
            )}
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
            <div className="flex justify-between items-center flex-wrap gap-1.5">
              <label className="text-[11px] font-semibold text-slate-400 tracking-wide">Positionen</label>
              <div className="flex gap-2">{pos.length > 0 && <div className="text-[10px] text-slate-500 flex gap-2.5"><span>Arb: {fc(arbS)}</span><span>Mat: {fc(matS)}</span></div>}{gw && <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all" onClick={() => setShowV(!showV)}>{IC.star} Vorschläge</button>}</div>
            </div>
            {favoriten.length > 0 && <div className="bg-brand-500/[0.06] border border-brand-500/15 rounded-xl p-3 mt-2 mb-2"><div className="text-[10px] text-warning-500 font-bold uppercase tracking-[0.1em] mb-1.5">★ Favoriten</div><div className="flex flex-wrap gap-1.5">{favoriten.map((v, i) => <div key={i} className="relative group/fav"><button className="flex flex-col gap-px py-1.5 pl-2.5 pr-6 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 cursor-pointer text-[11px] text-left hover:border-brand-500/30 transition-all" onClick={() => addP(v)}><span className="text-[12px]">{v.beschreibung}</span><span className="opacity-40 text-[10px]">{fc(v.preis)}/{v.einheit}</span></button><button className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] text-warning-500 hover:text-warning-300 bg-transparent border-none cursor-pointer opacity-0 group-hover/fav:opacity-100 transition-opacity" onClick={() => delFav(v.id)} title="Entfernen">✕</button></div>)}</div></div>}
            {showV && gw && <div className="bg-brand-500/[0.06] border border-brand-500/15 rounded-xl p-3 mt-2"><div className="flex flex-wrap gap-1.5">{((GV as Record<string, { beschreibung: string; einheit: string; preis: number; typ: "arbeit" | "material" }[]>)[gw] || []).map((v, i) => <div key={i} className="relative group/sug"><button className="flex flex-col gap-px py-1.5 pl-2.5 pr-6 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 cursor-pointer text-[11px] text-left hover:border-brand-500/30 transition-all" onClick={() => addP(v)}><span className="text-[12px]">{v.beschreibung}</span><span className="opacity-40 text-[10px]">{fc(v.preis)}/{v.einheit}</span></button><button className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] text-slate-500 hover:text-warning-400 bg-transparent border-none cursor-pointer opacity-0 group-hover/sug:opacity-100 transition-opacity" onClick={() => addFav(v)} title="Als Favorit speichern">★</button></div>)}</div></div>}
            {pos.length > 0 && <div className="mt-3">
              {/* Mobile: Card-Layout */}
              <div className="flex flex-col gap-2 md:hidden">
                {pos.map((p, idx) => <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 shrink-0 w-4 text-center">{idx + 1}</span>
                    <input className={`${posI} flex-1`} placeholder="Beschreibung" value={p.beschreibung} onChange={e => updP(p.id, "beschreibung", e.target.value)} />
                    <button className="bg-transparent border-none text-slate-600 cursor-pointer p-1 rounded-lg hover:text-slate-300 transition-colors shrink-0" onClick={() => rmP(p.id)}>{IC.trash}</button>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Typ</span><select className={`${posI} w-full`} value={p.typ} onChange={e => updP(p.id, "typ", e.target.value)}><option value="arbeit">Arbeit</option><option value="material">Material</option></select></div>
                    <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Menge</span><input className={`${posI} text-center w-full`} type="number" min=".01" step=".01" value={p.menge} onChange={e => updP(p.id, "menge", parseFloat(e.target.value) || 0)} /></div>
                    <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Einheit</span><input className={`${posI} text-center w-full`} value={p.einheit} onChange={e => updP(p.id, "einheit", e.target.value)} /></div>
                  </div>
                  <div className="flex gap-1.5 items-end">
                    <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Preis (€)</span><input className={`${posI} text-right w-full`} type="number" min="0" step=".01" value={p.preis} onChange={e => updP(p.id, "preis", parseFloat(e.target.value) || 0)} /></div>
                    <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">MwSt</span><select className={`${posI} w-full`} value={p.mwst} onChange={e => updP(p.id, "mwst", parseInt(e.target.value))}><option value={19}>19%</option><option value={7}>7%</option><option value={0}>0%</option></select></div>
                    <div className="flex flex-col gap-1 flex-1 items-end"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Summe</span><span className="py-[6px] text-[12px] font-bold text-brand-400">{fc(p.menge * p.preis)}</span></div>
                  </div>
                </div>)}
              </div>
              {/* Desktop: Tabellen-Layout */}
              <div className="hidden md:block overflow-x-auto"><div className="flex gap-1 py-1.5 px-1 text-[9px] font-semibold text-slate-500 uppercase tracking-[0.1em] border-b border-white/[0.06]"><span style={{ flex: 2.5 }}>Beschr.</span><span style={{ flex: .6 }}>Typ</span><span style={{ flex: .6 }}>Menge</span><span style={{ flex: .6 }}>Einh.</span><span style={{ flex: .7, textAlign: "right" }}>Preis</span><span style={{ flex: .5 }}>MwSt</span><span style={{ flex: .7, textAlign: "right" }}>Sum.</span><span className="w-6" /></div>
                {pos.map(p => <div key={p.id} className="flex gap-1 items-center py-1 border-b border-white/[0.04]"><input className={posI} style={{ flex: 2.5 }} value={p.beschreibung} onChange={e => updP(p.id, "beschreibung", e.target.value)} /><select className={posI} style={{ flex: .6 }} value={p.typ} onChange={e => updP(p.id, "typ", e.target.value)}><option value="arbeit">Arb</option><option value="material">Mat</option></select><input className={`${posI} text-center`} style={{ flex: .6 }} type="number" min=".01" step=".01" value={p.menge} onChange={e => updP(p.id, "menge", parseFloat(e.target.value) || 0)} /><input className={`${posI} text-center`} style={{ flex: .6 }} value={p.einheit} onChange={e => updP(p.id, "einheit", e.target.value)} /><input className={`${posI} text-right`} style={{ flex: .7 }} type="number" min="0" step=".01" value={p.preis} onChange={e => updP(p.id, "preis", parseFloat(e.target.value) || 0)} /><select className={posI} style={{ flex: .5 }} value={p.mwst} onChange={e => updP(p.id, "mwst", parseInt(e.target.value))}><option value={19}>19</option><option value={7}>7</option><option value={0}>0</option></select><span style={{ flex: .7, textAlign: "right", fontWeight: 600, fontSize: 11 }}>{fc(p.menge * p.preis)}</span><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-lg hover:text-slate-300 transition-colors" onClick={() => rmP(p.id)}>{IC.trash}</button></div>)}
              </div>
            </div>}
            <button className="flex items-center gap-1.5 py-2.5 bg-transparent border-2 border-dashed border-white/[0.08] rounded-xl text-slate-500 text-[13px] cursor-pointer w-full justify-center mt-2 hover:border-white/[0.15] hover:text-slate-300 transition-all" onClick={() => addP({ beschreibung: "", einheit: "Stk", preis: 0, typ: "arbeit" })}>{IC.plus} Position</button>
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><div className="flex gap-3 flex-wrap"><div className="w-[100px]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Rabatt %</label><input className={inp} type="number" min="0" max="100" value={rabatt} onChange={e => setRabatt(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))} /></div><div className="flex-1 min-w-[180px]"><label className="text-[11px] font-semibold text-slate-400 mb-1.5 block tracking-wide">Notiz</label><input className={inp} placeholder="..." value={notiz} onChange={e => setNotiz(e.target.value)} /></div></div></div>
        </div>
        <div className="sticky top-6 self-start max-md:static">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
            <h3 className="text-[14px] font-bold mb-3">Zusammenfassung</h3>
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span className="text-slate-400">Nr.</span><span className="font-mono text-[11px]">{editRechnung ? editRechnung.nummer : (typ === "angebot" ? nextAnNr : nextNr)}</span></div>
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span className="text-slate-400">Ziel</span><div className="flex items-center gap-1"><input type="number" min={1} max={365} className="bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 text-[11px] py-1 px-2 w-14 text-center outline-none focus:border-brand-500/50 transition-colors" value={ziel} onChange={e => setZiel(Math.max(1, parseInt(e.target.value) || 14))} /><span className="text-[11px] text-slate-500">Tage</span></div></div>
            <div className="border-t border-white/[0.06] my-2.5" />
            {arbS > 0 && <div className="flex justify-between items-center py-1 text-[12px] text-slate-400"><span>Arbeit</span><span>{fc(arbS)}</span></div>}
            {matS > 0 && <div className="flex justify-between items-center py-1 text-[12px] text-slate-400"><span>Material</span><span>{fc(matS)}</span></div>}
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span>Netto</span><span>{fc(netto)}</span></div>
            {rabatt > 0 && <div className="flex justify-between items-center py-1.5 text-[13px] text-danger-400"><span>-{rabatt}%</span><span>-{fc(rabattB)}</span></div>}
            <div className="flex justify-between items-center py-1.5 text-[13px]"><span>MwSt</span><span>{fc(mwstB)}</span></div>
            <div className="flex justify-between items-center py-2 text-[18px] font-extrabold text-brand-400 pt-3 border-t border-white/[0.06] mt-1.5"><span>Brutto</span><span>{fc(brutto)}</span></div>
            {valE.length > 0 && <div key={valE.join()} className="animate-error-shake flex items-start gap-2 mt-3 px-3 py-3 bg-danger-500/[0.12] border-2 border-danger-500/50 rounded-xl text-[12px] text-danger-300 shadow-[0_0_16px_rgba(239,68,68,0.1)]"><span className="flex shrink-0 mt-0.5 text-danger-400">{IC.alert}</span><ul className="flex flex-col gap-0.5">{valE.map((e, i) => <li key={i}>• {e}</li>)}</ul></div>}
            {pos.filter(p => p.beschreibung.trim()).length > 0 && firma && (
              <button className="flex items-center gap-1.5 w-full justify-center mt-3 px-4 py-2 bg-white/[0.04] text-slate-400 border border-white/[0.08] rounded-xl text-[12px] font-medium cursor-pointer hover:bg-white/[0.07] hover:text-slate-200 transition-all duration-200" onClick={() => {
                const previewKunde = selK || (neuK.name ? { id: "", ...neuK } as Kunde : null);
                if (!previewKunde || !firma) return;
                const kundeAdresse = [previewKunde.strasse, [previewKunde.plz, previewKunde.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
                const cleanPos = pos.filter(p => p.beschreibung.trim() !== "");
                const pNetto = cleanPos.reduce((s, p) => s + p.menge * p.preis, 0);
                const pRabattB = pNetto * rabatt / 100;
                const pMwstB = cleanPos.reduce((s, p) => s + p.menge * p.preis * (1 - rabatt / 100) * p.mwst / 100, 0);
                const preRe: Rechnung = { id: "preview", nummer: nextNr, typ, datum, faelligDatum: "", kundeId: previewKunde.id, kundeName: previewKunde.name, kundeAdresse, kundeEmail: "", positionen: cleanPos, netto: pNetto - pRabattB, mwst: pMwstB, gesamt: pNetto - pRabattB + pMwstB, zahlungsziel: ziel, notiz, status: "offen", gewerk: gw, rabatt, zeitraumVon: zvon, zeitraumBis: zbis };
                openAsPdf(preRe, firmaForPdf!);
              }}>{IC.eye} Vorschau</button>
            )}
            {!canCreate && !editRechnung ? (
              <div className="mt-2 text-center">
                <button disabled className="flex items-center gap-1.5 w-full justify-center px-4 py-2.5 bg-white/[0.04] text-slate-500 border border-white/[0.08] rounded-xl text-[13px] font-semibold cursor-not-allowed opacity-50">
                  {IC.star} Free-Limit erreicht
                </button>
                <p className="text-[11px] text-slate-500 mt-1.5">Upgrade erforderlich, um weitere Rechnungen zu erstellen.</p>
              </div>
            ) : (
              <button className="flex items-center gap-1.5 w-full justify-center mt-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" style={{ opacity: (pos.length === 0 || (!selK && !neuK.name)) ? .4 : 1 }} disabled={pos.length === 0 || (!selK && !neuK.name) || saving} onClick={doSave}>{saving ? "..." : editRechnung ? "Speichern" : "Erstellen"}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
