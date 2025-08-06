export type User = {
  id: string;
  name: string;
  username: string; // Derived from email for Supabase Auth
  email: string;
  primaryGoal: 'strength' | 'hypertrophy' | 'fat_loss' | 'endurance' | 'general_fitness';
  createdAt: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    units: 'imperial' | 'metric';
    todayWidgets: string[]; // Array of widget IDs to display on the dashboard
  };
};

export type WorkoutLog = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  name: string;
  durationMinutes?: number;
  exercises: ExerciseLog[];
  notes?: string;
  caloriesBurned?: number;
  createdAt: string;
};

export type ExerciseLog = {
  name: string;
  sets: SetLog[];
};

export type SetLog = {
  reps: number;
  weight: number; // in kg or lbs based on user preferences
  unit: 'kg' | 'lbs';
  rir?: number; // Reps in Reserve
};

export type NutritionLog = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
};

export type FoodItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
};

export type BodyMetric = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weight?: number; // in kg or lbs
  height?: number; // in cm or inches
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  waistCircumference?: number; // in cm or inches
  notes?: string;
  createdAt: string;
};

export type MoodLog = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  moodScore: number; // e.g., 1-5
  notes?: string;
  createdAt: string;
};

export type WaterLog = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number; // in milliliters
  createdAt: string;
};

export type PlannedWorkout = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  name: string;
  notes?: string;
  createdAt: string;
};
