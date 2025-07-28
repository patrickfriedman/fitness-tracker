export interface User {
  id: string
  name: string
  username: string
  avatar?: string
  primaryGoal: "strength" | "hypertrophy" | "fat_loss" | "endurance"
  createdAt: string
  preferences: {
    theme: "light" | "dark"
    units: "metric" | "imperial"
    todayWidgets: string[]
  }
}

export interface BodyMetrics {
  userId: string
  date: string
  weight?: number
  bodyFatPercentage?: number
  goalWeight?: number
  goalBodyFat?: number
}

export interface Exercise {
  name: string
  sets: {
    reps?: number
    weight?: number
    unit: "lb" | "kg"
    time?: number
    distance?: number
    intensity?: "low" | "medium" | "high"
  }[]
}

export interface WorkoutPlan {
  name: string
  days: {
    name: string
    exercises: {
      name: string
      sets: number
      reps: string
      notes?: string
    }[]
  }[]
}

export interface WorkoutLog {
  userId: string
  date: string
  startTime?: string
  endTime?: string
  duration?: number // in minutes
  label: "strength" | "hypertrophy" | "deload" | "cardio" | "custom"
  exercises: Exercise[]
  workingWeights: Record<string, number>
  notes?: string
  planId?: string
  inProgress?: boolean
}

export interface NutritionLog {
  userId: string
  date: string
  caloriesConsumed: number
  calorieLimit: number
  waterIntake: number // in oz
  waterGoal: number
  meals?: {
    name: string
    calories: number
    photo?: string
    frequency?: number // how often user eats this
  }[]
  notes?: string
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface MoodLog {
  userId: string
  date: string
  mood: 1 | 2 | 3 | 4 | 5 // 1 = very bad, 5 = excellent
  energy?: 1 | 2 | 3 | 4 | 5
  motivation?: 1 | 2 | 3 | 4 | 5
  notes?: string
  timestamp?: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  category: "strength" | "cardio" | "hypertrophy" | "custom"
  exercises: {
    name: string
    sets: number
    reps: string
    weight?: number
    restTime?: number
  }[]
  estimatedDuration: number
}

export interface ActivityHeatmap {
  date: string
  count: number
  type: "workout" | "nutrition" | "metrics"
}

export interface UserComparison {
  userId: string
  name: string
  avatar?: string
  metrics: {
    totalWorkouts: number
    avgWeight?: number
    totalCalories: number
    streak: number
  }
}

export interface MotivationalQuote {
  id: number
  text: string
  author: string
}

export interface WeeklySummary {
  userId: string
  range: string
  averageWeight: number
  averageBodyFat: number
  totalWorkouts: number
  caloriesTotal: number
  prChanges: Record<string, string>
  goalProgress: {
    weightRemaining: number
    bodyFatRemaining: number
  }
  notes: string
}

export interface FoodItem {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
}
