"use client";
import FadeIn from "@/components/ui/FadeIn";
import { TESTIMONIALS } from "@/lib/landing-data";

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  return (
    <FadeIn className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] mb-2">
            Stimmen aus der Praxis
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Was Handwerker & Freelancer sagen
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group relative flex flex-col p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-200/80 hover:shadow-xl hover:shadow-brand-100/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Hover-Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-violet-50/0 group-hover:from-brand-50/50 group-hover:to-violet-50/20 transition-all duration-500 rounded-2xl" />

              <div className="relative">
                {/* Sterne */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.sterne }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                {/* Zitat */}
                <blockquote className="text-sm text-slate-600 leading-relaxed mb-6">
                  &ldquo;{t.zitat}&rdquo;
                </blockquote>

                {/* Autor */}
                <div className="flex items-center gap-3 mt-auto">
                  <div
                    className={`w-9 h-9 rounded-full ${t.farbe} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                  >
                    {t.initiale}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400">
                      {t.beruf} · {t.ort}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social-Proof-Zeile */}
        <p className="text-center text-xs text-slate-400 mt-8">
          Beta-Nutzer · Zitate mit Genehmigung veröffentlicht
        </p>
      </div>
    </FadeIn>
  );
}
