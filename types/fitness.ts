export interface WorkoutLog {
  id?: string
  user_id?: string
  log_date: string
  workout_type: string
  duration_minutes: number
  calories_burned?: number
  notes?: string
  created_at?: string
}

export interface NutritionLog {
  id?: string
  user_id?: string
  log_date: string
  food_item: string
  calories?: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  created_at?: string
}

export interface BodyMetric {
  id?: string
  user_id?: string
  log_date: string
  weight_kg?: number
  height_cm?: number
  body_fat_percent?: number
  muscle_mass_kg?: number
  created_at?: string
}

export interface MoodLog {
  id?: string
  user_id?: string
  log_date: string
  mood_level: string
  created_at?: string
}

export interface WaterLog {
  id?: string
  user_id?: string
  log_date: string
  amount_ml: number
  goal_ml?: number
  created_at?: string
}

export interface PlannedWorkout {
  id?: string
  user_id?: string
  planned_date: string
  workout_name: string
  duration_minutes?: number
  created_at?: string
}

export interface UserProfile {
  id?: string
  name?: string
  fitness_goal?: string
  activity_level?: string
}
