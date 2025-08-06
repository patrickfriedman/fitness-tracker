import { createClient } from '@supabase/supabase-js'

// Define the Database type according to your Supabase schema
export type Database = {
  // Example tables
  users: {
    id: string;
    name: string;
    email: string;
    // add other fields as needed
  };
  workouts: {
    id: string;
    user_id: string;
    date: string;
    // add other fields as needed
  };
  // Add other tables and types as needed
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single Supabase client instance for the browser
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Admin client for server-side operations only
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create admin client on the server side
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eWZ6emNsZW95d3RtaHdueGl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTk4MDIxNiwiZXhwIjoyMDY1NTU2MjE2fQ.zlv5gpg7bxf2X0QJXNcsH1vOyJSC8zCheJyr10zwZB8',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
