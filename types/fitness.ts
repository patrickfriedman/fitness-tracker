export interface User {
  id: string;
  name: string | null;
  username?: string; // Optional, derived from email for now
  email: string;
  primaryGoal?: 'strength' | 'hypertrophy' | 'fat_loss' | 'endurance' | 'general_fitness';
  createdAt?: string;
  preferences?: {
    theme: 'light' | 'dark';
    units: 'imperial' | 'metric';
    todayWidgets: string[]; // e.g., ["metrics", "quick-actions", "mood", "water"]
  };
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  name: string;
  durationMinutes: number;
  exercises: Exercise[];
  notes?: string;
  caloriesBurned?: number;
  createdAt: string;
}

export interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
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
  userId: string;
  date: string;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  waistCircumference?: number;
  notes?: string;
  createdAt: string;
}

export interface MoodLog {
  id: string;
  userId: string;
  date: string;
  moodScore: number; // e.g., 1-5
  notes?: string;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string;
  amountMl: number;
  createdAt: string;
}

export interface PlannedWorkout {
  id: string;
  userId: string;
  date: string;
  name: string;
  notes?: string;
  createdAt: string;
}
