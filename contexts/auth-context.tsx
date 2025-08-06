"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type { User as FitnessUser } from "@/types/fitness"

interface AuthContextType {
  user: FitnessUser | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: Partial<FitnessUser>) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: FitnessUser) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FitnessUser | null>(null)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = async (userData: Partial<FitnessUser> & { password?: string }) => {
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required')
    }

    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    })

    if (authError) throw authError

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          primary_goal: 'strength',
          created_at: new Date().toISOString(),
          preferences: {
            theme: 'light',
            units: 'metric',
            todayWidgets: [],
          },
        })

      if (profileError) throw profileError
    }
  }

  async function fetchUserProfile(authUser: User) {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        avatar,
        primary_goal,
        created_at,
        preferences
      `)
      .eq('id', authUser.id)
      .single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return
    }

    if (data) {
      setUser({
        ...data,
        primaryGoal: data.primary_goal,
        createdAt: data.created_at,
      } as FitnessUser)
    }
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const updateUser = async (userData: FitnessUser) => {
    const { error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", userData.id)

    if (error) throw error
    setUser(userData)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
