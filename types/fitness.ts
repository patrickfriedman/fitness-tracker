export interface User {
  id: string
  name: string
  username: string
  email?: string
  avatar?: string
  primaryGoal: string
  fitnessLevel?: string
  workoutDays?: string[]
  createdAt: string
  preferences: {
    theme: "light" | "dark"
    units: "imperial" | "metric"
    todayWidgets: string[]
  }
}

export interface Workout {
  id: string
  name: string
  type: string
  exercises: WorkoutExercise[]
  duration?: number
  date?: string
  notes?: string
}

export interface WorkoutExercise {
  exerciseName: string
  sets: WorkoutSet[]
  notes?: string
}

export interface WorkoutSet {
  reps: number
  weight: number
  completed?: boolean
}

export interface Exercise {
  id: string
  name: string
  category: string
  muscleGroups: string[]
  equipment?: string
  instructions?: string[]
}

export interface NutritionEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  date: string
}

export interface BodyMetrics {
  id: string
  weight?: number
  height?: number
  bodyFat?: number
  muscleMass?: number
  date: string
}

export interface Goal {
  id: string
  type: "weight" | "strength" | "endurance" | "custom"
  target: number
  current: number
  unit: string
  deadline?: string
  description: string
}
