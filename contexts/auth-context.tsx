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

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("fitness-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
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
    return true
  }

  const register = async (userData: Partial<User>): Promise<boolean> => {
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
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("fitness-user")
  }

  const deleteAccount = async (): Promise<boolean> => {
    // In a real app, this would call an API to delete the account
    setUser(null)
    localStorage.removeItem("fitness-user")
    localStorage.removeItem("fitness-workouts")
    localStorage.removeItem("fitness-nutrition")
    localStorage.removeItem("fitness-metrics")
    return true
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("fitness-user", JSON.stringify(updatedUser))
    }
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
