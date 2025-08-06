import { createClient as createServiceRoleClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side Supabase client (for Server Actions/Route Handlers that need service role)
export function getServiceRoleClient() {
  // This client is for server-side operations that require service role access
  // It should NEVER be exposed to the client-side.
  return createServiceRoleClient<Database>(
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
