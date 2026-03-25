"use client";
import { useState, useRef } from "react";
import type { Firma, Rechnung, Kunde, FavoritItem, WiederkehrendItem } from "@/lib/db";
import { fd } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";
import { allesDatenLoeschen, rechnungHinzufuegen, kundenImportieren, favoritenImportieren, wiederkehrendImportieren } from "@/lib/db";

function FI({ l, v, k, f, s, w }: { l: string; v: string | undefined; k: string; f: Firma; s: (v: Firma) => void; w?: number }) { return <div className="flex-1" style={w ? { maxWidth: w } : {}}><label className="text-[10px] text-slate-500 mb-1 block font-medium tracking-wide">{l}</label><input className="w-full py-2.5 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.06] transition-all duration-200" value={v || ""} onChange={e => s({ ...f, [k]: e.target.value })} /></div>; }

export default function SettingsPage({ firma, sf, rechnungen, kunden, sre, skn, favoriten, setFavoriten, wiederkehrend, saveWdk, plan, spl, showT }: { firma: Firma | null; sf: (f: Firma | null) => void; rechnungen: Rechnung[]; kunden: Kunde[]; sre: (r: Rechnung[]) => void; skn: (k: Kunde[]) => void; favoriten: FavoritItem[]; setFavoriten: (f: FavoritItem[]) => void; wiederkehrend: WiederkehrendItem[]; saveWdk: (w: WiederkehrendItem[]) => void; plan: string; spl: (p: string) => void; showT: (msg: string) => void }) {
  const [form, setForm] = useState<Firma>(firma || { name: "", inhaber: "", strasse: "", plz: "", ort: "", telefon: "", email: "", web: "", steuernr: "", ustid: "", bankName: "", iban: "", bic: "", gewerk: "", logo: "" });
  const [showR, setShowR] = useState(false);
  const [deleteInput, setDeleteInput] = useState(""); const fRef = useRef<HTMLInputElement>(null);
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 2000000) { alert("Datei zu groß – max. 2 MB."); return; } const img = new Image(); const url = URL.createObjectURL(f); img.onload = () => { const c = document.createElement("canvas"); const MAX = 400; let w = img.width, h = img.height; if (w > MAX) { h = h * MAX / w; w = MAX; } c.width = w; c.height = h; c.getContext("2d")!.drawImage(img, 0, 0, w, h); const compressed = c.toDataURL("image/jpeg", 0.75); setForm(prev => ({ ...prev, logo: compressed })); URL.revokeObjectURL(url); }; img.src = url; };

  const inp = "w-full py-2.5 px-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200 placeholder:text-slate-500";
  const sbtn = "flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in"><div className="flex justify-between items-start mb-6"><div><h1 className="text-xl font-bold tracking-tight">Einstellungen</h1></div></div>
      <div className="flex flex-col gap-4 max-w-[620px]">
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Logo</h3>
          {plan === "free" ? (
            <div className="flex items-center gap-3 py-3 px-4 bg-amber-500/[0.06] border border-amber-500/20 rounded-xl">
              <span className="text-amber-400">{IC.star}</span>
              <div className="flex-1">
                <p className="text-[13px] text-amber-300 font-semibold">Ab Starter verfügbar</p>
                <p className="text-[12px] text-amber-400/70 mt-0.5">Dein Logo erscheint auf jeder Rechnung und im PDF.</p>
              </div>
              <button className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 rounded-lg text-[11px] font-bold cursor-pointer border-none" onClick={() => spl("starter")}>Upgraden</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {form.logo ? <div className="relative"><img src={form.logo} alt="" className="max-h-[50px] max-w-[150px] rounded-xl border border-white/[0.1] bg-white p-1 object-contain" /><button className="absolute -top-1.5 -right-1.5 bg-slate-800 rounded-full w-[18px] h-[18px] flex items-center justify-center border border-white/[0.1] text-[10px] text-slate-400 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setForm({ ...form, logo: "" })}>✕</button></div>
                : <div className="w-[100px] h-[56px] rounded-xl border-2 border-dashed border-white/[0.1] flex items-center justify-center text-slate-600 cursor-pointer hover:border-brand-500/30 hover:bg-brand-500/[0.03] transition-all" onClick={() => fRef.current?.click()}>{IC.img}</div>}
              <button className={sbtn} onClick={() => fRef.current?.click()}>{form.logo ? "Ändern" : "Hochladen"}</button><input ref={fRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} />
            </div>
          )}
        </div>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Firmendaten</h3><div className="flex flex-col gap-2">
          <div className="flex gap-[7px] max-md:flex-col"><FI l="Firma *" v={form.name} k="name" f={form} s={setForm} /><FI l="Inhaber" v={form.inhaber} k="inhaber" f={form} s={setForm} /></div>
          <FI l="Straße *" v={form.strasse} k="strasse" f={form} s={setForm} />
          <div className="flex gap-[7px]"><FI l="PLZ *" v={form.plz} k="plz" f={form} s={setForm} w={100} /><FI l="Ort *" v={form.ort} k="ort" f={form} s={setForm} /></div>
          <div className="flex gap-[7px] max-md:flex-col"><FI l="Tel" v={form.telefon} k="telefon" f={form} s={setForm} /><FI l="E-Mail" v={form.email} k="email" f={form} s={setForm} /></div>
        </div></div>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Steuern (§14 Pflicht)</h3><div className="flex gap-2 mb-2.5 max-md:flex-col"><FI l="Steuernr." v={form.steuernr} k="steuernr" f={form} s={setForm} /><FI l="USt-ID" v={form.ustid} k="ustid" f={form} s={setForm} /></div><label className="flex items-center gap-2.5 cursor-pointer text-[13px]"><input type="checkbox" className="w-4 h-4 rounded accent-brand-500" checked={!!form.kleinunternehmer} onChange={e => setForm({ ...form, kleinunternehmer: e.target.checked })} /><span>Kleinunternehmer nach §19 UStG (kein MwSt-Ausweis)</span></label></div>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">Bank</h3><div className="flex flex-col gap-2"><FI l="Bank" v={form.bankName} k="bankName" f={form} s={setForm} /><div className="flex gap-2 max-md:flex-col"><FI l="IBAN" v={form.iban} k="iban" f={form} s={setForm} /><FI l="BIC" v={form.bic} k="bic" f={form} s={setForm} w={140} /></div></div></div>
        <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer w-fit hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => { if (!form.name) return; sf(form); }}>Speichern</button>
        <div className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]"><h3 className="text-[14px] font-bold mb-3">{IC.dl} Datensicherung</h3>
          <p className="text-xs text-slate-500 mb-2.5 leading-relaxed">Exportiere alle Daten als JSON-Backup oder importiere ein vorhandenes Backup.</p>
          <div className="flex gap-2 flex-wrap">
            <button className={sbtn} onClick={() => { const data = { version: 1, date: new Date().toISOString(), firma, rechnungen, kunden, favoriten: favoriten || [], wiederkehrend: wiederkehrend || [], plan }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `RechnungsKI_Backup_${new Date().toISOString().split("T")[0]}.json`; a.click(); URL.revokeObjectURL(a.href); showT("Backup heruntergeladen!"); }}>{IC.dl} Export (.json)</button>
            <label className={`${sbtn} cursor-pointer`}><input type="file" accept=".json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const reader = new FileReader(); reader.onload = async ev => { try { const d = JSON.parse(ev.target?.result as string); if (!d.version || !d.firma) { showT("Ungültiges Backup!"); return; } if (!confirm(`Backup vom ${fd(d.date)} importieren? Aktuelle Daten werden überschrieben.`)) return; showT("Importiere…"); await allesDatenLoeschen(); await sf(d.firma); const importedRe: Rechnung[] = d.rechnungen || []; for (const r of importedRe) { try { await rechnungHinzufuegen(r); } catch { /* Duplikat überspringen */ } } if (d.kunden?.length) await kundenImportieren(d.kunden); if (d.favoriten?.length) await favoritenImportieren(d.favoriten); if (d.wiederkehrend?.length) await wiederkehrendImportieren(d.wiederkehrend); if (d.plan) spl(d.plan); setForm(d.firma); showT("Backup importiert!"); setTimeout(() => window.location.reload(), 1000); } catch { showT("Datei konnte nicht gelesen werden!"); } }; reader.readAsText(f); e.target.value = ""; }} />⬆ Import</label>
          </div>
        </div>
        <div className="bg-danger-500/[0.04] rounded-2xl p-4 border border-danger-500/15"><h3 className="text-[14px] font-bold text-danger-400 mb-2">Gefahrenzone</h3>
          {!showR ? <button className="px-3 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-danger-500/15 transition-all" onClick={() => { setShowR(true); setDeleteInput(""); }}>Alles löschen</button> : <div className="flex flex-col gap-2.5"><p className="text-[13px] text-danger-300/80 leading-relaxed">Alle Rechnungen, Kunden und Firmendaten werden unwiderruflich gelöscht.<br />Gib <strong>LÖSCHEN</strong> ein um zu bestätigen:</p><input className={`${inp} !text-danger-400 !border-danger-500/30`} placeholder="LÖSCHEN" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} /><div className="flex gap-2"><button className="px-3 py-1.5 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium" disabled={deleteInput !== "LÖSCHEN"} style={{ opacity: deleteInput !== "LÖSCHEN" ? 0.4 : 1, cursor: deleteInput !== "LÖSCHEN" ? "not-allowed" : "pointer" }} onClick={async () => { if (deleteInput !== "LÖSCHEN") return; await allesDatenLoeschen(); window.location.reload(); }}>Endgültig löschen</button><button className={sbtn} onClick={() => { setShowR(false); setDeleteInput(""); }}>Abbrechen</button></div></div>}
        </div>
      </div>
    </div>
  );
}
