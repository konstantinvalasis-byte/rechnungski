"use client";
import { useState, useRef } from "react";
import type { Firma } from "@/lib/db";
import { IC } from "@/lib/dashboard-icons";
import { BRANCHEN_KATEGORIEN } from "@/lib/dashboard-data";

export default function OnboardingWizard({ onComplete }: { onComplete: (firma: Firma) => void }) {
  const [step, setStep] = useState(0); // 0=welcome, 1=branche, 2=firma, 3=steuer, 4=bank, 5=logo, 6=fertig
  const [, setBrancheKat] = useState("");
  const [form, setForm] = useState({ name: "", inhaber: "", strasse: "", plz: "", ort: "", telefon: "", email: "", web: "", steuernr: "", ustid: "", bankName: "", iban: "", bic: "", gewerk: "", logo: "" });
  const [logoErr, setLogoErr] = useState("");
  const fRef = useRef<HTMLInputElement>(null);
  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 2000000) { setLogoErr("Datei zu groß – max. 2 MB erlaubt."); return; } setLogoErr(""); const img = new Image(); const url = URL.createObjectURL(f); img.onload = () => { const c = document.createElement("canvas"); const MAX = 400; let w = img.width, h = img.height; if (w > MAX) { h = h * MAX / w; w = MAX; } c.width = w; c.height = h; c.getContext("2d")!.drawImage(img, 0, 0, w, h); const compressed = c.toDataURL("image/jpeg", 0.75); setForm(prev => ({ ...prev, logo: compressed })); URL.revokeObjectURL(url); }; img.src = url; };

  const canNext = () => {
    if (step === 1) return !!form.gewerk;
    if (step === 2) return !!form.name;
    return true;
  };

  const steps = [
    { title: "Willkommen", icon: "👋" },
    { title: "Deine Branche", icon: "🎯" },
    { title: "Firmendaten", icon: "🏢" },
    { title: "Steuerdaten", icon: "📋" },
    { title: "Bankverbindung", icon: "🏦" },
    { title: "Logo", icon: "🎨" },
    { title: "Fertig!", icon: "🚀" },
  ];

  const progress = Math.round((step / (steps.length - 1)) * 100);

  const inp = "w-full py-2.5 px-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200 placeholder:text-slate-500";
  const oblbl = "text-[11px] font-semibold text-slate-400 mb-1 block tracking-wide";

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 bg-[#050510] w-full">
      {/* Progress */}
      <div className="w-full max-w-[600px] h-1 bg-white/[0.06] rounded-full overflow-hidden mb-6">
        <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Step dots */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        {steps.map((s, i) => (
          <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${i < step ? "bg-success-500/15 border border-success-500/30 text-success-500" : i === step ? "border border-brand-500/40 bg-brand-500/10 shadow-[0_0_16px_rgba(99,102,241,0.2)]" : "bg-white/[0.04] border border-white/[0.06]"}`}>
            {i < step ? <span className="flex">{IC.check}</span> : <span className="text-sm">{s.icon}</span>}
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-4 sm:p-6 md:p-8 max-w-[680px] w-full flex-1 sm:max-h-[calc(100vh-200px)] overflow-y-auto animate-fade-in">
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center text-[40px] mb-5">👋</div>
            <h1 className="text-[28px] font-extrabold tracking-tight mb-2.5 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Willkommen bei RechnungsKI</h1>
            <p className="text-[15px] text-slate-400 max-w-[440px] leading-relaxed mb-2">In 2 Minuten bist du startklar. Wir richten alles für dich ein – danach kannst du sofort deine erste Rechnung erstellen.</p>
            <div className="flex flex-col gap-2.5 mt-6 text-sm">
              {["Branche wählen – KI-Vorschläge passend für dich", "Firmendaten eingeben – erscheinen auf jeder Rechnung", "Steuern & Bank – für §14-konforme Rechnungen", "Logo hochladen – dein Branding auf jedem Dokument"].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/15 flex items-center justify-center text-xs font-bold text-brand-400 shrink-0">{i + 1}</span>
                  <span className="text-slate-400 text-left">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Was ist deine Branche?</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Wir passen die KI-Vorschläge, Einheiten und Preise an dein Geschäft an.</p>
            <div className="flex flex-col gap-4">
              {Object.entries(BRANCHEN_KATEGORIEN).map(([kat, branchen]) => (
                <div key={kat}>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2 pl-0.5">{kat}</div>
                  <div className="flex flex-wrap gap-2">
                    {branchen.map(b => (
                      <button key={b} onClick={() => { setForm({ ...form, gewerk: b }); setBrancheKat(kat); }}
                        className={`px-4 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all duration-200 ${form.gewerk === b ? "border border-brand-500/50 bg-brand-500/10 text-brand-300 shadow-[0_0_12px_rgba(99,102,241,0.15)]" : "border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/[0.12] hover:bg-white/[0.06]"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] mb-2 pl-0.5">Andere Branche</div>
                <input
                  type="text"
                  placeholder="Frei eingeben – z.B. Tätowierer, Yoga, Tierarzt …"
                  className="w-full py-2.5 px-3 bg-white/[0.08] border border-white/[0.18] rounded-xl text-slate-200 text-[13px] outline-none focus:border-brand-500/50 focus:bg-white/[0.11] transition-all duration-200 placeholder:text-slate-500"
                  value={Object.values(BRANCHEN_KATEGORIEN).flat().includes(form.gewerk) ? "" : form.gewerk}
                  onChange={e => setForm({ ...form, gewerk: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Deine Firmendaten</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Diese Daten erscheinen auf jeder Rechnung. Du kannst sie später jederzeit ändern.</p>
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><label className={oblbl}>Firmenname *</label><input className={inp} placeholder="z.B. Müller Webdesign" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="flex-1"><label className={oblbl}>Inhaber</label><input className={inp} placeholder="Max Müller" value={form.inhaber} onChange={e => setForm({ ...form, inhaber: e.target.value })} /></div>
              </div>
              <div><label className={oblbl}>Straße + Nr.</label><input className={inp} placeholder="Musterstraße 42" value={form.strasse} onChange={e => setForm({ ...form, strasse: e.target.value })} /></div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-[110px] sm:shrink-0"><label className={oblbl}>PLZ</label><input className={inp} placeholder="70173" value={form.plz} onChange={e => setForm({ ...form, plz: e.target.value })} /></div>
                <div className="flex-1"><label className={oblbl}>Ort</label><input className={inp} placeholder="Stuttgart" value={form.ort} onChange={e => setForm({ ...form, ort: e.target.value })} /></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1"><label className={oblbl}>Telefon</label><input className={inp} placeholder="0711 123456" value={form.telefon} onChange={e => setForm({ ...form, telefon: e.target.value })} /></div>
                <div className="flex-1"><label className={oblbl}>E-Mail</label><input className={inp} placeholder="info@firma.de" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Steuerdaten</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Mindestens eins davon ist Pflicht nach §14 UStG. Ohne wird deine Rechnung nicht rechtskonform sein.</p>
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div><label className={oblbl}>Steuernummer</label><input className={inp} placeholder="12/345/67890" value={form.steuernr} onChange={e => setForm({ ...form, steuernr: e.target.value })} /></div>
              <div className="text-center text-slate-600 text-[13px] py-1">– oder –</div>
              <div><label className={oblbl}>USt-IdNr.</label><input className={inp} placeholder="DE123456789" value={form.ustid} onChange={e => setForm({ ...form, ustid: e.target.value })} /></div>
            </div>
            {!form.steuernr && !form.ustid && <div className="mt-4 p-3.5 bg-warning-500/[0.06] rounded-xl border border-warning-500/15 text-[13px] text-warning-500 flex items-start gap-2.5"><span className="mt-0.5">{IC.shield}</span><span>Du kannst diesen Schritt überspringen, aber deine Rechnungen werden ohne Steuernr./USt-ID nicht §14-konform sein.</span></div>}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Bankverbindung</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Damit deine Kunden wissen, wohin sie überweisen sollen. Erscheint im Footer jeder Rechnung.</p>
            <div className="flex flex-col gap-3 max-w-[480px]">
              <div><label className={oblbl}>Bank</label><input className={inp} placeholder="Sparkasse Stuttgart" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} /></div>
              <div><label className={oblbl}>IBAN</label><input className={inp} placeholder="DE89 3704 0044 0532 0130 00" value={form.iban} onChange={e => setForm({ ...form, iban: e.target.value })} /></div>
              <div><label className={oblbl}>BIC (optional)</label><input className={inp} placeholder="COBADEFFXXX" value={form.bic} onChange={e => setForm({ ...form, bic: e.target.value })} /></div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Dein Firmenlogo</h2>
            <p className="text-[14px] text-slate-500 mb-6 leading-relaxed">Optional – aber es macht deine Rechnungen sofort professioneller. PNG oder JPG, max 2 MB.</p>
            <div className="flex flex-col items-center text-center mt-5">
              {form.logo ? (
                <div className="relative inline-block">
                  <img src={form.logo} alt="" className="max-h-20 max-w-60 rounded-xl border border-white/[0.1] bg-white p-3 object-contain shadow-lg" />
                  <button className="absolute -top-2 -right-2 bg-slate-800 rounded-full w-[22px] h-[22px] flex items-center justify-center border border-white/[0.1] text-slate-400 cursor-pointer text-xs hover:bg-slate-700 transition-colors" onClick={() => setForm({ ...form, logo: "" })}>✕</button>
                </div>
              ) : (
                <div onClick={() => fRef.current?.click()} className="w-full max-w-[220px] h-[110px] rounded-2xl border-2 border-dashed border-white/[0.1] flex flex-col items-center justify-center cursor-pointer gap-2.5 text-slate-500 hover:border-brand-500/30 hover:bg-brand-500/[0.03] transition-all duration-200">
                  <span className="text-[32px]">📷</span>
                  <span className="text-[13px] font-medium">Klicken zum Hochladen</span>
                </div>
              )}
              <input ref={fRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogo} />
              {logoErr && <p className="text-[13px] text-danger-500 mt-3 font-semibold">⚠ {logoErr}</p>}
              {!form.logo && !logoErr && <p className="text-[13px] text-slate-600 mt-4">Du kannst diesen Schritt überspringen und das Logo später hinzufügen.</p>}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-500/20 to-success-600/10 border border-success-500/20 flex items-center justify-center text-[40px] mb-5">🚀</div>
            <h2 className="text-[26px] font-extrabold tracking-tight mb-2.5 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Alles eingerichtet!</h2>
            <p className="text-[15px] text-slate-400 max-w-[400px] leading-relaxed mb-6">Dein Profil ist fertig. Du kannst jetzt sofort deine erste Rechnung erstellen.</p>
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/[0.08] max-w-[360px] w-full text-left">
              <div className="flex gap-3 items-center mb-3">
                {form.logo && <img src={form.logo} alt="" className="max-h-10 max-w-[100px] object-contain rounded-lg" />}
                <div><div className="font-bold text-[15px]">{form.name}</div><div className="text-[13px] text-brand-400 font-medium">{form.gewerk}</div></div>
              </div>
              <div className="text-[13px] text-slate-500">{form.strasse && `${form.strasse}, `}{form.plz} {form.ort}</div>
              {form.email && <div className="text-[13px] text-slate-500">{form.email}</div>}
              {(form.steuernr || form.ustid) && <div className="text-[12px] text-success-500 mt-2 flex items-center gap-1.5">{IC.check} §14 UStG konform</div>}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex items-center gap-3 max-w-[680px] w-full mt-6">
        {step > 0 && <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer hover:bg-white/[0.08] transition-all font-medium" onClick={() => setStep(step - 1)}>← Zurück</button>}
        <div className="flex-1" />
        {step < 6 ? (
          <button className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => setStep(step + 1)} style={{ opacity: step > 0 && !canNext() ? .4 : 1 }} disabled={step > 0 && !canNext()}>
            {step === 0 ? "Los geht's →" : step === 5 ? (form.logo ? "Weiter →" : "Überspringen →") : "Weiter →"}
          </button>
        ) : (
          <button className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px] transition-all duration-200" onClick={() => onComplete(form)}>
            Erste Rechnung erstellen →
          </button>
        )}
      </div>
    </div>
  );
}
