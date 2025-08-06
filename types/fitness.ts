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
  }
}

export interface BodyMetrics {
  userId: string
  date: string
  weight?: number
  bodyFatPercentage?: number
  muscleMass?: number
  goalWeight?: number
  goalBodyFat?: number
}

export interface WorkoutSet {
  reps: number
  weight?: number
  duration?: number
  restTime?: number
}

export interface WorkoutExercise {
  exerciseName: string
  sets: WorkoutSet[]
  notes?: string
}

export interface WorkoutLog {
  id: string
  userId: string
  name: string
  date: string
  duration?: number
  exercises: WorkoutExercise[]
  notes?: string
}

export interface Workout {
  id: string
  name: string
  exercises: WorkoutExercise[]
  duration?: number
  date?: string
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
