"use client";
import { IC } from "@/lib/dashboard-icons";

export default function AboPage({ plan, spl }: { plan: string; spl: (p: string) => void }) {
  const pls = [
    { id: "free", n: "Free", p: "0", feat: ["3 Rechnungen & Angebote/Monat", "3 Kunden", "KI-Preisvorschläge", "PDF-Export", "§14-konforme Rechnungen"] },
    { id: "starter", n: "Starter", p: "7,90", feat: ["100 Rechnungen & Angebote/Monat", "100 Kunden", "Alles aus Free", "Firmenlogo auf PDFs", "E-Mail-Versand", "Wiederkehrende Rechnungen", "Mahnwesen"], pop: true },
    { id: "pro", n: "Pro", p: "17,90", feat: ["Alles aus Starter", "3-Stufen-Mahnwesen", "DATEV CSV-Export", "Angebote → Rechnungen (1 Klick)", "Prioritäts-Support"] },
  ];
  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in"><div className="text-center mb-8"><h1 className="text-[28px] font-extrabold bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Wähle deinen Plan</h1><p className="text-[14px] text-slate-500 mt-2">Starte kostenlos. Upgrade jederzeit.</p></div>
      <div className="grid grid-cols-4 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-3">{pls.map(p => <div key={p.id} className={`rounded-2xl p-5 flex flex-col relative transition-all duration-200 ${p.pop ? "bg-gradient-to-b from-brand-500/10 to-brand-600/5 border-2 border-brand-500/40 shadow-[0_0_40px_rgba(99,102,241,0.08)]" : "bg-[#0a0a1a]/80 border border-white/[0.06] hover:border-white/[0.1]"}`}>{p.pop && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[9px] font-bold px-3.5 py-0.5 rounded-full tracking-wider shadow-[0_0_16px_rgba(99,102,241,0.3)]">BELIEBT</div>}<div className="text-[12px] font-semibold text-brand-400">{p.n}</div><div className="flex items-baseline gap-[3px] my-1.5"><span className="text-[32px] font-extrabold tracking-tight">{p.p}€</span><span className="text-[12px] text-slate-500">/Mo</span></div><div className="flex-1 flex flex-col gap-1.5 my-3 mb-5">{p.feat.map((f, i) => <div key={i} className="flex items-center gap-2 text-[13px]"><span className="text-success-500 flex">{IC.check}</span>{f}</div>)}</div><button className={`w-full justify-center transition-all duration-200 ${plan === p.id ? "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-400 border border-white/[0.08] rounded-xl text-[12px] cursor-default" : p.pop ? "flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px]" : "flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-xl text-[12px] cursor-pointer font-medium hover:bg-white/[0.08]"}`} disabled={plan === p.id} onClick={() => spl(p.id)}>{plan === p.id ? "Aktuell" : "Wählen"}</button></div>)}</div>
    </div>
  );
}
