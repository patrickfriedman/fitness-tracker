'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useToast } from '@/components/ui/use-toast'

interface AuthContextType {
  session: Session | null
  user: User | null
  isLoading: boolean
  loginDemoUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession)
      setUser(initialSession?.user || null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const loginDemoUser = async () => {
    setIsLoading(true)
    const demoEmail = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || 'demo@example.com';
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD || 'demopassword';

    const { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    })

    if (error) {
      toast({
        title: 'Demo Login Failed',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Demo Login Successful',
        description: 'You are now logged in with a demo account.',
      })
    }
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider value={{ session, user, isLoading, loginDemoUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
