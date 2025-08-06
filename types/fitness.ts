export interface User {
  id: string
  name: string
  username: string
  email?: string
  primaryGoal: "weight-loss" | "muscle-gain" | "endurance" | "general-fitness" | "hypertrophy"
  createdAt: string
  preferences: {
    theme: "light" | "dark"
    units: "imperial" | "metric"
    todayWidgets: string[]
  }
}

export interface BodyMetrics {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFat?: number
  muscleMass?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
}

export interface Set {
  reps: number
  weight?: number
  duration?: number
  distance?: number
}

export interface Exercise {
  id: string
  name: string
  sets: Set[]
  restTime?: number
  notes?: string
}

export interface WorkoutLog {
  id: string
  userId: string
  name: string
  date: string
  duration?: number
  exercises: Exercise[]
  notes?: string
}

export interface Workout {
  id: string
  userId: string
  name: string
  date: string
  duration: number
  exercises: Exercise[]
  notes?: string
}

export interface NutritionEntry {
  id: string
  userId: string
  date: string
  meals: Meal[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface Meal {
  id: string
  name: string
  foods: FoodItem[]
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface FoodItem {
  id: string
  name: string
  quantity: number
  unit: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface NutritionLog {
  userId: string
  date: string
  caloriesConsumed: number
  calorieLimit: number
  protein?: number
  carbs?: number
  fat?: number
  waterIntake?: number
  waterGoal?: number
}

export interface MoodLog {
  userId: string
  date: string
  mood: 1 | 2 | 3 | 4 | 5
  energy: 1 | 2 | 3 | 4 | 5
  stress: 1 | 2 | 3 | 4 | 5
  notes?: string
}

export interface ActivityData {
  date: string
  intensity: number
  workoutCompleted: boolean
}
