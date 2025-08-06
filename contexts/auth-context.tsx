'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { User } from '@/types/fitness'
import { useRouter } from 'next/navigation'
import { signIn, signUp, signOut, deleteAccount as deleteAccountAction } from '@/app/actions/auth-actions'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const router = useRouter()
  const supabase = getBrowserClient()

  const fetchUser = useCallback(async () => {
    setLoading(true)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Error fetching session:', sessionError.message)
      setUser(null)
      setIsDemo(false)
      setLoading(false)
      return
    }

    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Error fetching user profile:', profileError.message)
        setUser(null)
        setIsDemo(false)
      } else {
        setUser({
          id: profile.id,
          email: profile.email || session.user.email!,
          username: profile.name || session.user.user_metadata.username,
          primary_goal: profile.primary_goal,
          preferences: profile.preferences,
          created_at: profile.created_at,
        })
        setIsDemo(false)
      }
    } else {
      setUser(null)
      setIsDemo(false)
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        fetchUser()
      }
    })

    // Check for demo user in local storage on initial load
    const storedIsDemo = localStorage.getItem('isDemoUser') === 'true';
    if (storedIsDemo) {
      setIsDemo(true);
      setUser({
        id: 'demo-user-id',
        username: 'DemoUser',
        email: 'demo@example.com',
        primary_goal: 'general_fitness',
        preferences: {},
        created_at: new Date().toISOString(),
      });
      setLoading(false);
    }

    return () => {
      authListener.unsubscribe()
    }
  }, [fetchUser, supabase])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    const result = await signIn(formData)
    if (!result.success) {
      throw new Error(result.message)
    }
    // fetchUser will be called by onAuthStateChange
  }

  const register = async (email: string, password: string, username: string) => {
    setLoading(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('username', username)
    const result = await signUp(formData)
    if (!result.success) {
      throw new Error(result.message)
    }
    // fetchUser will be called by onAuthStateChange
  }

  const logout = async () => {
    setLoading(true)
    const result = await signOut()
    if (!result.success) {
      throw new Error(result.message)
    }
    setIsDemo(false);
    localStorage.removeItem('isDemoUser');
    setUser(null);
    router.push('/login'); // Redirect to login after logout
  }

  const loginDemo = async () => {
    setLoading(true);
    // Simulate a demo user login
    setIsDemo(true);
    localStorage.setItem('isDemoUser', 'true');
    setUser({
      id: 'demo-user-id', // A consistent ID for the demo user
      username: 'DemoUser',
      email: 'demo@example.com',
      primary_goal: 'general_fitness',
      preferences: {},
      created_at: new Date().toISOString(),
    });
    setLoading(false);
    router.push('/'); // Redirect to home page
  };

  const deleteAccount = async () => {
    setLoading(true);
    const result = await deleteAccountAction();
    if (!result.success) {
      throw new Error(result.message);
    }
    setIsDemo(false);
    localStorage.removeItem('isDemoUser');
    setUser(null);
    router.push('/login'); // Redirect to login after deletion
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, login, register, logout, loginDemo, deleteAccount }}>
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
