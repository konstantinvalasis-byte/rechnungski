"use client";
import { useState, useEffect, useRef } from "react";
import type { Kunde, Rechnung } from "@/lib/db";
import { fc } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";
import { useNavigation } from "@/components/dashboard/NavigationContext";

export default function KundenListe({ kunden, rechnungen, updKu, delKu, addKu, triggerNew = 0 }: { kunden: Kunde[]; rechnungen: Rechnung[]; updKu: (id: string, up: Partial<Kunde>) => void; delKu: (id: string) => void; addKu: (k: Omit<Kunde, "id">) => Promise<Kunde>; triggerNew?: number }) {
  const [search, setSearch] = useState("");
  const [editK, setEditK] = useState<Kunde | null>(null);
  const [delConfirm, setDelConfirm] = useState<Kunde | null>(null);
  const [editForm, setEditForm] = useState<Partial<Kunde>>({});
  const [showNeuModal, setShowNeuModal] = useState(false);
  const [neuForm, setNeuForm] = useState({ name: "", strasse: "", plz: "", ort: "", email: "", telefon: "" });
  const [neuSaving, setNeuSaving] = useState(false);
  const { navNewDocForKunde, nav } = useNavigation();

  // Mobile-Header "Neu"-Button öffnet das Modal
  const prevTriggerRef = useRef(0);
  useEffect(() => {
    if (triggerNew > 0 && triggerNew !== prevTriggerRef.current) {
      prevTriggerRef.current = triggerNew;
      setShowNeuModal(true);
    }
  }, [triggerNew]);

  const f = kunden.filter(k => k.name?.toLowerCase().includes(search.toLowerCase()));
  const st = (kid: string) => {
    const kr = rechnungen.filter(r => r.kundeId === kid);
    return { c: kr.length, u: kr.filter(r => r.status === "bezahlt").reduce((s, r) => s + r.gesamt, 0) };
  };
  const openEdit = (k: Kunde) => {
    setEditK(k);
    setEditForm({ name: k.name || "", strasse: k.strasse || "", plz: k.plz || "", ort: k.ort || "", email: k.email || "", telefon: k.telefon || "" });
  };
  const hasOpenRE = (kid: string) => rechnungen.some(r => r.kundeId === kid && (r.status === "offen" || r.status === "gemahnt"));
  const inp = "w-full py-2.5 px-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200 placeholder:text-slate-500";
  const mInp = "w-full py-2.5 px-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 transition-all duration-200 placeholder:text-slate-500";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Kunden</h1>
          <p className="text-[13px] text-slate-500 mt-1">{kunden.length} gespeichert</p>
        </div>
        <button
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 border-none"
          onClick={() => { setNeuForm({ name: "", strasse: "", plz: "", ort: "", email: "", telefon: "" }); setShowNeuModal(true); }}
        >
          {IC.plus} Neuer Kunde
        </button>
      </div>

      <div className="relative max-w-xs mb-5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span>
        <input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {f.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">{IC.users}</div>
          <h2 className="text-lg font-bold">{search ? "Keine Treffer" : "Noch keine Kunden"}</h2>
          <p className="text-[13px] text-slate-500 mt-1 mb-4">{search ? `Kein Kunde passend zu „${search}"` : "Lege deinen ersten Kunden an – er erscheint dann bei der Rechnungserstellung."}</p>
          {!search && (
            <button
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all duration-200"
              onClick={() => { setNeuForm({ name: "", strasse: "", plz: "", ort: "", email: "", telefon: "" }); setShowNeuModal(true); }}
            >
              {IC.plus} Ersten Kunden anlegen
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#0a0a1a]/80 border border-white/[0.06] rounded-2xl overflow-hidden">
          {f.map((k, i) => {
            const s = st(k.id);
            return (
              <div
                key={k.id}
                className={`group flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] cursor-pointer transition-all duration-150 ${i < f.length - 1 ? "border-b border-white/[0.05]" : ""}`}
                onClick={() => nav("rechnungen", k.name || "")}
                title={`Rechnungen von ${k.name} anzeigen`}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/15 flex items-center justify-center text-sm font-bold text-brand-400 shrink-0">
                  {k.name?.charAt(0)?.toUpperCase()}
                </div>

                {/* Name + Adresse */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px] group-hover:text-white transition-colors truncate">{k.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {[k.strasse, [k.plz, k.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ")}
                    {k.email && <span className="max-sm:hidden"> · {k.email}</span>}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-[11px] text-slate-400">{s.c} Rechnung{s.c !== 1 ? "en" : ""}</div>
                  <div className="text-[12px] font-medium text-slate-300">{fc(s.u)}</div>
                </div>

                {/* Aktionen */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-500/[0.08] text-brand-400 border border-brand-500/[0.18] rounded-lg text-[11px] font-medium cursor-pointer hover:bg-brand-500/[0.15] hover:border-brand-500/[0.3] transition-all whitespace-nowrap"
                    onClick={e => { e.stopPropagation(); navNewDocForKunde(k.id); }}
                    title="Neue Rechnung für diesen Kunden"
                  >
                    {IC.plus}<span className="max-[480px]:hidden">Rechnung</span>
                  </button>
                  <button
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer hover:bg-white/[0.08] transition-all"
                    onClick={e => { e.stopPropagation(); openEdit(k); }}
                    title="Bearbeiten"
                  >
                    ✏️
                  </button>
                  <button
                    className="px-2.5 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer hover:bg-danger-500/15 transition-all"
                    onClick={e => { e.stopPropagation(); setDelConfirm(k); }}
                    title="Löschen"
                  >
                    {IC.trash}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bearbeiten-Modal */}
      {editK && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setEditK(null)}>
          <div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[440px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}>
            <div className="p-6 max-md:p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold">Kunde bearbeiten</h2>
                <button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors" onClick={() => setEditK(null)}>{IC.x}</button>
              </div>
              <div className="flex flex-col gap-2.5">
                <input className={mInp} placeholder="Name *" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                <input className={mInp} placeholder="Straße" value={editForm.strasse} onChange={e => setEditForm({ ...editForm, strasse: e.target.value })} />
                <div className="flex gap-2">
                  <input className={`${mInp} !w-[100px]`} placeholder="PLZ" value={editForm.plz} onChange={e => setEditForm({ ...editForm, plz: e.target.value })} />
                  <input className={`${mInp} flex-1`} placeholder="Ort" value={editForm.ort} onChange={e => setEditForm({ ...editForm, ort: e.target.value })} />
                </div>
                <input className={mInp} placeholder="E-Mail" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                <input className={mInp} placeholder="Telefon" value={editForm.telefon} onChange={e => setEditForm({ ...editForm, telefon: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-5 justify-end">
                <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={() => { if (!editForm.name) return; updKu(editK.id, editForm); setEditK(null); }}>Speichern</button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setEditK(null)}>Abbrechen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Neuer-Kunde-Modal */}
      {showNeuModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => !neuSaving && setShowNeuModal(false)}>
          <div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[440px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}>
            <div className="p-6 max-md:p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[16px] font-bold">Neuen Kunden anlegen</h2>
                <button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors" onClick={() => setShowNeuModal(false)}>{IC.x}</button>
              </div>
              <div className="flex flex-col gap-2.5">
                <input className={mInp} placeholder="Name *" autoFocus value={neuForm.name} onChange={e => setNeuForm({ ...neuForm, name: e.target.value })} />
                <input className={mInp} placeholder="Straße" value={neuForm.strasse} onChange={e => setNeuForm({ ...neuForm, strasse: e.target.value })} />
                <div className="flex gap-2">
                  <input className={`${mInp} !w-[100px]`} placeholder="PLZ" value={neuForm.plz} onChange={e => setNeuForm({ ...neuForm, plz: e.target.value })} />
                  <input className={`${mInp} flex-1`} placeholder="Ort" value={neuForm.ort} onChange={e => setNeuForm({ ...neuForm, ort: e.target.value })} />
                </div>
                <input className={mInp} placeholder="E-Mail" type="email" value={neuForm.email} onChange={e => setNeuForm({ ...neuForm, email: e.target.value })} />
                <input className={mInp} placeholder="Telefon" value={neuForm.telefon} onChange={e => setNeuForm({ ...neuForm, telefon: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-5 justify-end">
                <button
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!neuForm.name.trim() || neuSaving}
                  onClick={async () => {
                    if (!neuForm.name.trim()) return;
                    setNeuSaving(true);
                    try {
                      await addKu({ name: neuForm.name, strasse: neuForm.strasse, plz: neuForm.plz, ort: neuForm.ort, email: neuForm.email, telefon: neuForm.telefon });
                      setShowNeuModal(false);
                      setNeuForm({ name: "", strasse: "", plz: "", ort: "", email: "", telefon: "" });
                    } finally {
                      setNeuSaving(false);
                    }
                  }}
                >
                  {neuSaving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Speichern…</> : "Speichern"}
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setShowNeuModal(false)}>Abbrechen</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Löschen-Bestätigung */}
      {delConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setDelConfirm(null)}>
          <div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}>
            <div className="p-6 max-md:p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold">Kunde löschen?</h2>
                <button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors" onClick={() => setDelConfirm(null)}>{IC.x}</button>
              </div>
              <p className="text-[13px] text-slate-400 mb-5 leading-relaxed">
                <strong className="text-slate-200">{delConfirm.name}</strong>
                {hasOpenRE(delConfirm.id) ? <><br /><span className="text-danger-400">Dieser Kunde hat noch offene Rechnungen!</span></> : ""}
                <br /><br />Alle Kundendaten werden gelöscht. Rechnungen bleiben erhalten.
              </p>
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-danger-500/15 transition-all" onClick={() => { delKu(delConfirm.id); setDelConfirm(null); }}>Löschen</button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08] transition-all" onClick={() => setDelConfirm(null)}>Abbrechen</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
