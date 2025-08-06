'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabase-browser'

interface AuthContextType {
  session: Session | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children, initialSession }: { children: ReactNode; initialSession: Session | null }) => {
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getBrowserClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setIsLoading(false)
    })

    // Initial check if session is already available (e.g., from SSR)
    if (initialSession) {
      setIsLoading(false)
    } else {
      // If no initial session, try to get it client-side
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        setSession(currentSession)
        setIsLoading(false)
      })
    }

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialSession])

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
