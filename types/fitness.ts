// This file defines the types for your fitness application data.
// These types should align with your Supabase database schema.

// Example types (adjust based on your actual schema)

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  website?: string;
  gender?: string;
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  activity_level?: string;
  fitness_goal?: string;
  onboarded?: boolean;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_date: string; // YYYY-MM-DD
  type?: string; // e.g., 'Strength', 'Cardio'
  duration_minutes?: number;
  calories_burned?: number;
  notes?: string;
  exercises?: Array<{ name: string; sets: number; reps: number; weight?: number }>;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  meal_type?: string; // e.g., 'Breakfast', 'Lunch'
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  notes?: string;
  created_at: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  weight_kg?: number;
  height_cm?: number;
  body_fat?: number;
  muscle_mass?: number;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  mood_level: string; // e.g., 'happy', 'neutral', 'sad'
  notes?: string;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  amount_ml: number;
  target_ml?: number;
  created_at: string;
}

export interface PlannedWorkout {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  name: string;
  exercises?: Array<{ name: string; sets: number; reps: number; weight?: number }>;
  notes?: string;
  created_at: string;
}

// Combined type for BodyMetricsWidget (if you want to pass a single object)
export interface BodyMetrics {
  weight?: number;
  height?: number;
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
}
