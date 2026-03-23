"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AbgemeldeteToast() {
  const params = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (params.get("abgemeldet") === "1") {
      setVisible(true);
      window.history.replaceState({}, "", "/");
      const t = setTimeout(() => {
        setLeaving(true);
        setTimeout(() => setVisible(false), 400);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [params]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 bg-slate-900 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-all duration-400 ${
        leaving ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="w-7 h-7 bg-success-500/15 rounded-full flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-success-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="text-[13px] font-medium text-slate-200 whitespace-nowrap">
        Du wurdest erfolgreich abgemeldet.
      </span>
      <button
        onClick={() => { setLeaving(true); setTimeout(() => setVisible(false), 400); }}
        className="ml-1 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Schließen"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
