export interface User {
  id: string
  name: string
  username: string
  email?: string
  avatar?: string
  primaryGoal: "weight_loss" | "muscle_gain" | "maintenance" | "endurance" | "hypertrophy"
  createdAt: string
  preferences: {
    theme: "light" | "dark"
    units: "metric" | "imperial"
    todayWidgets: string[]
  }
}

export interface WorkoutSet {
  reps: number
  weight: number
  completed: boolean
  restTime?: number
}

export interface WorkoutExercise {
  id: string
  exerciseName: string
  sets: WorkoutSet[]
  restTime: number
  notes: string
}

export interface Workout {
  id: string
  name: string
  date: string
  duration: number
  exercises: WorkoutExercise[]
  notes: string
}

export interface NutritionEntry {
  id: string
  date: string
  meal: "breakfast" | "lunch" | "dinner" | "snack"
  food: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface BodyMetrics {
  id: string
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

export interface MoodEntry {
  id: string
  date: string
  mood: "great" | "good" | "okay" | "bad"
  energy: number
  notes?: string
}
