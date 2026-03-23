"use client";
import FadeIn from "@/components/ui/FadeIn";
import { FAQS } from "@/lib/landing-data";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

interface Props {
  openFaq: number | null;
  setOpenFaq: (i: number | null) => void;
}

export default function FaqSection({ openFaq, setOpenFaq }: Props) {
  return (
    <FadeIn className="py-20 md:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Häufige Fragen</h2>
        </div>
        <div className="divide-y divide-slate-200/80">
          {FAQS.map((faq, i) => (
            <div key={faq.q}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors pr-4">
                  {faq.q}
                </span>
                <ChevronDown open={openFaq === i} />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  openFaq === i ? "max-h-40 pb-5" : "max-h-0"
                }`}
              >
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
