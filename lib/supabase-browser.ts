'use client'

import { createBrowserClient } from '@supabase/ssr'
import { type Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { Database } from '@/types/supabase'

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// This is a singleton pattern for the client-side Supabase client
// to prevent multiple instances and potential issues.
let supabaseBrowserClient: ReturnType<typeof createSupabaseBrowserClient> | undefined

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createSupabaseBrowserClient()
  }
  return supabaseBrowserClient
}

// Optional: A hook to get the current session on the client
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return session
}
