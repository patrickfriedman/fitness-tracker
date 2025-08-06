export interface User {
  id: string;
  name: string;
  email: string;
  primaryGoal?: 'strength' | 'hypertrophy' | 'general_fitness' | 'weight_loss' | 'endurance';
  preferences?: {
    darkMode?: boolean;
    notifications?: boolean;
  };
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  name: string;
  durationMinutes?: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    unit?: 'kg' | 'lbs';
  }[];
  notes?: string;
  caloriesBurned?: number;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodItems: {
    name: string;
    quantity: number;
    unit?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface BodyMetric {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weight?: number; // in kg
  height?: number; // in cm
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  waistCircumference?: number; // in cm
  notes?: string;
}

export interface MoodLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  moodScore: number; // 1-5 scale, 5 being best
  notes?: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number; // in milliliters
}

export interface PlannedWorkout {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  name: string;
  notes?: string;
}
