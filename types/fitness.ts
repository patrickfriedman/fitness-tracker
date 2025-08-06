export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  primaryGoal: 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness';
  createdAt: string;
  preferences: {
    theme: 'light' | 'dark';
    units: 'imperial' | 'metric';
    todayWidgets: string[]; // e.g., ['metrics', 'quick-actions', 'mood', 'water']
  };
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  date: string; // ISO date string
  name: string;
  duration_minutes: number;
  exercises: Exercise[];
  notes?: string;
  calories_burned?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
  notes?: string;
}

export interface Set {
  id: string;
  reps: number;
  weight: number; // in kg or lbs based on user preferences
  unit: 'kg' | 'lbs';
  rpe?: number; // Rate of Perceived Exertion
}

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string; // ISO date string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_items: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  date: string; // ISO date string
  weight?: number; // in kg or lbs
  height?: number; // in cm or inches
  body_fat_percentage?: number;
  muscle_mass_percentage?: number;
  waist_circumference?: number; // in cm or inches
  notes?: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string; // ISO date string
  mood_score: number; // e.g., 1-5
  notes?: string;
}

export interface WaterEntry {
  id: string;
  user_id: string;
  date: string; // ISO date string
  amount_ml: number;
}
