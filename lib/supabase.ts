import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Create a single supabase client for interacting with your database
// This is for client-side usage where the public anon key is safe to use.
// For server-side, use `lib/supabase-server.ts` or `lib/supabase-browser.ts`
// depending on the context (Server Components/Actions vs. Client Components).

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
