"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/types/fitness"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  deleteAccount: () => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        setLoading(false)
        return
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          name: data.name,
          username: data.email.split('@')[0],
          email: data.email,
          primaryGoal: data.primary_goal,
          createdAt: data.created_at,
          preferences: data.preferences || {
            theme: "light",
            units: "imperial",
            todayWidgets: ["metrics", "quick-actions", "mood", "water"],
          },
        }
        setUser(userProfile)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Handle demo login
      if (email === "demo@fittracker.com" || email === "demo") {
        const demoUser: User = {
          id: "demo-user",
          name: "Demo User",
          username: "demo",
          email: "demo@fittracker.com",
          primaryGoal: "hypertrophy",
          createdAt: new Date().toISOString(),
          preferences: {
            theme: "light",
            units: "imperial",
            todayWidgets: ["metrics", "quick-actions", "mood", "water"],
          },
        }
        setUser(demoUser)
        setLoading(false)
        return true
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error)
        setLoading(false)
        return false
      }

      if (data.user) {
        await fetchUserProfile(data.user.id)
        return true
      }

      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    try {
      setLoading(true)

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (error) {
        console.error('Registration error:', error)
        setLoading(false)
        return false
      }

      if (data.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: userData.name || '',
            email: userData.email,
            primary_goal: userData.primaryGoal || 'hypertrophy',
            preferences: {
              theme: "light",
              units: "imperial",
              todayWidgets: ["metrics", "quick-actions", "mood", "water"],
            }
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          setLoading(false)
          return false
        }

        await fetchUserProfile(data.user.id)
        return true
      }

      setLoading(false)
      return false
    } catch (error) {
      console.error('Registration error:', error)
      setLoading(false)
      return false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user) return false

      // Delete user data from custom tables
      await supabase.from('workout_logs').delete().eq('user_id', user.id)
      await supabase.from('nutrition_logs').delete().eq('user_id', user.id)
      await supabase.from('body_metrics').delete().eq('user_id', user.id)
      await supabase.from('users').delete().eq('id', user.id)

      // Sign out
      await supabase.auth.signOut()
      setUser(null)
      return true
    } catch (error) {
      console.error('Delete account error:', error)
      return false
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          primary_goal: userData.primaryGoal,
          preferences: userData.preferences
        })
        .eq('id', user.id)

      if (!error) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
      }
    } catch (error) {
      console.error('Update user error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
