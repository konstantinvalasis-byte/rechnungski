"use client";
import { useState } from "react";
import type { Position, FavoritItem } from "@/lib/db";
import { fc } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";
import { GV } from "@/lib/dashboard-data";

const emptyNeuFav = { beschreibung: "", einheit: "Stk", preis: "", typ: "" as "" | "arbeit" | "material" };

const posI = "py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors";

type Props = {
  pos: Position[];
  updP: (pid: string, f: string, v: string | number | undefined) => void;
  rmP: (pid: string) => void;
  addP: (p: Partial<Position> & { beschreibung: string; einheit: string; preis: number; typ?: "arbeit" | "material" }) => void;
  favoriten: FavoritItem[];
  addFav: (v: Omit<FavoritItem, "id">) => void;
  updFav: (id: string, up: Omit<FavoritItem, "id">) => void;
  delFav: (id: string) => void;
  gw: string;
  showV: boolean;
  setShowV: (v: boolean) => void;
  arbS: number;
  matS: number;
};

export default function PositionenListe({ pos, updP, rmP, addP, favoriten, addFav, updFav, delFav, gw, showV, setShowV, arbS, matS }: Props) {
  const [showNeuFav, setShowNeuFav] = useState(false);
  const [neuFav, setNeuFav] = useState(emptyNeuFav);
  const [editFavId, setEditFavId] = useState<string | null>(null);
  const [editFavData, setEditFavData] = useState(emptyNeuFav);

  const startEditFav = (v: FavoritItem) => {
    setEditFavId(v.id);
    setEditFavData({ beschreibung: v.beschreibung, einheit: v.einheit, preis: String(v.preis), typ: v.typ ?? "" });
    setShowNeuFav(false);
  };

  const saveEditFav = () => {
    if (!editFavId || !editFavData.beschreibung.trim()) return;
    updFav(editFavId, {
      beschreibung: editFavData.beschreibung.trim(),
      einheit: editFavData.einheit || "Stk",
      preis: parseFloat(editFavData.preis) || 0,
      typ: editFavData.typ || undefined,
    });
    setEditFavId(null);
  };

  const saveNeuFav = () => {
    if (!neuFav.beschreibung.trim()) return;
    addFav({
      beschreibung: neuFav.beschreibung.trim(),
      einheit: neuFav.einheit || "Stk",
      preis: parseFloat(neuFav.preis) || 0,
      typ: neuFav.typ || undefined,
    });
    setNeuFav(emptyNeuFav);
    setShowNeuFav(false);
  };

  return (
    <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
      <div className="flex justify-between items-center flex-wrap gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 tracking-wide">Positionen</label>
        <div className="flex gap-2">
          {(arbS > 0 || matS > 0) && <div className="text-[10px] text-slate-500 flex gap-2.5">{arbS > 0 && <span>Arb: {fc(arbS)}</span>}{matS > 0 && <span>Mat: {fc(matS)}</span>}</div>}
          {gw && <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] transition-all" onClick={() => setShowV(!showV)}>{IC.star} Vorschläge</button>}
        </div>
      </div>

      {/* Favoriten */}
      {(favoriten.length > 0 || showNeuFav) ? (
        <div className="bg-brand-500/[0.06] border border-brand-500/15 rounded-xl p-3 mt-2 mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] text-warning-500 font-bold uppercase tracking-[0.1em]">★ Favoriten</div>
            {!showNeuFav && (
              <button
                className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-slate-500 hover:text-brand-400 bg-transparent border border-white/[0.08] rounded-md cursor-pointer hover:border-brand-500/30 transition-all"
                onClick={() => setShowNeuFav(true)}
              >
                + Eigener
              </button>
            )}
          </div>
          {favoriten.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-1.5">
              {favoriten.map((v, i) => (
                editFavId === v.id ? (
                  <div key={i} className="flex flex-col gap-1.5 py-2 px-2.5 bg-white/[0.04] border border-brand-500/30 rounded-lg">
                    <input
                      autoFocus
                      className="py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors"
                      value={editFavData.beschreibung}
                      onChange={e => setEditFavData({ ...editFavData, beschreibung: e.target.value })}
                      onKeyDown={e => { if (e.key === "Enter") saveEditFav(); if (e.key === "Escape") setEditFavId(null); }}
                    />
                    <div className="flex gap-1.5">
                      <input
                        className="py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors w-20 text-right"
                        type="number" min="0" step="1"
                        value={editFavData.preis}
                        onChange={e => setEditFavData({ ...editFavData, preis: e.target.value })}
                      />
                      <input
                        className="py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors w-16 text-center"
                        value={editFavData.einheit}
                        onChange={e => setEditFavData({ ...editFavData, einheit: e.target.value })}
                      />
                      <select
                        className="py-[6px] px-2 bg-[#0d0d20] border border-white/[0.15] rounded-lg text-slate-400 text-[11px] outline-none focus:border-brand-500/50 transition-colors flex-1 cursor-pointer"
                        value={editFavData.typ}
                        onChange={e => setEditFavData({ ...editFavData, typ: e.target.value as "" | "arbeit" | "material" })}
                      >
                        <option value="">Typ (optional)</option>
                        <option value="arbeit">Arbeit</option>
                        <option value="material">Material</option>
                      </select>
                    </div>
                    <div className="flex gap-1.5">
                      <button className="flex-1 py-1.5 bg-brand-600 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-brand-500 transition-colors disabled:opacity-40" disabled={!editFavData.beschreibung.trim()} onClick={saveEditFav}>Speichern</button>
                      <button className="px-3 py-1.5 bg-transparent text-slate-500 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer hover:text-slate-300 transition-colors" onClick={() => setEditFavId(null)}>Abbrechen</button>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="relative group/fav flex items-center gap-1.5">
                    <button className="flex-1 flex items-center justify-between gap-2 py-1.5 pl-2.5 pr-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 cursor-pointer text-[11px] text-left hover:border-brand-500/30 transition-all" onClick={() => addP(v)}>
                      <span className="text-[12px]">{v.beschreibung}</span>
                      <span className="opacity-40 text-[10px] shrink-0">{fc(v.preis)}/{v.einheit}</span>
                    </button>
                    <div className="flex gap-0.5 opacity-0 group-hover/fav:opacity-100 transition-opacity">
                      <button className="w-6 h-6 flex items-center justify-center text-[11px] text-slate-500 hover:text-brand-400 bg-transparent border border-white/[0.06] rounded-md cursor-pointer transition-colors" onClick={() => startEditFav(v)} title="Bearbeiten">✎</button>
                      <button className="w-6 h-6 flex items-center justify-center text-[11px] text-slate-500 hover:text-danger-400 bg-transparent border border-white/[0.06] rounded-md cursor-pointer transition-colors" onClick={() => delFav(v.id)} title="Entfernen">✕</button>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
          {showNeuFav && (
            <div className={`flex flex-col gap-1.5 ${favoriten.length > 0 ? "pt-2 border-t border-white/[0.06] mt-1" : ""}`}>
              <input
                autoFocus
                className="py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors placeholder:text-slate-600"
                placeholder="Beschreibung *"
                value={neuFav.beschreibung}
                onChange={e => setNeuFav({ ...neuFav, beschreibung: e.target.value })}
                onKeyDown={e => { if (e.key === "Enter") saveNeuFav(); if (e.key === "Escape") { setShowNeuFav(false); setNeuFav(emptyNeuFav); } }}
              />
              <div className="flex gap-1.5">
                <input
                  className="py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors w-20 text-right placeholder:text-slate-600"
                  placeholder="0,00"
                  type="number"
                  min="0"
                  step="1"
                  value={neuFav.preis}
                  onChange={e => setNeuFav({ ...neuFav, preis: e.target.value })}
                />
                <input
                  className="py-[6px] px-2 bg-white/[0.08] border border-white/[0.15] rounded-lg text-slate-200 text-[11px] outline-none focus:border-brand-500/50 transition-colors w-16 text-center"
                  placeholder="Stk"
                  value={neuFav.einheit}
                  onChange={e => setNeuFav({ ...neuFav, einheit: e.target.value })}
                />
                <select
                  className="py-[6px] px-2 bg-[#0d0d20] border border-white/[0.15] rounded-lg text-slate-400 text-[11px] outline-none focus:border-brand-500/50 transition-colors flex-1 cursor-pointer"
                  value={neuFav.typ}
                  onChange={e => setNeuFav({ ...neuFav, typ: e.target.value as "" | "arbeit" | "material" })}
                >
                  <option value="">Typ (optional)</option>
                  <option value="arbeit">Arbeit</option>
                  <option value="material">Material</option>
                </select>
              </div>
              <div className="flex gap-1.5">
                <button
                  className="flex-1 py-1.5 bg-brand-600 text-white border-none rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-brand-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={!neuFav.beschreibung.trim()}
                  onClick={saveNeuFav}
                >
                  Speichern
                </button>
                <button
                  className="px-3 py-1.5 bg-transparent text-slate-500 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer hover:text-slate-300 transition-colors"
                  onClick={() => { setShowNeuFav(false); setNeuFav(emptyNeuFav); }}
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className="flex items-center gap-1.5 mt-2 mb-1 text-[11px] text-slate-600 hover:text-brand-400 bg-transparent border-none cursor-pointer p-0 transition-colors"
          onClick={() => setShowNeuFav(true)}
        >
          {IC.plus} Eigenen Vorschlag anlegen
        </button>
      )}

      {/* KI-Vorschläge */}
      {showV && gw && (
        <div className="bg-brand-500/[0.06] border border-brand-500/15 rounded-xl p-3 mt-2">
          <div className="flex flex-wrap gap-1.5">
            {((GV as Record<string, { beschreibung: string; einheit: string; preis: number; typ?: "arbeit" | "material" }[]>)[gw] || []).map((v, i) => (
              <div key={i} className="relative group/sug">
                <button className="flex flex-col gap-px py-1.5 pl-2.5 pr-6 bg-white/[0.04] border border-white/[0.06] rounded-lg text-slate-200 cursor-pointer text-[11px] text-left hover:border-brand-500/30 transition-all" onClick={() => addP(v)}>
                  <span className="text-[12px]">{v.beschreibung}</span>
                  <span className="opacity-40 text-[10px]">{fc(v.preis)}/{v.einheit}</span>
                </button>
                <button className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[10px] text-slate-500 hover:text-warning-400 bg-transparent border-none cursor-pointer opacity-0 group-hover/sug:opacity-100 transition-opacity" onClick={() => addFav(v)} title="Als Favorit speichern">★</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positionen-Liste */}
      {pos.length > 0 && (
        <div className="mt-3">
          {/* Mobile: Card-Layout */}
          <div className="flex flex-col gap-2 md:hidden">
            {pos.map((p, idx) => (
              <div key={p.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600 shrink-0 w-4 text-center">{idx + 1}</span>
                  <input className={`${posI} flex-1`} placeholder="Beschreibung" value={p.beschreibung} onChange={e => updP(p.id, "beschreibung", e.target.value)} />
                  <button className="bg-transparent border-none text-slate-600 cursor-pointer p-1 rounded-lg hover:text-slate-300 transition-colors shrink-0" onClick={() => rmP(p.id)}>{IC.trash}</button>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Typ</span><select className={`${posI} w-full`} value={p.typ ?? ""} onChange={e => updP(p.id, "typ", e.target.value || undefined)}><option value="">—</option><option value="arbeit">Arbeit</option><option value="material">Material</option></select></div>
                  <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Menge</span><input className={`${posI} text-center w-full`} type="number" min="1" step="1" value={p.menge} onChange={e => updP(p.id, "menge", parseInt(e.target.value) || 1)} /></div>
                  <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Einheit</span><input className={`${posI} text-center w-full`} value={p.einheit} onChange={e => updP(p.id, "einheit", e.target.value)} /></div>
                </div>
                <div className="flex gap-1.5 items-end">
                  <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Preis (€)</span><input className={`${posI} text-right w-full`} type="number" min="0" step="1" value={p.preis} onChange={e => updP(p.id, "preis", parseFloat(e.target.value) || 0)} /></div>
                  <div className="flex flex-col gap-1 flex-1"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">MwSt</span><select className={`${posI} w-full`} value={p.mwst} onChange={e => updP(p.id, "mwst", parseInt(e.target.value))}><option value={19}>19%</option><option value={7}>7%</option><option value={0}>0%</option></select></div>
                  <div className="flex flex-col gap-1 flex-1 items-end"><span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wide">Summe</span><span className="py-[6px] text-[12px] font-bold text-brand-400">{fc(p.menge * p.preis)}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Tabellen-Layout */}
          <div className="hidden md:block overflow-x-auto">
            <div className="flex gap-1 py-1.5 px-1 text-[9px] font-semibold text-slate-500 uppercase tracking-[0.1em] border-b border-white/[0.06]">
              <span style={{ flex: 2.5 }}>Beschr.</span><span style={{ flex: .6 }}>Typ</span><span style={{ flex: .6 }}>Menge</span><span style={{ flex: .6 }}>Einh.</span><span style={{ flex: .7, textAlign: "right" }}>Preis</span><span style={{ flex: .5 }}>MwSt</span><span style={{ flex: .7, textAlign: "right" }}>Sum.</span><span className="w-6" />
            </div>
            {pos.map(p => (
              <div key={p.id} className="flex gap-1 items-center py-1 border-b border-white/[0.04]">
                <input className={posI} style={{ flex: 2.5 }} value={p.beschreibung} onChange={e => updP(p.id, "beschreibung", e.target.value)} />
                <select className={posI} style={{ flex: .6 }} value={p.typ ?? ""} onChange={e => updP(p.id, "typ", e.target.value || undefined)}><option value="">—</option><option value="arbeit">Arb</option><option value="material">Mat</option></select>
                <input className={`${posI} text-center`} style={{ flex: .6 }} type="number" min="1" step="1" value={p.menge} onChange={e => updP(p.id, "menge", parseInt(e.target.value) || 1)} />
                <input className={`${posI} text-center`} style={{ flex: .6 }} value={p.einheit} onChange={e => updP(p.id, "einheit", e.target.value)} />
                <input className={`${posI} text-right`} style={{ flex: .7 }} type="number" min="0" step="1" value={p.preis} onChange={e => updP(p.id, "preis", parseFloat(e.target.value) || 0)} />
                <select className={posI} style={{ flex: .5 }} value={p.mwst} onChange={e => updP(p.id, "mwst", parseInt(e.target.value))}><option value={19}>19</option><option value={7}>7</option><option value={0}>0</option></select>
                <span style={{ flex: .7, textAlign: "right", fontWeight: 600, fontSize: 11 }}>{fc(p.menge * p.preis)}</span>
                <button className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-lg hover:text-slate-300 transition-colors" onClick={() => rmP(p.id)}>{IC.trash}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className="flex items-center gap-1.5 py-2.5 bg-transparent border-2 border-dashed border-white/[0.08] rounded-xl text-slate-500 text-[13px] cursor-pointer w-full justify-center mt-2 hover:border-white/[0.15] hover:text-slate-300 transition-all"
        onClick={() => addP({ beschreibung: "", einheit: "Stk", preis: 0 })}
      >
        {IC.plus} Position
      </button>
    </div>
  );
}
