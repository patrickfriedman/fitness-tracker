import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function getBrowserClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

export function getServiceRoleClient() {
  // This client is for server-side operations that require service role access
  // It should NEVER be exposed to the client-side.
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
