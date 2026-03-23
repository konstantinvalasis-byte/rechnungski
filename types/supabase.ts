// ═══════════════════════════════════════════════════════════
// SUPABASE DATENBANK-TYPEN — RechnungsKI
// Projekt-ID: mdeqjuoljkxnyetqzqbu
//
// Manuell aus Schema abgeleitet (Stand: 2026-03-22).
// Für automatische Generierung (empfohlen nach Schema-Änderungen):
//   export SUPABASE_ACCESS_TOKEN=<token von supabase.com/dashboard/account/tokens>
//   npx supabase gen types typescript --project-id mdeqjuoljkxnyetqzqbu > types/supabase.ts
// ═══════════════════════════════════════════════════════════

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          firma: string | null
          inhaber: string | null
          strasse: string | null
          plz: string | null
          ort: string | null
          telefon: string | null
          web: string | null
          steuernummer: string | null
          ust_id: string | null
          bank: string | null
          iban: string | null
          bic: string | null
          gewerk: string | null
          logo: string | null
          kleinunternehmer: boolean | null
          plan: string | null
          aktualisiert_am: string | null
        }
        Insert: {
          id: string
          email?: string | null
          firma?: string | null
          inhaber?: string | null
          strasse?: string | null
          plz?: string | null
          ort?: string | null
          telefon?: string | null
          web?: string | null
          steuernummer?: string | null
          ust_id?: string | null
          bank?: string | null
          iban?: string | null
          bic?: string | null
          gewerk?: string | null
          logo?: string | null
          kleinunternehmer?: boolean | null
          plan?: string | null
          aktualisiert_am?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          firma?: string | null
          inhaber?: string | null
          strasse?: string | null
          plz?: string | null
          ort?: string | null
          telefon?: string | null
          web?: string | null
          steuernummer?: string | null
          ust_id?: string | null
          bank?: string | null
          iban?: string | null
          bic?: string | null
          gewerk?: string | null
          logo?: string | null
          kleinunternehmer?: boolean | null
          plan?: string | null
          aktualisiert_am?: string | null
        }
        Relationships: []
      }
      kunden: {
        Row: {
          id: string
          user_id: string
          name: string | null
          firma: string | null
          vorname: string | null
          nachname: string | null
          strasse: string | null
          plz: string | null
          ort: string | null
          email: string | null
          telefon: string | null
          erstellt_am: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          firma?: string | null
          vorname?: string | null
          nachname?: string | null
          strasse?: string | null
          plz?: string | null
          ort?: string | null
          email?: string | null
          telefon?: string | null
          erstellt_am?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          firma?: string | null
          vorname?: string | null
          nachname?: string | null
          strasse?: string | null
          plz?: string | null
          ort?: string | null
          email?: string | null
          telefon?: string | null
          erstellt_am?: string | null
        }
        Relationships: []
      }
      rechnungen: {
        Row: {
          id: string
          user_id: string
          kunde_id: string | null
          nummer: string
          nummer_jahr: number | null
          nummer_seq: number | null
          typ: string | null
          status: string | null
          rechnungsdatum: string | null
          faellig_am: string | null
          kunde_name: string | null
          kunde_adresse: string | null
          kunde_email: string | null
          gesamt_netto: number | null
          gesamt_mwst: number | null
          gesamt_brutto: number | null
          zahlungsziel: number | null
          fusszeile: string | null
          gewerk: string | null
          rabatt: number | null
          leistungsdatum_von: string | null
          leistungsdatum_bis: string | null
          mahnstufe: number | null
          aktualisiert_am: string | null
          erstellt_am: string | null
        }
        Insert: {
          id?: string
          user_id: string
          kunde_id?: string | null
          nummer: string
          nummer_jahr?: number | null
          nummer_seq?: number | null
          typ?: string | null
          status?: string | null
          rechnungsdatum?: string | null
          faellig_am?: string | null
          kunde_name?: string | null
          kunde_adresse?: string | null
          kunde_email?: string | null
          gesamt_netto?: number | null
          gesamt_mwst?: number | null
          gesamt_brutto?: number | null
          zahlungsziel?: number | null
          fusszeile?: string | null
          gewerk?: string | null
          rabatt?: number | null
          leistungsdatum_von?: string | null
          leistungsdatum_bis?: string | null
          mahnstufe?: number | null
          aktualisiert_am?: string | null
          erstellt_am?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          kunde_id?: string | null
          nummer?: string
          nummer_jahr?: number | null
          nummer_seq?: number | null
          typ?: string | null
          status?: string | null
          rechnungsdatum?: string | null
          faellig_am?: string | null
          kunde_name?: string | null
          kunde_adresse?: string | null
          kunde_email?: string | null
          gesamt_netto?: number | null
          gesamt_mwst?: number | null
          gesamt_brutto?: number | null
          zahlungsziel?: number | null
          fusszeile?: string | null
          gewerk?: string | null
          rabatt?: number | null
          leistungsdatum_von?: string | null
          leistungsdatum_bis?: string | null
          mahnstufe?: number | null
          aktualisiert_am?: string | null
          erstellt_am?: string | null
        }
        Relationships: []
      }
      rechnungspositionen: {
        Row: {
          id: string
          rechnung_id: string
          position: number
          beschreibung: string
          einheit: string | null
          menge: number | null
          einzelpreis: number | null
          mwst_satz: number | null
          typ: string | null
        }
        Insert: {
          id?: string
          rechnung_id: string
          position: number
          beschreibung: string
          einheit?: string | null
          menge?: number | null
          einzelpreis?: number | null
          mwst_satz?: number | null
          typ?: string | null
        }
        Update: {
          id?: string
          rechnung_id?: string
          position?: number
          beschreibung?: string
          einheit?: string | null
          menge?: number | null
          einzelpreis?: number | null
          mwst_satz?: number | null
          typ?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rechnungspositionen_rechnung_id_fkey"
            columns: ["rechnung_id"]
            isOneToOne: false
            referencedRelation: "rechnungen"
            referencedColumns: ["id"]
          }
        ]
      }
      favoriten: {
        Row: {
          id: string
          user_id: string
          beschreibung: string
          einheit: string | null
          preis: number | null
          mwst_satz: number | null
          typ: string | null
          erstellt_am: string | null
        }
        Insert: {
          id?: string
          user_id: string
          beschreibung: string
          einheit?: string | null
          preis?: number | null
          mwst_satz?: number | null
          typ?: string | null
          erstellt_am?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          beschreibung?: string
          einheit?: string | null
          preis?: number | null
          mwst_satz?: number | null
          typ?: string | null
          erstellt_am?: string | null
        }
        Relationships: []
      }
      wiederkehrend: {
        Row: {
          id: string
          user_id: string
          name: string | null
          kunde_id: string | null
          kunde_name: string | null
          kunde_adresse: string | null
          kunde_email: string | null
          positionen: Json | null
          netto: number | null
          mwst_betrag: number | null
          gesamt: number | null
          zahlungsziel: number | null
          notiz: string | null
          gewerk: string | null
          rabatt: number | null
          interval: string | null
          next_due: string | null
          aktiv: boolean | null
          erstellt_am: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          kunde_id?: string | null
          kunde_name?: string | null
          kunde_adresse?: string | null
          kunde_email?: string | null
          positionen?: Json | null
          netto?: number | null
          mwst_betrag?: number | null
          gesamt?: number | null
          zahlungsziel?: number | null
          notiz?: string | null
          gewerk?: string | null
          rabatt?: number | null
          interval?: string | null
          next_due?: string | null
          aktiv?: boolean | null
          erstellt_am?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          kunde_id?: string | null
          kunde_name?: string | null
          kunde_adresse?: string | null
          kunde_email?: string | null
          positionen?: Json | null
          netto?: number | null
          mwst_betrag?: number | null
          gesamt?: number | null
          zahlungsziel?: number | null
          notiz?: string | null
          gewerk?: string | null
          rabatt?: number | null
          interval?: string | null
          next_due?: string | null
          aktiv?: boolean | null
          erstellt_am?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Hilfstypen für komfortablen Zugriff
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateDto<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
