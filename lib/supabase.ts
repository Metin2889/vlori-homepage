import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

/** Server-only Supabase-Client mit Service-Role-Key. `null`, solange keine Datenbank konfiguriert ist. */
export function db(): SupabaseClient | null {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null
    client ??= createClient(url, key, { auth: { persistSession: false } })
    return client
}

export const hasDb = () => !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
