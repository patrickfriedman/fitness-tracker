"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "../types/fitness"

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<User>) => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  deleteAccount: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    try {
      const storedUser = localStorage.getItem("fitness-user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log("Found stored user:", parsedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading stored user:", error)
      localStorage.removeItem("fitness-user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Mock authentication - in real app, this would call an API
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name: username === "demo" ? "Demo User" : username,
        username,
        primaryGoal: "hypertrophy",
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          units: "imperial",
          todayWidgets: ["metrics", "quick-actions", "mood", "water"],
        },
      }

      setUser(mockUser)
      localStorage.setItem("fitness-user", JSON.stringify(mockUser))
      console.log("User logged in successfully:", mockUser)
      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name || "",
        username: userData.username || "",
        primaryGoal: userData.primaryGoal || "hypertrophy",
        createdAt: new Date().toISOString(),
        preferences: {
          theme: "light",
          units: "imperial",
          todayWidgets: ["metrics", "quick-actions", "mood", "water"],
        },
      }

      setUser(newUser)
      localStorage.setItem("fitness-user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fitness-user")
  }

  const deleteAccount = async (): Promise<boolean> => {
    try {
      // In a real app, this would call an API to delete the account
      setUser(null)
      localStorage.removeItem("fitness-user")
      localStorage.removeItem("fitness-workouts")
      localStorage.removeItem("fitness-nutrition")
      localStorage.removeItem("fitness-metrics")
      return true
    } catch (error) {
      console.error("Delete account error:", error)
      throw error
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("fitness-user", JSON.stringify(updatedUser))
    }
  }

  // Don't render children until we've checked for stored user
  if (isLoading) {
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
    <AuthContext.Provider value={{ user, login, logout, register, updateUser, deleteAccount }}>
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
