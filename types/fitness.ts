export interface User {
  id: string;
  username?: string | null;
  email: string;
  primary_goal?: string | null;
  preferences?: Record<string, any> | null;
  created_at?: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string;
  name: string;
  duration_minutes?: number | null;
  exercises?: ExerciseLog[] | null;
  notes?: string | null;
  calories_burned?: number | null;
  created_at?: string;
}

export interface ExerciseLog {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: string; // e.g., 'kg', 'lbs'
}

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_items?: FoodItem[] | null;
  total_calories?: number | null;
  total_protein?: number | null;
  total_carbs?: number | null;
  total_fat?: number | null;
  created_at?: string;
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string; // e.g., 'g', 'ml', 'pcs'
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  date: string;
  weight?: number | null;
  height?: number | null;
  body_fat_percentage?: number | null;
  muscle_mass_percentage?: number | null;
  waist_circumference?: number | null;
  notes?: string | null;
  created_at?: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood_score: number; // e.g., 1-5
  notes?: string | null;
  created_at?: string;
}

export interface WaterLog {
  id: string;
  user_id: string;
  date: string;
  amount_ml: number;
  created_at?: string;
}

export interface PlannedWorkout {
  id: string;
  user_id: string;
  date: string;
  name: string;
  notes?: string | null;
  created_at?: string;
}
