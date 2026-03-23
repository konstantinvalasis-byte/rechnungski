"use client";
import FadeIn from "@/components/ui/FadeIn";
import { BRANCHES } from "@/lib/landing-data";

export default function BranchenSection() {
  return (
    <FadeIn id="branchen" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">30+ Branchen</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Eine App. Jede Branche.</h2>
          <p className="mt-3 text-slate-500 max-w-md mx-auto">
            Handwerk, IT, Kreativ, Gesundheit, Events — RechnungsKI kennt deine Preise.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BRANCHES.map((branch) => {
            const Icon = branch.icon;
            return (
              <div
                key={branch.name}
                className={`group relative bg-gradient-to-br ${branch.gradient} rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 cursor-pointer border border-transparent hover:border-white/60 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`w-5 h-5 ${branch.iconColor} stroke-[1.75]`} />
                </div>
                <span className="text-sm font-bold text-slate-700">{branch.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}
