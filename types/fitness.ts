export interface BodyMetrics {
  weight: number | null
  height: number | null
  bmi: number | null
  bodyFat: number | null
  muscleMass: number | null
}

export interface WaterLog {
  date: string
  amount: number
}

export interface MoodLog {
  date: string
  mood: 'happy' | 'neutral' | 'sad'
  notes: string | null
}

export interface WorkoutLog {
  id: string
  type: string
  duration: number
  calories_burned: number | null
  notes: string | null
  exercises: { name: string; sets: string; reps: string; weight: string }[] | null
  created_at: string
}

export interface NutritionLog {
  id: string
  meal_type: string
  calories: number
  protein: number | null
  carbs: number | null
  fat: number | null
  notes: string | null
  created_at: string
}

export interface PlannedWorkout {
  id: string
  date: string
  name: string
  exercises: { name: string; sets: number; reps: number }[]
}
