export interface User {
  id: string;
  username?: string | null;
  email: string;
  primary_goal?: string | null;
  preferences?: Record<string, any> | null;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  goal?: 'lose-weight' | 'gain-muscle' | 'improve-endurance' | 'maintain-fitness' | 'other';
  activityLevel?: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extra-active';
  weight?: number; // in kg
  height?: number; // in cm
  age?: number;
  created_at: Date;
}

export interface WorkoutLog {
  id: string;
  user_id?: string; // Optional, if linking to user
  date: Date;
  type: string; // e.g., "Strength", "Cardio", "HIIT"
  duration: number; // in minutes
  caloriesBurned?: number;
  notes?: string;
  exercises: { id: string; name: string; sets: string; reps: string; weight: string }[];
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
  user_id?: string; // Optional, if linking to user
  date: Date;
  mealType: string; // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
  foodItems: string; // Description of food eaten
  calories: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
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
  user_id?: string; // Optional, if linking to user
  date: Date;
  weight: number; // in kg
  bodyFat?: number; // percentage
  muscleMass?: number; // percentage
  // Add other metrics like BMI, measurements if needed
}

export interface MoodLog {
  id: string;
  user_id?: string; // Optional, if linking to user
  date: Date;
  mood: 'happy' | 'neutral' | 'sad' | 'stressed' | 'energetic' | 'tired';
  notes?: string;
}

export interface WaterLog {
  id: string;
  user_id?: string; // Optional, if linking to user
  date: Date;
  amount: number; // in ml
}

export interface PlannedWorkout {
  id: string;
  user_id?: string; // Optional, if linking to user
  date: Date;
  title: string;
  description?: string;
  exercises: { id: string; name: string; sets: string; reps: string; weight: string }[];
}
