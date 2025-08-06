export interface User {
  id: string
  name: string
  username?: string
  email?: string
  primaryGoal: "strength" | "hypertrophy" | "fat_loss" | "endurance"
  createdAt: string
  preferences?: {
    theme: "light" | "dark"
    units: "metric" | "imperial"
    todayWidgets: string[]
    fitnessLevel?: string
    workoutDays?: number
    preferredTime?: string
    equipment?: string[]
  }
}

export interface WorkoutLog {
  id: string
  userId: string
  date: string
  startTime: string
  endTime?: string
  duration?: number
  label: string
  exercises: Exercise[]
  workingWeights?: Record<string, number>
  notes?: string
  createdAt: string
}

export interface Exercise {
  id: string
  name: string
  sets: Set[]
  restTime?: number
  notes?: string
}

export interface Set {
  reps: number
  weight: number
  rpe?: number
  completed?: boolean
}

export interface NutritionLog {
  id: string
  userId: string
  date: string
  meals?: Meal[]
  caloriesConsumed: number
  protein: number
  carbs: number
  fat: number
  createdAt: string
}

export interface Meal {
  id: string
  name: string
  foods: FoodItem[]
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
}

export interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  quantity?: number
  unit?: string
}

export interface BodyMetrics {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFatPercentage?: number
  measurements?: Record<string, number>
  createdAt: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  exercises: Exercise[]
  estimatedDuration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  equipment: string[]
  muscleGroups: string[]
}
