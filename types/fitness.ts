export interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  full_name: string | null;
  updated_at: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  fitness_goal?: string | null;
  activity_level?: string | null;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  workout_name: string;
  duration_minutes: number | null;
  calories_burned: number | null;
  notes: string | null;
  created_at: string;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  meal_type: string; // e.g., 'breakfast', 'lunch', 'dinner', 'snack'
  food_item: string;
  calories: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  created_at: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  weight_kg: number | null;
  height_cm: number | null;
  body_fat_percent: number | null;
  muscle_mass_kg: number | null;
  created_at: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  mood_rating: number; // 1-5 scale
  notes: string | null;
  created_at: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  log_date: string; // YYYY-MM-DD
  amount_ml: number;
  created_at: string;
}

export interface PlannedWorkout {
  id: string;
  user_id: string;
  workout_date: string; // YYYY-MM-DD
  workout_name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }[] | null;
  notes: string | null;
  created_at: string;
}
