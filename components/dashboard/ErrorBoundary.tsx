"use client";
import { Component } from "react";

interface ErrorBoundaryState { hasError: boolean; }

export default class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e: Error, i: React.ErrorInfo) { console.error("RechnungsKI:", e, i); }
  render() {
    if (this.state.hasError) return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050510] text-slate-200 gap-5 p-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-danger-500/20 to-danger-600/10 border border-danger-500/20 flex items-center justify-center text-3xl backdrop-blur-sm">⚠️</div>
        <h2 className="text-xl font-bold tracking-tight">Unerwarteter Fehler</h2>
        <p className="text-sm text-slate-500 text-center max-w-sm leading-relaxed">Die App hat einen Fehler. Deine Daten sind sicher – bitte lade die Seite neu.</p>
        <button className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl cursor-pointer text-sm font-semibold hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all duration-200" onClick={() => window.location.reload()}>Neu laden</button>
      </div>
    );
    return this.props.children;
  }
}
