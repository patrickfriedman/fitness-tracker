'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { getBrowserClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginDemoUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getBrowserClient()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
        if (event === 'SIGNED_OUT') {
          router.push('/login')
        } else if (event === 'SIGNED_IN' && session?.user) {
          router.push('/dashboard')
        }
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [router, supabase])

  const loginDemoUser = async () => {
    setLoading(true)
    try {
      // Simulate a demo user login without actual Supabase auth for simplicity
      // In a real app, you might have a dedicated demo user in Supabase
      const demoUser: User = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        app_metadata: { provider: 'email' },
        user_metadata: { username: 'DemoUser' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
      }
      setUser(demoUser)
      toast({
        title: 'Demo Login Successful',
        description: 'You are now logged in as a demo user.',
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Demo login failed:', error)
      toast({
        title: 'Demo Login Failed',
        description: 'Could not log in as demo user.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginDemoUser }}>
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
