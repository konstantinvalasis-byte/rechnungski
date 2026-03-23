import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Service-Role-Client für Server-seitige Cron-Jobs.
// NIEMALS im Browser oder in Client Components verwenden —
// der Service-Role-Key umgeht alle RLS-Regeln.
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY oder NEXT_PUBLIC_SUPABASE_URL fehlt in .env.local')
  }

  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
