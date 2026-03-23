"use client";
import { IC } from "@/lib/dashboard-icons";

export default function UpgradeGate({ feature, desc, nav }: { feature: string; desc: string; nav: (pg: string) => void }) {
  return (
    <div className="p-6 px-7 max-md:p-4 animate-fade-in flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 text-2xl">{IC.crown}</div>
      <h2 className="text-xl font-bold mb-2">{feature}</h2>
      <p className="text-[14px] text-slate-400 max-w-[360px] leading-relaxed mb-6">{desc}</p>
      <button onClick={() => nav("abo")} className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white border-none rounded-xl text-[13px] font-semibold cursor-pointer hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] hover:translate-y-[-1px] transition-all duration-200">Pläne ansehen →</button>
    </div>
  );
}
