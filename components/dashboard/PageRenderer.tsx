"use client";
import type { Firma, Rechnung, Kunde, FavoritItem, WiederkehrendItem } from "@/lib/db";
import { useNavigation } from "@/components/dashboard/NavigationContext";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import NeueRechnung from "@/components/dashboard/NeueRechnung";
import RechnungenListe from "@/components/dashboard/RechnungenListe";
import KundenListe from "@/components/dashboard/KundenListe";
import WiederkehrendPage from "@/components/dashboard/WiederkehrendPage";
import UpgradeGate from "@/components/dashboard/UpgradeGate";
import AboPage from "@/components/dashboard/AboPage";
import SettingsPage from "@/components/dashboard/SettingsPage";
import HelpSection from "@/components/dashboard/HelpSection";

type Props = {
  firma: Firma | null;
  kunden: Kunde[];
  rechnungen: Rechnung[];
  favoriten: FavoritItem[];
  wiederkehrend: WiederkehrendItem[];
  plan: string;
  lim: { re: number; ku: number };
  addRe: (r: Rechnung) => Promise<void>;
  updRe: (rid: string, up: Partial<Rechnung>) => Promise<void>;
  delRe: (rid: string) => Promise<void>;
  dupRe: (o: Rechnung) => Promise<void>;
  addKu: (k: Omit<Kunde, "id">) => Promise<Kunde>;
  updKu: (kid: string, up: Partial<Kunde>) => Promise<void>;
  delKu: (kid: string) => Promise<void>;
  addFav: (pos: Omit<FavoritItem, "id">) => void;
  updFav: (fid: string, up: Omit<FavoritItem, "id">) => void;
  delFav: (fid: string) => void;
  addWdk: (w: Omit<WiederkehrendItem, "id">) => void;
  updWdk: (id: string, up: Partial<WiederkehrendItem>) => void;
  delWdk: (id: string) => void;
  sf: (f: Firma | null) => Promise<void>;
  spl: (p: string) => Promise<void>;
  showT: (m: string) => void;
  konvertierAngebot: (rid: string, datum: string) => Promise<void>;
  nxtNr: () => string;
  nxtAnNr: () => string;
  setRechnungen: (r: Rechnung[]) => void;
  setKunden: (k: Kunde[]) => void;
  setFavoriten: (f: FavoritItem[]) => void;
  setWdk: (w: WiederkehrendItem[]) => void;
};

export default function PageRenderer(props: Props) {
  const { firma, kunden, rechnungen, favoriten, wiederkehrend, plan, lim, addRe, updRe, delRe, dupRe, addKu, updKu, delKu, addFav, updFav, delFav, addWdk, updWdk, delWdk, sf, spl, showT, konvertierAngebot, nxtNr, nxtAnNr, setRechnungen, setKunden, setFavoriten, setWdk } = props;
  const { pg, nav, navNewDoc, editRe, setEditRe, navEdit, reSearch, newDocTyp, initKundeId } = useNavigation();

  const initGewerk = initKundeId
    ? [...rechnungen].filter(r => r.kundeId === initKundeId && r.gewerk).sort((a, b) => (b.datum ?? "").localeCompare(a.datum ?? ""))[0]?.gewerk ?? ""
    : "";

  return (
    <main className="flex-1 min-w-0 overflow-y-auto max-md:pb-[58px]" id="main-content">
      {pg === "dashboard" && <DashboardOverview {...{ rechnungen, kunden, firma, nav, navNewDoc, updRe, addRe, addKu, nxtNr, plan, lim }} />}
      {pg === "neue-rechnung" && <NeueRechnung {...{ firma, kunden, addKu, addRe, updRe, nextNr: nxtNr(), nextAnNr: nxtAnNr(), nav, plan, lim, canCreate: rechnungen.length < lim.re, editRechnung: editRe, onEditDone: () => setEditRe(null), favoriten, addFav, updFav, delFav, initDocTyp: newDocTyp, initKundeId, initGewerk }} />}
      {pg === "rechnungen" && <RechnungenListe {...{ rechnungen, updRe, delRe, nav, dupRe, firma, onEdit: navEdit, initialSearch: reSearch, showT, nxtNr, plan, konvertierAngebot }} />}
      {pg === "kunden" && <KundenListe {...{ kunden, rechnungen, updKu, delKu }} />}
      {pg === "wiederkehrend" && (plan === "free" ? <UpgradeGate feature="Wiederkehrende Rechnungen" desc="Automatisch wiederkehrende Rechnungen erstellen – ab dem Starter-Plan." nav={nav} /> : <WiederkehrendPage {...{ wiederkehrend, addWdk, updWdk, delWdk, kunden, rechnungen, firma }} />)}
      {pg === "abo" && <AboPage {...{ plan, spl }} />}
      {pg === "hilfe" && (
        <div className="p-6 px-7 max-md:p-4 animate-fade-in">
          <div className="mb-6"><h1 className="text-xl font-bold tracking-tight">Hilfe & FAQ</h1><p className="text-[13px] text-slate-500 mt-1">Antworten auf die häufigsten Fragen</p></div>
          <HelpSection />
        </div>
      )}
      {pg === "settings" && <SettingsPage {...{ firma, sf, rechnungen, kunden, sre: setRechnungen, skn: setKunden, favoriten, setFavoriten, wiederkehrend, saveWdk: setWdk, plan, spl, showT }} />}
    </main>
  );
}
