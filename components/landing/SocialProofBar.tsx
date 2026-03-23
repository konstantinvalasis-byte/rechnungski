"use client";
import { useEffect, useRef, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";

// CountUp-Komponente: animiert beim Eintritt in den Viewport
function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * value));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

const STATS = [
  { animated: true,  prefix: "",    value: 1200, suffix: "+",   label: "PDFs exportiert" },
  { animated: false, display: "∅ 94 Sek.",                      label: "pro Rechnung" },
  { animated: false, display: "4,8★",                           label: "Nutzerbewertung" },
  { animated: true,  prefix: "",    value: 30,   suffix: "+",   label: "Branchen" },
  { animated: true,  prefix: "",    value: 100,  suffix: "%",   label: "DSGVO-konform" },
] as const;

export default function SocialProofBar() {
  return (
    <FadeIn>
      <div className="border-y border-slate-100 bg-slate-50/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-4 items-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5 text-center">
                <span className="text-xl font-extrabold text-brand-600">
                  {stat.animated ? (
                    <CountUp value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  ) : (
                    stat.display
                  )}
                </span>
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
