// PDF-Client-Funktionen — rufen die serverseitige /api/pdf Route auf

import type { Firma, Rechnung } from "@/lib/db";

async function fetchPdfBlob(
  rechnung: Rechnung,
  firma: Firma,
  typ: "rechnung" | "mahnung" = "rechnung",
  mahnStufe?: number,
  format?: "pdf" | "zugferd" | "xrechnung"
): Promise<Blob> {
  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rechnung, firma, typ, mahnStufe, format }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "PDF-Generierung fehlgeschlagen");
  }
  return res.blob();
}

function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Auf Mobile muss window.open() synchron (vor dem await) aufgerufen werden,
// sonst blockiert der Popup-Blocker den Aufruf nach dem async fetch.
function preOpenWindow(): Window | null {
  return isMobile() ? window.open("", "_blank") : null;
}

function triggerDownload(blob: Blob, dateiname: string, preOpened: Window | null): void {
  const url = URL.createObjectURL(blob);
  if (preOpened && !preOpened.closed) {
    // Mobile: in vorgeöffnetem Tab anzeigen
    preOpened.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } else {
    // Desktop: Download-Anker
    const a = document.createElement("a");
    a.href = url;
    a.download = dateiname;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

// Rechnung oder Angebot als PDF herunterladen
export async function downloadPdf(rechnung: Rechnung, firma: Firma): Promise<void> {
  const dateiname = `${rechnung.nummer || "rechnung"}-${rechnung.kundeName || "kunde"}.pdf`
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const preOpened = preOpenWindow();
  const blob = await fetchPdfBlob(rechnung, firma, "rechnung");
  triggerDownload(blob, dateiname, preOpened);
}

// PDF als Base64-String (für E-Mail-Versand)
export async function generatePdfBase64(
  rechnung: Rechnung,
  firma: Firma,
  typ: "rechnung" | "mahnung" = "rechnung",
  mahnStufe?: number
): Promise<string> {
  const blob = await fetchPdfBlob(rechnung, firma, typ, mahnStufe);
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ZUGFeRD PDF herunterladen (PDF mit eingebettetem XML)
export async function downloadZugferd(rechnung: Rechnung, firma: Firma): Promise<void> {
  const dateiname = `${rechnung.nummer || "rechnung"}-${rechnung.kundeName || "kunde"}-zugferd.pdf`
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const preOpened = preOpenWindow();
  const blob = await fetchPdfBlob(rechnung, firma, "rechnung", undefined, "zugferd");
  triggerDownload(blob, dateiname, preOpened);
}

// XRechnung XML herunterladen
export async function downloadXrechnung(rechnung: Rechnung, firma: Firma): Promise<void> {
  const dateiname = `${rechnung.nummer || "xrechnung"}.xml`.replace(/[^a-zA-Z0-9._-]/g, "_");
  const preOpened = preOpenWindow();
  const blob = await fetchPdfBlob(rechnung, firma, "rechnung", undefined, "xrechnung");
  triggerDownload(blob, dateiname, preOpened);
}

// PDF-Vorschau in neuem Tab öffnen
export async function openAsPdf(
  rechnung: Rechnung,
  firma: Firma,
  typ: "rechnung" | "mahnung" = "rechnung",
  mahnStufe?: number
): Promise<void> {
  // Synchron öffnen, bevor das await den User-Gesture-Kontext verliert
  const newWindow = window.open("", "_blank");
  const blob = await fetchPdfBlob(rechnung, firma, typ, mahnStufe);
  const url = URL.createObjectURL(blob);
  if (newWindow && !newWindow.closed) {
    newWindow.location.href = url;
  } else {
    window.open(url, "_blank");
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
