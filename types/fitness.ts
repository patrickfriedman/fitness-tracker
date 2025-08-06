export interface User {
  id: string;
  name: string;
  username?: string; // Optional, as we're using email for auth
  email: string;
  primaryGoal?: 'strength' | 'hypertrophy' | 'fat_loss' | 'endurance' | 'general_fitness';
  createdAt?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    units: 'imperial' | 'metric';
    todayWidgets: string[];
  };
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  name: string;
  durationMinutes: number;
  exercises: { name: string; sets: number; reps: number; weight: number }[];
  notes?: string;
  caloriesBurned?: number;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  mealType: string;
  foodItems: { name: string; quantity: number; unit: string; calories: number }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface BodyMetric {
  id: string;
  userId: string;
  date: string;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  waistCircumference?: number;
  notes?: string;
}

export interface MoodLog {
  id: string;
  userId: string;
  date: string;
  moodScore: number; // e.g., 1-5
  notes?: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string;
  amountMl: number;
}

export interface PlannedWorkout {
  id: string;
  userId: string;
  date: string;
  name: string;
  notes?: string;
}
