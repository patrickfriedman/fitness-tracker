'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { WorkoutLog, PlannedWorkout } from '@/types/fitness'
import { Database } from '@/types/supabase'

export async function createWorkoutLog(log: Omit<WorkoutLog, 'id' | 'user_id' | 'created_at' | 'log_date'>) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: user.id,
      workout_type: log.workout_type,
      duration_minutes: log.duration_minutes,
      calories_burned: log.calories_burned,
      notes: log.notes,
      log_date: new Date().toISOString().split('T')[0], // Set current date
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating workout log:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getWorkoutLogs() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('log_date', { ascending: false })

  if (error) {
    console.error('Error fetching workout logs:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createPlannedWorkout(workout: Omit<PlannedWorkout, 'id' | 'user_id' | 'created_at'>) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('planned_workouts')
    .insert({
      user_id: user.id,
      planned_date: workout.planned_date,
      workout_name: workout.workout_name,
      duration_minutes: workout.duration_minutes,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating planned workout:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getPlannedWorkouts() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('planned_workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('planned_date', { ascending: true })

  if (error) {
    console.error('Error fetching planned workouts:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createBodyMetric(metric: Omit<PlannedWorkout, 'id' | 'user_id' | 'created_at' | 'planned_date' | 'workout_name' | 'duration_minutes'> & {
  weight_kg?: number;
  height_cm?: number;
  body_fat_percent?: number;
  muscle_mass_kg?: number;
}) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('body_metrics')
    .insert({
      user_id: user.id,
      weight_kg: metric.weight_kg,
      height_cm: metric.height_cm,
      body_fat_percent: metric.body_fat_percent,
      muscle_mass_kg: metric.muscle_mass_kg,
      log_date: new Date().toISOString().split('T')[0], // Set current date
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating body metric:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getLatestBodyMetric() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('body_metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('log_date', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching latest body metric:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function createMoodLog(mood_level: string) {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('mood_logs')
    .insert({
      user_id: user.id,
      mood_level: mood_level,
      log_date: new Date().toISOString().split('T')[0], // Set current date
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating mood log:', error)
    return { success: false, error: error.message }
  }

  return {
