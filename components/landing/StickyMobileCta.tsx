"use client";
import { useEffect, useState } from "react";

export default function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <a
          href="/registrieren"
          className="flex items-center justify-center gap-2 w-full bg-brand-600 text-white text-sm font-semibold rounded-xl py-3.5 shadow-lg shadow-brand-600/25 hover:bg-brand-700 transition-colors active:scale-[0.98]"
        >
          Kostenlos starten →
        </a>
      </div>
    </div>
  );
}
