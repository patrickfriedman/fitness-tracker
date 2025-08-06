export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar?: string
          primary_goal: "strength" | "hypertrophy" | "fat_loss" | "endurance"
          created_at: string
          preferences: Json
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar?: string
          primary_goal: "strength" | "hypertrophy" | "fat_loss" | "endurance"
          created_at?: string
          preferences?: Json
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string
          primary_goal?: "strength" | "hypertrophy" | "fat_loss" | "endurance"
          created_at?: string
          preferences?: Json
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          start_time: string
          end_time?: string
          duration?: number
          label: string
          exercises: Json
          working_weights: Json
          notes?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          start_time: string
          end_time?: string
          duration?: number
          label: string
          exercises: Json
          working_weights: Json
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          start_time?: string
          end_time?: string
          duration?: number
          label?: string
          exercises?: Json
          working_weights?: Json
          notes?: string
          created_at?: string
        }
      }
      nutrition_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          meals: Json
          total_calories: number
          macros: Json
          created_at: string
        }
      }
      body_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          weight?: number
          body_fat?: number
          measurements: Json
          created_at: string
        }
      }
    }
  }
}
