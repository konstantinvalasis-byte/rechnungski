"use client";
import { useState } from "react";
import type { Firma, Rechnung } from "@/lib/db";
import { fc, fd } from "@/lib/dashboard-utils";
import { IC } from "@/lib/dashboard-icons";
import { datevCSV, mahnung } from "@/lib/dashboard-export";
import { openAsPdf, downloadPdf, generatePdfBase64, downloadZugferd, downloadXrechnung } from "@/lib/dashboard-pdf";

function SB({ s }: { s: string }) { const m: Record<string, { cls: string; l: string }> = { offen: { cls: "bg-warning-500/15 text-warning-500 border-warning-500/20", l: "Offen" }, bezahlt: { cls: "bg-success-500/15 text-success-500 border-success-500/20", l: "Bezahlt" }, gemahnt: { cls: "bg-danger-500/15 text-danger-500 border-danger-500/20", l: "Gemahnt" }, storniert: { cls: "bg-white/[0.06] text-slate-500 border-white/[0.08]", l: "Storniert" }, angebot: { cls: "bg-brand-500/15 text-brand-400 border-brand-500/20", l: "Angebot" } }; const v = m[s] || m.offen; return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap border ${v.cls}`}>{v.l}</span>; }

export default function RechnungenListe({ rechnungen, updRe, delRe, nav, dupRe, firma, onEdit, initialSearch = "", showT, nxtNr: _nxtNr, plan = "free", konvertierAngebot }: { rechnungen: Rechnung[]; updRe: (id: string, up: Partial<Rechnung>) => void; delRe: (id: string) => void; nav: (pg: string) => void; dupRe: (r: Rechnung) => Promise<void>; firma: Firma | null; onEdit: (r: Rechnung) => void; initialSearch?: string; showT: (msg: string) => void; nxtNr: () => string; plan?: string; konvertierAngebot: (id: string, datum: string) => Promise<void> }) {
  // Im Free-Plan kein Logo auf PDFs
  const firmaForPdf = firma && plan === "free" ? { ...firma, logo: "" } : firma;
  const [filter, setFilter] = useState("alle"); const [search, setSearch] = useState(initialSearch);
  const [mahnM, setMahnM] = useState<Rechnung | null>(null); const [mahnS, setMahnS] = useState(1);
  const [bezahltConfirm, setBezahltConfirm] = useState<Rechnung | null>(null);
  const [stornierConfirm, setStornierConfirm] = useState<Rechnung | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Rechnung | null>(null);
  const [emailM, setEmailM] = useState<Rechnung | null>(null);
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailCC, setEmailCC] = useState(false);
  const [emailType, setEmailType] = useState<"rechnung"|"mahnung">("rechnung");
  const [emailMahnS, setEmailMahnS] = useState(1);
  const [emailSending, setEmailSending] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [pdfMenuId, setPdfMenuId] = useState<string | null>(null);

  const openEmailModal = (r: Rechnung, type: "rechnung"|"mahnung" = "rechnung", mahnStufe = 1) => {
    const isAngebot = r.typ === "angebot";
    const prefix = type === "mahnung" ? `${mahnStufe}. Mahnung zu Rechnung` : isAngebot ? "Angebot" : "Rechnung";
    setEmailM(r);
    setEmailTo(r.kundeEmail || "");
    setEmailSubject(`${prefix} ${r.nummer} von ${firma?.name || ""}`);
    setEmailCC(false);
    setEmailType(type);
    setEmailMahnS(mahnStufe);
    setEmailErr("");
  };

  const sendEmail = async () => {
    if (!emailTo || !emailM || !firma) return;
    setEmailSending(true); setEmailErr("");
    try {
      const pdfBase64 = await generatePdfBase64(
        emailM,
        firma,
        emailType === "mahnung" ? "mahnung" : "rechnung",
        emailMahnS
      );
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailTo,
          ccSelf: emailCC,
          firmaEmail: firma.email,
          subject: emailSubject,
          type: emailType === "mahnung" ? "mahnung" : emailM.typ === "angebot" ? "angebot" : "rechnung",
          rechnungNummer: emailM.nummer,
          kundeName: emailM.kundeName,
          gesamt: emailM.gesamt,
          faelligDatum: emailM.faelligDatum,
          firmaName: firma.name,
          mahnStufe: emailMahnS,
          pdfBase64,
          pdfName: `${emailM.nummer}.pdf`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fehler beim Senden");
      if (emailType === "mahnung") updRe(emailM.id, { status: "gemahnt", mahnstufe: emailMahnS });
      setEmailM(null);
      if (showT) showT("E-Mail erfolgreich gesendet ✓");
    } catch (err: unknown) {
      setEmailErr(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setEmailSending(false);
    }
  };
  const fl = rechnungen.filter(r => filter === "alle" || r.status === filter).filter(r => r.kundeName?.toLowerCase().includes(search.toLowerCase()) || r.nummer?.includes(search)).sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime());
  const exportDatev = () => { const csv = datevCSV(rechnungen); const b = new Blob([csv], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `DATEV_${new Date().toISOString().split("T")[0]}.csv`; a.click(); };

  const sbtn = "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-lg text-[11px] cursor-pointer whitespace-nowrap hover:bg-white/[0.08] transition-all font-medium";
  const sbtnG = "flex items-center gap-1.5 px-3 py-2 bg-success-500/10 text-success-400 border border-success-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-success-500/15 transition-all";
  const dbtn = "px-2.5 py-2 bg-danger-500/10 text-danger-400 border border-danger-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-danger-500/15 transition-all";
  const inp = "w-full py-2.5 px-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200 placeholder:text-slate-500";

  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-2.5"><div><h1 className="text-xl font-bold tracking-tight">Rechnungen</h1><p className="text-[13px] text-slate-500 mt-1">{rechnungen.length} insgesamt</p></div><div className="flex gap-2 flex-wrap">{(plan === "pro" || plan === "enterprise") ? <button className={sbtn} onClick={exportDatev}>{IC.dl} DATEV</button> : <button className={`${sbtn} opacity-40 cursor-not-allowed`} title="Ab Pro-Plan verfügbar" onClick={() => nav("abo")}>{IC.dl} DATEV 🔒</button>}<button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => nav("neue-rechnung")}>{IC.plus} Neu</button></div></div>
      <div className="flex gap-2.5 mb-5 flex-wrap"><div className="relative flex-1 min-w-[160px]"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 flex">{IC.search}</span><input className={`${inp} pl-[34px]`} placeholder="Suchen..." value={search} onChange={e => setSearch(e.target.value)} /></div><div className="overflow-x-auto shrink-0"><div className="flex gap-0.5 bg-white/[0.04] rounded-xl p-0.5 border border-white/[0.06] w-max">{["alle", "offen", "bezahlt", "gemahnt", "storniert", "angebot"].map(f => <button key={f} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${filter === f ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500 hover:text-slate-300"}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}</div></div></div>
      {fl.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center"><div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-slate-500">{IC.doc}</div><h2 className="text-lg font-bold">Keine Ergebnisse</h2></div> :
        <div className="bg-[#0a0a1a]/80 rounded-2xl border border-white/[0.06] overflow-hidden"><div className="flex gap-1 py-2.5 px-4 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.1em] bg-white/[0.02] border-b border-white/[0.06] max-md:hidden"><span style={{ flex: 1 }}>Nr.</span><span style={{ flex: 1.5 }}>Kunde</span><span style={{ flex: .7 }}>Datum</span><span style={{ flex: .8, textAlign: "right" }}>Betrag</span><span style={{ flex: .6, textAlign: "center" }}>Status</span><span style={{ flex: 2, textAlign: "right" }}>Aktionen</span></div>
          {fl.map(r => <div key={r.id} className="flex gap-1 py-3 px-4 items-center border-b border-white/[0.04] text-[13px] hover:bg-white/[0.02] transition-colors max-md:flex-col max-md:items-start max-md:gap-2 max-md:px-3">
            <div className="flex items-center gap-2 w-full md:hidden">
              <span className="font-semibold font-mono text-[11px] text-slate-400">{r.nummer}</span>
              <span className="font-semibold text-[13px] flex-1">{r.kundeName}</span>
              <SB s={r.status} />
            </div>
            <div className="flex items-center gap-2 w-full md:hidden text-[12px] text-slate-500">
              <span>{fd(r.datum)}</span>
              <span className="flex-1" />
              <span className="font-semibold text-slate-200 text-[14px]">{fc(r.gesamt)}</span>
            </div>
            <span className="font-semibold font-mono text-[11px] text-slate-400 max-md:hidden" style={{ flex: 1 }}>{r.nummer}</span>
            <span className="text-[13px] max-md:hidden" style={{ flex: 1.5 }}>{r.kundeName}</span>
            <span className="text-slate-500 text-[12px] max-md:hidden" style={{ flex: .7 }}>{fd(r.datum)}</span>
            <span className="font-semibold text-[13px] text-right max-md:hidden" style={{ flex: .8 }}>{fc(r.gesamt)}</span>
            <span className="text-center max-md:hidden" style={{ flex: .6 }}><SB s={r.status} /></span>
            <span className="flex gap-1.5 justify-end flex-wrap max-md:w-full" style={{ flex: 2 }}>
              {firmaForPdf && <div className="relative">
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-brand-500/15 transition-all"
                  onClick={() => setPdfMenuId(pdfMenuId === r.id ? null : r.id)}
                >
                  {IC.pdf} PDF ▾
                </button>
                {pdfMenuId === r.id && (
                  <div
                    className="absolute right-0 top-full mt-1 z-50 w-52 bg-[#1a1f2e] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden"
                    onMouseLeave={() => setPdfMenuId(null)}
                  >
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] text-slate-300 hover:bg-white/[0.05] transition-all text-left"
                      onClick={() => { downloadPdf(r, firmaForPdf); setPdfMenuId(null); }}
                    >
                      {IC.pdf} <span>PDF herunterladen</span>
                    </button>
                    {r.typ !== "angebot" && r.typ !== "storno" && (
                      <>
                        <div className="border-t border-white/[0.06]" />
                        {firma?.steuernr || firma?.ustid ? (
                          <>
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] text-slate-300 hover:bg-white/[0.05] transition-all text-left"
                              onClick={() => { downloadZugferd(r, firmaForPdf); setPdfMenuId(null); }}
                            >
                              {IC.pdf} <span>ZUGFeRD PDF</span>
                            </button>
                            <button
                              className="w-full flex items-center gap-2 px-3 py-2.5 text-[12px] text-slate-300 hover:bg-white/[0.05] transition-all text-left"
                              onClick={() => { downloadXrechnung(r, firmaForPdf); setPdfMenuId(null); }}
                            >
                              <span className="text-slate-500">{'</>'}</span> <span>XRechnung XML</span>
                            </button>
                          </>
                        ) : (
                          <div className="px-3 py-2.5 text-[11px] text-slate-500 italic">
                            Steuernr. in Einstellungen hinterlegen für E-Rechnung
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>}
              {firma && (plan === "starter" || plan === "pro" || plan === "enterprise") && <button className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-[11px] cursor-pointer whitespace-nowrap font-medium hover:bg-cyan-500/15 transition-all" onClick={() => openEmailModal(r, "rechnung")} title="Per E-Mail senden">{IC.mail}</button>}
              {r.status === "offen" && <button className={sbtnG} onClick={() => setBezahltConfirm(r)} title="Als bezahlt markieren">{IC.check} Bezahlt</button>}
              {(r.status === "offen" || r.status === "gemahnt") && firma && (plan === "pro" || plan === "enterprise") && <button className={sbtn} onClick={() => { setMahnM(r); setMahnS(r.mahnstufe ? Math.min(r.mahnstufe + 1, 3) : (r.status === "gemahnt" ? 2 : 1)); }} title="Mahnung erstellen">🔔</button>}
              {r.status === "angebot" && <button className={sbtnG} onClick={() => konvertierAngebot(r.id, r.datum)}>→RE</button>}
              {r.status !== "storniert" && <button className={sbtn} onClick={() => onEdit(r)} title="Bearbeiten">✏️</button>}
              <button className={sbtn} onClick={() => dupRe(r)}>{IC.copy}</button>
              {r.status !== "storniert" && r.status !== "bezahlt" && <button className={dbtn} onClick={() => setStornierConfirm(r)}>Storno</button>}
              {(r.status === "storniert" || r.status === "angebot") && <button className={dbtn} onClick={() => setDeleteConfirm(r)}>{IC.trash}</button>}
            </span>
          </div>)}</div>}

      {mahnM && firma && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setMahnM(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6 max-md:p-4"><div className="flex items-center justify-between mb-3"><h2 className="text-[16px] font-bold">Zahlungserinnerung</h2><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors" onClick={() => setMahnM(null)}>{IC.x}</button></div><div className="flex gap-1 mb-4 bg-white/[0.04] rounded-xl p-0.5 w-fit border border-white/[0.06]">{[1, 2, 3].map(s => <button key={s} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${mahnS === s ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => setMahnS(s)}>{s}. Mahnung</button>)}</div><textarea className="w-full min-h-[180px] p-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[13px] font-sans text-slate-200 resize-y outline-none" value={mahnung(mahnM, firma, mahnS)} readOnly /><div className="flex gap-2 mt-4 justify-end flex-wrap"><button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 text-brand-300 border border-brand-500/20 rounded-lg text-[11px] cursor-pointer font-medium" onClick={() => { openAsPdf(mahnM, firma, "mahnung", mahnS); setMahnM(null); }}>{IC.pdf} PDF</button><button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-[11px] cursor-pointer font-medium hover:bg-cyan-500/15 transition-all" onClick={() => { setMahnM(null); openEmailModal(mahnM, "mahnung", mahnS); }}>{IC.mail} Per E-Mail</button><button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all" onClick={() => { navigator.clipboard.writeText(mahnung(mahnM, firma, mahnS)); setMahnM(null); if (showT) showT("Text kopiert"); }}>Kopieren</button><button className={sbtn} onClick={() => setMahnM(null)}>Schließen</button></div></div></div></div>}

      {bezahltConfirm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setBezahltConfirm(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6"><div className="flex items-center justify-between mb-3"><h2 className="text-[16px] font-bold">Rechnung als bezahlt markieren?</h2><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors" onClick={() => setBezahltConfirm(null)}>{IC.x}</button></div><p className="text-[13px] text-slate-400 mb-5 leading-relaxed"><strong className="text-slate-200">{bezahltConfirm.nummer}</strong> – {bezahltConfirm.kundeName}<br />Betrag: <strong className="text-success-400">{fc(bezahltConfirm.gesamt)}</strong></p><div className="flex gap-2 justify-end"><button className={sbtnG} onClick={() => { updRe(bezahltConfirm.id, { status: "bezahlt" }); setBezahltConfirm(null); if (showT) showT("Als bezahlt markiert ✓"); }}>{IC.check} Ja, bezahlt</button><button className={sbtn} onClick={() => setBezahltConfirm(null)}>Abbrechen</button></div></div></div></div>}

      {stornierConfirm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setStornierConfirm(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6 max-md:p-4"><div className="flex items-center justify-between mb-3"><h2 className="text-[16px] font-bold">Rechnung stornieren?</h2><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors" onClick={() => setStornierConfirm(null)}>{IC.x}</button></div><p className="text-[13px] text-slate-400 mb-5 leading-relaxed"><strong className="text-slate-200">{stornierConfirm.nummer}</strong> – {stornierConfirm.kundeName}<br />Betrag: {fc(stornierConfirm.gesamt)}<br /><br />Die Rechnung wird als storniert markiert und aus allen Auswertungen ausgeschlossen.</p><div className="flex gap-2 justify-end"><button className={dbtn} onClick={() => { updRe(stornierConfirm.id, { status: "storniert" }); setStornierConfirm(null); }}>Ja, stornieren</button><button className={sbtn} onClick={() => setStornierConfirm(null)}>Abbrechen</button></div></div></div></div>}

      {deleteConfirm && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => setDeleteConfirm(null)}><div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}><div className="p-6 max-md:p-4"><div className="flex items-center justify-between mb-3"><h2 className="text-[16px] font-bold">Rechnung endgültig löschen?</h2><button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors" onClick={() => setDeleteConfirm(null)}>{IC.x}</button></div><p className="text-[13px] text-slate-400 mb-5 leading-relaxed"><strong className="text-slate-200">{deleteConfirm.nummer}</strong> – {deleteConfirm.kundeName}<br />Betrag: {fc(deleteConfirm.gesamt)}<br /><br /><span className="text-danger-400">Die Rechnung wird unwiderruflich gelöscht und kann nicht wiederhergestellt werden.</span></p><div className="flex gap-2 justify-end"><button className={dbtn} onClick={() => { delRe(deleteConfirm.id); setDeleteConfirm(null); }}>Endgültig löschen</button><button className={sbtn} onClick={() => setDeleteConfirm(null)}>Abbrechen</button></div></div></div></div>}

      {/* ── E-MAIL MODAL ── */}
      {emailM && firma && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={() => !emailSending && setEmailM(null)}>
          <div className="bg-[#0f0f1a] border border-white/[0.08] rounded-2xl max-w-[500px] w-full shadow-[0_24px_80px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 max-md:p-4">
              {/* Header */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">{IC.mail}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[16px] font-bold leading-tight">
                    {emailType === "mahnung" ? `${emailMahnS}. Mahnung per E-Mail` : emailM.typ === "angebot" ? "Angebot per E-Mail senden" : "Rechnung per E-Mail senden"}
                  </h2>
                  <p className="text-[12px] text-slate-500 mt-0.5 truncate">{emailM.nummer} · {emailM.kundeName} · {fc(emailM.gesamt)}</p>
                </div>
                <button className="bg-transparent border-none text-slate-500 cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.06] hover:text-slate-200 transition-colors shrink-0" onClick={() => !emailSending && setEmailM(null)}>{IC.x}</button>
              </div>

              {/* Typ-Wechsler (wenn Mahnung möglich) */}
              {(emailM.status === "offen" || emailM.status === "gemahnt") && (
                <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-xl p-0.5 w-fit border border-white/[0.06]">
                  <button className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${emailType === "rechnung" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => { setEmailType("rechnung"); setEmailSubject(`${emailM.typ === "angebot" ? "Angebot" : "Rechnung"} ${emailM.nummer} von ${firma.name}`); }}>{emailM.typ === "angebot" ? "Angebot" : "Rechnung"}</button>
                  <button className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${emailType === "mahnung" ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => { setEmailType("mahnung"); const ms = emailM.mahnstufe ? Math.min(emailM.mahnstufe + 1, 3) : (emailM.status === "gemahnt" ? 2 : 1); setEmailMahnS(ms); setEmailSubject(`${ms}. Mahnung zu Rechnung ${emailM.nummer} – ${firma.name}`); }}>Mahnung</button>
                </div>
              )}

              {/* Mahnstufe-Wähler */}
              {emailType === "mahnung" && (
                <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-xl p-0.5 w-fit border border-white/[0.06]">
                  {[1, 2, 3].map(s => (
                    <button key={s} className={`px-3 py-1.5 border-none rounded-lg text-[12px] cursor-pointer font-medium transition-all ${emailMahnS === s ? "bg-white/[0.08] text-white" : "bg-transparent text-slate-500"}`} onClick={() => { setEmailMahnS(s); setEmailSubject(`${s}. Mahnung zu Rechnung ${emailM.nummer} – ${firma.name}`); }}>{s}. Mahnung</button>
                  ))}
                </div>
              )}

              {/* Felder */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Empfänger *</label>
                  <input className={inp} type="email" placeholder="kunde@beispiel.de" value={emailTo} onChange={e => setEmailTo(e.target.value)} disabled={emailSending} />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Betreff</label>
                  <input className={inp} placeholder="Betreff..." value={emailSubject} onChange={e => setEmailSubject(e.target.value)} disabled={emailSending} />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer group mt-1">
                  <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all text-[10px] ${emailCC ? "bg-brand-500 border-brand-500 text-white" : "border-white/[0.15] bg-transparent"}`} onClick={() => !emailSending && setEmailCC(!emailCC)}>
                    {emailCC && "✓"}
                  </div>
                  <span className="text-[13px] text-slate-400 group-hover:text-slate-300 transition-colors">Kopie an mich senden{firma.email ? ` (${firma.email})` : ""}</span>
                </label>
              </div>

              {/* Anhang-Hinweis */}
              <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <span className="text-slate-500 flex">{IC.pdf}</span>
                <span className="text-[12px] text-slate-500">{emailM.nummer}.pdf <span className="text-slate-600">– wird automatisch als Anhang beigefügt</span></span>
              </div>

              {/* Fehler */}
              {emailErr && <div className="mt-3 px-3 py-2 bg-danger-500/10 border border-danger-500/20 rounded-lg text-[12px] text-danger-400">{emailErr}</div>}

              {/* Aktionen */}
              <div className="flex gap-2 mt-5 justify-end">
                <button className={sbtn} onClick={() => setEmailM(null)} disabled={emailSending}>Abbrechen</button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(6,182,212,0.3)] hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  onClick={sendEmail}
                  disabled={!emailTo || emailSending}
                >
                  {emailSending ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Wird gesendet…</>
                  ) : (
                    <>{IC.mail} Jetzt senden</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
