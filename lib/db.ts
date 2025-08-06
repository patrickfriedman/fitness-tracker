import { supabase } from './supabase'
import type { WorkoutLog, NutritionLog, BodyMetrics } from '@/types/fitness'

// This file is currently not used as Supabase client is handled in `lib/supabase.ts`
// and direct database interactions are via Server Actions.
// Keeping it for completeness if it was intended for a different ORM or direct DB connection.
// For now, it remains empty.

export async function getRecentWorkouts(userId: string, limit = 5) {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function saveWorkout(workout: WorkoutLog) {
  const { error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: workout.userId,
      date: workout.date,
      start_time: workout.startTime,
      end_time: workout.endTime,
      duration: workout.duration,
      label: workout.label,
      exercises: workout.exercises,
      working_weights: workout.workingWeights,
      notes: workout.notes
    })

  if (error) throw error
}

export async function updateWorkout(workoutId: string, workout: Partial<WorkoutLog>) {
  const { error } = await supabase
    .from('workout_logs')
    .update(workout)
    .eq('id', workoutId)

  if (error) throw error
}

export async function saveBodyMetrics(metrics: BodyMetrics) {
  const { error } = await supabase
    .from('body_metrics')
    .insert({
      user_id: metrics.userId,
      date: metrics.date,
      weight: metrics.weight,
      body_fat: metrics.bodyFatPercentage,
      measurements: {}
    })

  if (error) throw error
}

export async function saveNutritionLog(log: NutritionLog) {
  const { error } = await supabase
    .from('nutrition_logs')
    .insert({
      user_id: log.userId,
      date: log.date,
      meals: log.meals || [],
      total_calories: log.caloriesConsumed,
      macros: {
        protein: log.protein,
        carbs: log.carbs,
        fat: log.fat
      }
    })

  if (error) throw error
}
