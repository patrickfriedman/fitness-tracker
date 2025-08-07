import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Note: supabaseAdmin is a client that can be used in the server-side
// to bypass Row Level Security (RLS).
// It is not recommended to use this client in the client-side.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
