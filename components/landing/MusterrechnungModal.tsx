"use client";
import { getMusterRechnungHtml } from "@/lib/landing-musterrechnung";

const MUSTER_HTML = getMusterRechnungHtml();

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function MusterrechnungModal({ show, onClose }: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser chrome */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs font-semibold text-slate-500 ml-1">Musterrechnung · RE-2026-0047</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const iframe = document.createElement("iframe");
                Object.assign(iframe.style, { position: "fixed", top: "-9999px", left: "-9999px", width: "800px", height: "1100px", border: "none" });
                iframe.addEventListener("load", () => {
                  iframe.contentWindow?.focus();
                  iframe.contentWindow?.print();
                  setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 2000);
                });
                document.body.appendChild(iframe);
                iframe.contentDocument?.write(MUSTER_HTML);
                iframe.contentDocument?.close();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PDF herunterladen
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
              aria-label="Schließen"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invoice rendered in iframe */}
        <iframe
          srcDoc={MUSTER_HTML}
          className="w-full border-none"
          style={{ height: "760px" }}
          title="Musterrechnung Vorschau"
        />
      </div>
    </div>
  );
}
