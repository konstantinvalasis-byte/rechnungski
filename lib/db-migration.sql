-- ═══════════════════════════════════════════════════════════
-- RLS-POLICIES (BE-05)
-- Jede user-bezogene Tabelle hat RLS ENABLED und mindestens
-- eine SELECT- und eine Mutating-Policy auf auth.uid().
-- Stand: 2026-03-22
-- ═══════════════════════════════════════════════════════════

-- ── profiles ─────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- ── kunden ───────────────────────────────────────────────
ALTER TABLE kunden ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kunden_select_own" ON kunden;
CREATE POLICY "kunden_select_own" ON kunden
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "kunden_insert_own" ON kunden;
CREATE POLICY "kunden_insert_own" ON kunden
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "kunden_update_own" ON kunden;
CREATE POLICY "kunden_update_own" ON kunden
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "kunden_delete_own" ON kunden;
CREATE POLICY "kunden_delete_own" ON kunden
  FOR DELETE USING (auth.uid() = user_id);

-- ── rechnungen ───────────────────────────────────────────
ALTER TABLE rechnungen ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rechnungen_select_own" ON rechnungen;
CREATE POLICY "rechnungen_select_own" ON rechnungen
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "rechnungen_insert_own" ON rechnungen;
CREATE POLICY "rechnungen_insert_own" ON rechnungen
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "rechnungen_update_own" ON rechnungen;
CREATE POLICY "rechnungen_update_own" ON rechnungen
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "rechnungen_delete_own" ON rechnungen;
CREATE POLICY "rechnungen_delete_own" ON rechnungen
  FOR DELETE USING (auth.uid() = user_id);

-- ── rechnungspositionen ──────────────────────────────────
-- Zugriff über JOIN auf rechnungen (kein direktes user_id)
ALTER TABLE rechnungspositionen ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rechnungspositionen_select_own" ON rechnungspositionen;
CREATE POLICY "rechnungspositionen_select_own" ON rechnungspositionen
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rechnungen r
      WHERE r.id = rechnungspositionen.rechnung_id
        AND r.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "rechnungspositionen_insert_own" ON rechnungspositionen;
CREATE POLICY "rechnungspositionen_insert_own" ON rechnungspositionen
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rechnungen r
      WHERE r.id = rechnungspositionen.rechnung_id
        AND r.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "rechnungspositionen_update_own" ON rechnungspositionen;
CREATE POLICY "rechnungspositionen_update_own" ON rechnungspositionen
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM rechnungen r
      WHERE r.id = rechnungspositionen.rechnung_id
        AND r.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "rechnungspositionen_delete_own" ON rechnungspositionen;
CREATE POLICY "rechnungspositionen_delete_own" ON rechnungspositionen
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM rechnungen r
      WHERE r.id = rechnungspositionen.rechnung_id
        AND r.user_id = auth.uid()
    )
  );

-- ── favoriten ────────────────────────────────────────────
ALTER TABLE favoriten ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favoriten_select_own" ON favoriten;
CREATE POLICY "favoriten_select_own" ON favoriten
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favoriten_insert_own" ON favoriten;
CREATE POLICY "favoriten_insert_own" ON favoriten
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favoriten_update_own" ON favoriten;
CREATE POLICY "favoriten_update_own" ON favoriten
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favoriten_delete_own" ON favoriten;
CREATE POLICY "favoriten_delete_own" ON favoriten
  FOR DELETE USING (auth.uid() = user_id);

-- ── wiederkehrend ────────────────────────────────────────
ALTER TABLE wiederkehrend ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wiederkehrend_select_own" ON wiederkehrend;
CREATE POLICY "wiederkehrend_select_own" ON wiederkehrend
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wiederkehrend_insert_own" ON wiederkehrend;
CREATE POLICY "wiederkehrend_insert_own" ON wiederkehrend
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wiederkehrend_update_own" ON wiederkehrend;
CREATE POLICY "wiederkehrend_update_own" ON wiederkehrend
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wiederkehrend_delete_own" ON wiederkehrend;
CREATE POLICY "wiederkehrend_delete_own" ON wiederkehrend
  FOR DELETE USING (auth.uid() = user_id);

-- ───────────────────────────────────────────────────────────
-- Fehlende Spalten in rechnungen ergänzen
alter table rechnungen
  add column if not exists typ               text default 'rechnung',
  add column if not exists kunde_name        text,
  add column if not exists kunde_adresse     text,
  add column if not exists kunde_email       text,
  add column if not exists zahlungsziel      int default 14,
  add column if not exists gewerk            text,
  add column if not exists rabatt            numeric(5,2) default 0,
  add column if not exists leistungsdatum_von date,
  add column if not exists leistungsdatum_bis date,
  add column if not exists mahnstufe         int default 0,
  add column if not exists aktualisiert_am   timestamptz default now();

-- typ Spalte in rechnungspositionen ergänzen
alter table rechnungspositionen
  add column if not exists typ text default 'arbeit';

-- ═══════════════════════════════════════════════════════════
-- AUDIT-LOGS (§239 HGB — Revisionssicherheit)
-- Protokolliert alle Änderungen an Rechnungen und Kunden.
-- Einträge dürfen NUR hinzugefügt, niemals geändert oder
-- gelöscht werden (Unveränderlichkeit per RLS erzwungen).
-- Stand: 2026-03-24
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tabelle       text NOT NULL,           -- z.B. 'rechnungen', 'kunden'
  datensatz_id  uuid NOT NULL,           -- ID des betroffenen Datensatzes
  aktion        text NOT NULL            -- 'erstellt', 'geaendert', 'geloescht', 'storniert', 'mahnung'
                CHECK (aktion IN ('erstellt', 'geaendert', 'geloescht', 'storniert', 'mahnung')),
  alte_werte    jsonb,                   -- Snapshot vor der Änderung (NULL bei erstellt)
  neue_werte    jsonb,                   -- Snapshot nach der Änderung (NULL bei geloescht)
  zeitpunkt     timestamptz NOT NULL DEFAULT now()
);

-- Index für schnelle Abfragen pro Nutzer und Datensatz
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx       ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_datensatz_id_idx  ON audit_logs(datensatz_id);
CREATE INDEX IF NOT EXISTS audit_logs_zeitpunkt_idx     ON audit_logs(zeitpunkt DESC);

-- RLS: Nutzer darf nur eigene Logs lesen, nie schreiben/löschen
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_select_own" ON audit_logs;
CREATE POLICY "audit_logs_select_own" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- INSERT nur über Service-Role (Cron / API-Routen) oder direkt via DB-Trigger
-- Kein UPDATE, kein DELETE für Nutzer — Unveränderlichkeit garantiert

-- ═══════════════════════════════════════════════════════════
-- STRIPE-SPALTEN in profiles (Schritt 4 Stripe-Integration)
-- Stand: 2026-03-26
-- ═══════════════════════════════════════════════════════════

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id      text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id  text,
  ADD COLUMN IF NOT EXISTS plan                    text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status     text NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS plan_period             text NOT NULL DEFAULT 'monthly'; -- 'monthly' | 'yearly'

-- Unique-Index damit kein Nutzer zwei Customer-IDs bekommt
CREATE UNIQUE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- Webhook-Handler darf profiles über service_role updaten (kein RLS-Block)
-- (service_role key wird nur serverseitig verwendet — nie im Frontend)
