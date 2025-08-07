import { supabase } from './supabase'
import type { WorkoutLog, NutritionLog, BodyMetrics } from '@/types/fitness'

// This file can be used for direct database interactions if not using an ORM
// or for re-exporting Supabase client instances if preferred.
// For now, it can remain empty or contain basic setup if needed later.
// The Supabase client is primarily managed in lib/supabase-browser.ts and lib/supabase-server.ts

export const db = {
  getRecentWorkouts: async (userId: string, limit = 5) => {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  saveWorkout: async (workout: WorkoutLog) => {
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
  },

  updateWorkout: async (workoutId: string, workout: Partial<WorkoutLog>) => {
    const { error } = await supabase
      .from('workout_logs')
      .update(workout)
      .eq('id', workoutId)

    if (error) throw error
  },

  saveBodyMetrics: async (metrics: BodyMetrics) => {
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
  },

  saveNutritionLog: async (log: NutritionLog) => {
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
}

// This file is intentionally left empty as per previous instructions.
// If database interactions beyond Supabase are needed, they would be implemented here.
