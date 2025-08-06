export interface User {
  id: string
  name: string
  username: string
  email?: string
  avatar?: string
  primaryGoal: "strength" | "hypertrophy" | "endurance" | "weight_loss" | "general_fitness"
  createdAt: string
  preferences: {
    theme: "light" | "dark"
    units: "metric" | "imperial"
    todayWidgets: string[]
    workoutWidgets?: string[]
    nutritionWidgets?: string[]
    progressWidgets?: string[]
  }
}

export interface Exercise {
  id: string
  name: string
  category: string
  muscleGroups: string[]
  equipment?: string
  instructions?: string
}

export interface WorkoutSet {
  id: string
  reps: number
  weight: number
  restTime?: number
  completed: boolean
}

export interface WorkoutExercise {
  id: string
  exerciseId: string
  exerciseName: string
  sets: WorkoutSet[]
  notes?: string
}

export interface Workout {
  id: string
  userId: string
  name: string
  exercises: WorkoutExercise[]
  date: string
  duration?: number
  notes?: string
  isTemplate?: boolean
}

export interface NutritionEntry {
  id: string
  userId: string
  foodName: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  meal: "breakfast" | "lunch" | "dinner" | "snack"
  date: string
}

export interface BodyMetrics {
  id: string
  userId: string
  weight?: number
  bodyFat?: number
  muscleMass?: number
  date: string
}

export interface ActivityData {
  date: string
  intensity: number
}

export interface MoodEntry {
  id: string
  userId: string
  mood: number
  energy: number
  stress: number
  sleep: number
  notes?: string
  date: string
}

export interface CustomFood {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  userId: string
}

export interface MealPlan {
  id: string
  userId: string
  date: string
  meals: {
    breakfast: NutritionEntry[]
    lunch: NutritionEntry[]
    dinner: NutritionEntry[]
    snacks: NutritionEntry[]
  }
}
