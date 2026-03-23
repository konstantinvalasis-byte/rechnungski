"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ladeProfil, speichereProfil, ladeKunden, kundeHinzufuegen, kundeAktualisieren, kundeLoschen,
  ladeRechnungen, rechnungHinzufuegen, rechnungAktualisieren, rechnungLoeschen,
  ladeFavoriten, favoritHinzufuegen, favoritLoeschen,
  ladeWiederkehrend, wiederkehrendHinzufuegen, wiederkehrendAktualisieren, wiederkehrendLoeschen,
  ladePlan, speicherePlan,
  abmelden, angebotZuRechnung,
} from "@/lib/db";
import type { Firma, Rechnung, Kunde, FavoritItem, WiederkehrendItem } from "@/lib/db";
import { uid } from "@/lib/dashboard-utils";
import { useWiederkehrendAutoCreate } from "@/lib/useWiederkehrendAutoCreate";
import { IC } from "@/lib/dashboard-icons";
import OnboardingWizard from "@/components/dashboard/OnboardingWizard";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import NeueRechnung from "@/components/dashboard/NeueRechnung";
import RechnungenListe from "@/components/dashboard/RechnungenListe";
import KundenListe from "@/components/dashboard/KundenListe";
import WiederkehrendPage from "@/components/dashboard/WiederkehrendPage";
import UpgradeGate from "@/components/dashboard/UpgradeGate";
import AboPage from "@/components/dashboard/AboPage";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default function AppShell() {
  const [pg, setPg] = useState("dashboard");
  const [firma, setFirma] = useState<Firma | null>(null);
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [rechnungen, setRechnungen] = useState<Rechnung[]>([]);
  const [plan, setPlan] = useState("free");
  const [loaded, setLoaded] = useState(false);
  const [ladeError, setLadeError] = useState(false);
  const [ladeRetry, setLadeRetry] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [mobNav, setMobNav] = useState(false);
  const [editRe, setEditRe] = useState<Rechnung | null>(null);
  const [favoriten, setFavoriten] = useState<FavoritItem[]>([]);
  const [reSearch, setReSearch] = useState("");
  const [wiederkehrend, setWdk] = useState<WiederkehrendItem[]>([]);
  const newDocTypRef = useRef<"rechnung" | "angebot">("rechnung");

  useEffect(() => {
    let mounted = true;
    async function ladeAllesDaten() {
      try {
        const [f, k, r, fav, wdk, p] = await Promise.all([
          ladeProfil(),
          ladeKunden(),
          ladeRechnungen(),
          ladeFavoriten(),
          ladeWiederkehrend(),
          ladePlan(),
        ]);
        if (!mounted) return;
        setFirma(f); setKunden(k); setRechnungen(r); setFavoriten(fav); setWdk(wdk); setPlan(p); setLoaded(true);
        if (!f || !f.name) setPg("onboarding");
      } catch (e) {
        console.error("Fehler beim Laden:", e);
        if (mounted) setLadeError(true);
      }
    }
    ladeAllesDaten();
    return () => { mounted = false; };
  }, [ladeRetry]);

  const router = useRouter();
  const showT = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2800); };

  // Fällige wiederkehrende Rechnungen automatisch erstellen (ausgelagert in Custom Hook)
  useWiederkehrendAutoCreate(loaded, wiederkehrend, rechnungen, setRechnungen, showT);
  const sf = async (f: Firma | null) => { if (!f) return; setFirma(f); await speichereProfil(f); showT("Gespeichert!"); };
  const spl = async (p: string) => { setPlan(p); await speicherePlan(p); showT(`Plan: ${p.toUpperCase()}`); };
  const addRe = async (r: Rechnung) => { const gespeichert = await rechnungHinzufuegen(r); setRechnungen(prev => [...prev, gespeichert]); showT("Erstellt!"); };
  const delKu = async (kid: string) => { await kundeLoschen(kid); setKunden(prev => prev.filter(k => k.id !== kid)); };
  const updKu = async (kid: string, up: Partial<Kunde>) => { await kundeAktualisieren(kid, up); setKunden(prev => prev.map(k => k.id === kid ? { ...k, ...up } : k)); };
  const addFav = async (pos: Omit<FavoritItem, "id">) => { const exists = favoriten.find(f => f.beschreibung === pos.beschreibung); if (exists) return; const neu = await favoritHinzufuegen(pos); setFavoriten(prev => [...prev, neu]); showT("Favorit gespeichert!"); };
  const delFav = async (fid: string) => { await favoritLoeschen(fid); setFavoriten(prev => prev.filter(f => f.id !== fid)); };
  const addWdk = async (w: Omit<WiederkehrendItem, "id">) => { const neu = await wiederkehrendHinzufuegen(w); setWdk(prev => [...prev, neu]); };
  const updWdk = async (id: string, up: Partial<WiederkehrendItem>) => { await wiederkehrendAktualisieren(id, up); setWdk(prev => prev.map(w => w.id === id ? { ...w, ...up } : w)); };
  const delWdk = async (id: string) => { await wiederkehrendLoeschen(id); setWdk(prev => prev.filter(w => w.id !== id)); };
  const updRe = async (rid: string, up: Partial<Rechnung>) => { try { await rechnungAktualisieren(rid, up); setRechnungen(prev => prev.map(r => r.id === rid ? { ...r, ...up } : r)); } catch (e) { console.error("Fehler bei rechnungAktualisieren:", e); showT("Fehler beim Speichern. Bitte versuche es erneut."); } };
  const addKu = async (k: Omit<Kunde, "id">): Promise<Kunde> => { const ex = kunden.find(x => x.name === k.name && x.strasse === k.strasse); if (ex) return ex; const nk = await kundeHinzufuegen(k); setKunden(prev => [...prev, nk]); return nk; };
  const dupRe = async (o: Rechnung) => { const d = new Date().toISOString().split("T")[0]; const fdt = new Date(); fdt.setDate(fdt.getDate() + (o.zahlungsziel || 14)); await addRe({ ...o, id: uid(), nummer: "", datum: d, faelligDatum: fdt.toISOString().split("T")[0], status: "offen" }); };
  const delRe = async (rid: string) => { await rechnungLoeschen(rid); setRechnungen(prev => prev.filter(r => r.id !== rid)); };
  const konvertierAngebot = async (rid: string, datum: string) => { const neueNummer = await angebotZuRechnung(rid, datum); setRechnungen(prev => prev.map(r => r.id === rid ? { ...r, status: "offen", typ: "rechnung", nummer: neueNummer } : r)); showT("Angebot in Rechnung umgewandelt!"); };
  const logout = async () => { await abmelden(); router.push("/?abgemeldet=1"); router.refresh(); };
  const nxtNr = () => { const y = new Date().getFullYear(); const prefix = `RE-${y}-`; const maxNr = rechnungen.filter(r => r.nummer?.startsWith(prefix)).reduce((max, r) => { const n = parseInt(r.nummer.slice(prefix.length), 10); return isNaN(n) ? max : Math.max(max, n); }, 0); return `${prefix}${String(maxNr + 1).padStart(4, "0")}`; };
  const nxtAnNr = () => { const y = new Date().getFullYear(); const prefix = `AN-${y}-`; const maxNr = rechnungen.filter(r => r.nummer?.startsWith(prefix)).reduce((max, r) => { const n = parseInt(r.nummer.slice(prefix.length), 10); return isNaN(n) ? max : Math.max(max, n); }, 0); return `${prefix}${String(maxNr + 1).padStart(4, "0")}`; };
  const lim = { free: { re: 5, ku: 3 }, starter: { re: 50, ku: 25 }, pro: { re: 500, ku: 999 }, enterprise: { re: 99999, ku: 99999 } }[plan] || { re: 5, ku: 3 };
  const nav = (p: string, search?: string) => {
    if (p !== "neue-rechnung") newDocTypRef.current = "rechnung";
    if (p === "neue-rechnung") setEditRe(null);
    setPg(p); setMobNav(false); const s = search ?? ""; if (search !== undefined) setReSearch(s); else setReSearch(""); window.history.pushState({ pg: p, reSearch: s }, "");
  };
  const navNewDoc = (typ: "rechnung" | "angebot") => {
    newDocTypRef.current = typ;
    setPg("neue-rechnung"); setMobNav(false); setReSearch(""); window.history.pushState({ pg: "neue-rechnung", reSearch: "" }, "");
  };

  useEffect(() => {
    if (!loaded) return;
    window.history.replaceState({ pg, reSearch }, "");
    const onPop = (e: PopStateEvent) => {
      if (e.state?.pg) { setPg(e.state.pg); setReSearch(e.state.reSearch ?? ""); setMobNav(false); }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const completeOnboarding = async (firmaData: Firma) => {
    try {
      await sf(firmaData);
      setPg("dashboard");
      showT("Willkommen bei RechnungsKI!");
    } catch (e) {
      console.error("Fehler beim Speichern der Firmendaten:", e);
      showT("Fehler beim Speichern. Bitte versuche es erneut.");
    }
  };

  if (ladeError) return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#050510] gap-4">
      <div className="w-12 h-12 rounded-2xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center text-danger-400">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div className="text-center">
        <p className="text-slate-200 font-semibold text-[15px]">Daten konnten nicht geladen werden</p>
        <p className="text-slate-500 text-[13px] mt-1">Bitte überprüfe deine Internetverbindung.</p>
      </div>
      <button
        onClick={() => { setLadeError(false); setLadeRetry(r => r + 1); }}
        className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-[13px] font-medium transition-colors cursor-pointer border-none"
      >
        Erneut versuchen
      </button>
    </div>
  );

  if (!loaded) return (
    <div className="flex min-h-screen bg-[#050510] animate-pulse">
      {/* Sidebar-Skeleton */}
      <div className="hidden md:flex w-[240px] bg-[#0a0a1a]/70 border-r border-white/[0.06] flex-col py-5 px-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-white/[0.06]" />
          <div className="flex flex-col gap-1.5"><div className="h-3 w-24 bg-white/[0.06] rounded" /><div className="h-2 w-14 bg-white/[0.04] rounded" /></div>
        </div>
        <div className="flex flex-col gap-1">
          {[...Array(6)].map((_, i) => <div key={i} className="h-9 rounded-xl bg-white/[0.04]" />)}
        </div>
      </div>
      {/* Haupt-Skeleton */}
      <div className="flex-1 p-7 max-md:p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div className="flex flex-col gap-2"><div className="h-7 w-48 bg-white/[0.06] rounded-lg" /><div className="h-3 w-64 bg-white/[0.04] rounded" /></div>
          <div className="flex gap-2.5"><div className="h-9 w-28 bg-white/[0.04] rounded-xl" /><div className="h-10 w-36 bg-white/[0.06] rounded-xl" /></div>
        </div>
        {/* KPI-Cards */}
        <div className="grid grid-cols-4 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0a0a1a]/80 rounded-2xl p-4 border border-white/[0.06]">
              <div className="h-2.5 w-16 bg-white/[0.06] rounded mb-3" />
              <div className="h-7 w-24 bg-white/[0.08] rounded-lg mb-2" />
              <div className="h-2.5 w-20 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
        {/* Chart + Aktivität */}
        <div className="grid grid-cols-[1.7fr_1fr] max-md:grid-cols-1 gap-3 mb-5">
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
            <div className="h-4 w-36 bg-white/[0.06] rounded mb-4" />
            <div className="flex items-end gap-2.5 h-[150px]">
              {[...Array(6)].map((_, i) => <div key={i} className="flex-1 bg-white/[0.04] rounded-t-md" style={{ height: `${30 + Math.random() * 60}%` }} />)}
            </div>
          </div>
          <div className="bg-[#0a0a1a]/80 rounded-2xl p-5 border border-white/[0.06]">
            <div className="h-4 w-28 bg-white/[0.06] rounded mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5"><div className="h-3 w-3/4 bg-white/[0.06] rounded" /><div className="h-2.5 w-1/2 bg-white/[0.04] rounded" /></div>
                <div className="h-3 w-14 bg-white/[0.06] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Show onboarding fullscreen
  if (pg === "onboarding") return <OnboardingWizard onComplete={completeOnboarding} />;

  const navItems = [
    { id: "dashboard", icon: IC.dash, l: "Dashboard" }, { id: "neue-rechnung", icon: IC.doc, l: "Neue Rechnung" },
    { id: "rechnungen", icon: IC.euro, l: "Rechnungen" }, { id: "kunden", icon: IC.users, l: "Kunden" },
    { id: "wiederkehrend", icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>, l: "Wiederkehrend" },
    { id: "abo", icon: IC.crown, l: "Abo & Preise" },
    { id: "settings", icon: IC.gear, l: "Einstellungen" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans bg-[#050510] text-slate-200">
      {/* Mobile header */}
      <div className="hidden max-md:flex sticky top-0 z-50 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 py-3 items-center gap-3">
        <button className="bg-transparent border-none text-slate-200 cursor-pointer flex p-1 hover:text-white transition-colors" onClick={() => setMobNav(!mobNav)}>{mobNav ? IC.x : IC.menu}</button>
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-[10px]">{IC.star}</div>
        <span className="font-bold text-[15px] tracking-tight">RechnungsKI</span>
        <span className="text-[9px] font-bold text-brand-400 uppercase tracking-wider ml-0.5 bg-brand-500/10 px-1.5 py-0.5 rounded">{plan.toUpperCase()}</span>
      </div>

      {/* Sidebar — Glassmorphism */}
      <nav className={`w-[240px] bg-[#0a0a1a]/70 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col py-5 px-3 shrink-0 sticky top-0 h-screen z-[100] max-md:fixed max-md:left-[-280px] max-md:top-0 max-md:bottom-0 max-md:w-[260px] max-md:transition-[left] max-md:duration-300 max-md:ease-[cubic-bezier(0.16,1,0.3,1)] ${mobNav ? "max-md:!left-0" : ""}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.25)]">{IC.star}</div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">RechnungsKI</div>
            <div className="text-[9px] font-bold text-brand-400 uppercase tracking-[0.08em]">{plan} Plan</div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-0.5 flex-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => nav(n.id)}
              className={`group flex items-center gap-2.5 py-2 px-3 border-none rounded-xl cursor-pointer text-[13px] font-medium text-left relative transition-all duration-200 ${pg === n.id ? "bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" : "bg-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"}`}>
              <span className={`flex transition-all duration-200 ${pg === n.id ? "text-brand-400" : "opacity-40 group-hover:opacity-70"}`}>{n.icon}</span>
              <span>{n.l}</span>
              {n.id === "rechnungen" && rechnungen.filter(r => r.status === "offen").length > 0 && (
                <span className="absolute right-2.5 bg-danger-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]">{rechnungen.filter(r => r.status === "offen").length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Usage bar */}
        <div className="border-t border-white/[0.06] pt-4 mt-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[10px] text-slate-500 font-medium">Rechnungen</span>
            <span className="text-[10px] text-slate-500 font-mono">{rechnungen.length}/{lim.re === 99999 ? "∞" : lim.re}</span>
          </div>
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mx-1">
            <div className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-[width] duration-500 ease-out" style={{ width: `${Math.min(rechnungen.length / lim.re * 100, 100)}%` }} />
          </div>
          <button onClick={logout} className="mt-3 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200 border-none cursor-pointer bg-transparent">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Abmelden
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto max-md:pb-[58px]" id="main-content">
        {pg === "dashboard" && <DashboardOverview {...{ rechnungen, kunden, firma, nav, navNewDoc, updRe, addRe, addKu, nxtNr, plan, lim }} />}
        {pg === "neue-rechnung" && <NeueRechnung {...{ firma, kunden, addKu, addRe, updRe, nextNr: nxtNr(), nextAnNr: nxtAnNr(), nav, plan, lim, canCreate: rechnungen.length < lim.re, editRechnung: editRe, onEditDone: () => setEditRe(null), favoriten, addFav, delFav, initDocTyp: newDocTypRef.current }} />}
        {pg === "rechnungen" && <RechnungenListe {...{ rechnungen, updRe, delRe, nav, dupRe, firma, onEdit: r => { setEditRe(r); setPg("neue-rechnung"); window.history.pushState({ pg: "neue-rechnung", reSearch: "" }, ""); }, initialSearch: reSearch, showT, nxtNr, plan, konvertierAngebot }} />}
        {pg === "kunden" && <KundenListe {...{ kunden, rechnungen, updKu, delKu }} />}
        {pg === "wiederkehrend" && (plan === "free" ? <UpgradeGate feature="Wiederkehrende Rechnungen" desc="Automatisch wiederkehrende Rechnungen erstellen – ab dem Starter-Plan." nav={nav} /> : <WiederkehrendPage {...{ wiederkehrend, addWdk, updWdk, delWdk, kunden, rechnungen, firma }} />)}
        {pg === "abo" && <AboPage {...{ plan, spl }} />}
{pg === "settings" && <SettingsPage {...{ firma, sf, rechnungen, kunden, sre: (r: Rechnung[]) => setRechnungen(r), skn: (k: Kunde[]) => setKunden(k), favoriten, setFavoriten, wiederkehrend, saveWdk: (w: WiederkehrendItem[]) => setWdk(w), plan, spl, showT }} />}
      </main>

      {/* Toast — premium */}
      {toast && <div className="fixed bottom-5 right-5 max-md:right-4 max-md:left-4 max-md:bottom-[4.5rem] bg-[#0f0f1a]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-2 text-[13px] font-medium animate-fade-up z-[999] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"><span className="text-success-500 flex">{IC.check}</span>{toast}</div>}

      {/* Mobile overlay */}
      {mobNav && <div className="max-md:block hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity" onClick={() => setMobNav(false)} />}

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[80] bg-[#0a0a1a]/95 backdrop-blur-2xl border-t border-white/[0.06] flex items-stretch" style={{ height: "calc(58px + env(safe-area-inset-bottom, 0px))", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        {[
          { id: "dashboard", icon: IC.dash, l: "Home" },
          { id: "neue-rechnung", icon: IC.plus, l: "Neu", accent: true },
          { id: "rechnungen", icon: IC.euro, l: "Rechnungen" },
          { id: "kunden", icon: IC.users, l: "Kunden" },
          { id: "settings", icon: IC.gear, l: "Mehr" },
        ].map(n => (
          <button
            key={n.id}
            onClick={() => { nav(n.id); setMobNav(false); }}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 border-none cursor-pointer transition-all duration-200 relative ${
              pg === n.id
                ? "text-brand-400 bg-transparent"
                : "text-slate-500 bg-transparent hover:text-slate-300"
            } ${(n as { accent?: boolean }).accent ? "text-white" : ""}`}
          >
            {(n as { accent?: boolean }).accent ? (
              <span className={`flex w-8 h-8 items-center justify-center rounded-xl ${pg === n.id ? "bg-brand-500 shadow-[0_0_16px_rgba(99,102,241,0.4)]" : "bg-brand-600/80"} transition-all duration-200`}>
                {n.icon}
              </span>
            ) : (
              <>
                <span className={`flex transition-all duration-200 ${pg === n.id ? "text-brand-400 scale-110" : ""}`}>
                  {n.icon}
                </span>
                <span className="text-[9px] font-medium tracking-wide">{n.l}</span>
                {n.id === "rechnungen" && rechnungen.filter(r => r.status === "offen").length > 0 && (
                  <span className="absolute top-1.5 right-[calc(50%-14px)] w-2 h-2 bg-danger-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                )}
              </>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
