"use client";
import { createContext, useContext } from "react";
import type { Rechnung } from "@/lib/db";

export type NavContextType = {
  pg: string;
  mobNav: boolean;
  setMobNav: (v: boolean) => void;
  reSearch: string;
  editRe: Rechnung | null;
  setEditRe: (r: Rechnung | null) => void;
  newDocTyp: "rechnung" | "angebot";
  initKundeId: string | null;
  nav: (p: string, search?: string) => void;
  navNewDoc: (typ: "rechnung" | "angebot") => void;
  navEdit: (r: Rechnung) => void;
  navNewDocForKunde: (kundeId: string) => void;
};

export const NavigationContext = createContext<NavContextType | null>(null);

export function useNavigation(): NavContextType {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation muss innerhalb von NavigationContext.Provider verwendet werden");
  return ctx;
}
