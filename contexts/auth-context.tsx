"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/types/fitness"
import { serverSignIn, serverSignUp, serverDeleteAccount, serverUpdateUserProfile } from "@/app/actions/auth-actions"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  updateUser: (userData: Partial<User>) => Promise<boolean>
  deleteAccount: () => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
        setUser(null)
        setLoading(false)
      }
    }

    getSessionAndProfile()

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
        setUser(null) // Clear user if profile not found or error
        setLoading(false)
        return
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          name: data.name,
          username: data.email.split('@')[0], // Derive username from email for now
          email: data.email,
          primaryGoal: data.primary_goal || 'general_fitness',
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
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
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
        return { success: true }
      }

      const result = await serverSignIn(email, password)
      if (result.success && result.user) {
        await fetchUserProfile(result.user.id)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: result.error || "Login failed" }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setLoading(false)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      const result = await serverSignUp(userData)
      if (result.success && result.user) {
        await fetchUserProfile(result.user.id)
        return { success: true }
      } else {
        setLoading(false)
        return { success: false, error: result.error || "Registration failed" }
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      setLoading(false)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const deleteAccount = async (): Promise<boolean> => {
    try {
      if (!user || user.id === "demo-user") { // Prevent deleting demo user
        console.warn("Cannot delete demo user or no user logged in.")
        return false
      }
      const result = await serverDeleteAccount(user.id)
      if (result.success) {
        setUser(null)
        return true
      } else {
        console.error("Failed to delete account:", result.error)
        return false
      }
    } catch (error) {
      console.error("Delete account error:", error)
      return false
    }
  }

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user || user.id === "demo-user") {
      console.warn("Cannot update demo user or no user logged in.")
      return false
    }
    try {
      const result = await serverUpdateUserProfile(user.id, userData)
      if (result.success) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        return true
      } else {
        console.error("Failed to update user profile:", result.error)
        return false
      }
    } catch (error) {
      console.error('Update user error:', error)
      return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
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
