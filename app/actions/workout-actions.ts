'use server'

import { createClient } from '@/lib/supabase-server'
import { WorkoutLog, PlannedWorkout } from '@/types/fitness'
import { revalidatePath } from 'next/cache'

// --- Workout Logs Actions ---

export async function addWorkoutLog(log: Omit<WorkoutLog, 'id' | 'user_id' | 'log_date' | 'created_at'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: user.id,
      log_date: new Date().toISOString().split('T')[0], // Current date
      ...log,
    })
    .select()

  if (error) {
    console.error('Error adding workout log:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Workout log added successfully!' }
}

export async function getWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .order('created_at', { ascending: false }) // Order by creation time for logs on the same day

  if (error) {
    console.error('Error fetching workout logs:', error.message)
    return []
  }

  return data as WorkoutLog[]
}

export async function updateWorkoutLog(id: string, updates: Partial<Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'>>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { error } = await supabase
    .from('workout_logs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own logs

  if (error) {
    console.error('Error updating workout log:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Workout log updated successfully!' }
}

export async function deleteWorkoutLog(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { error } = await supabase
    .from('workout_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only delete their own logs

  if (error) {
    console.error('Error deleting workout log:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Workout log deleted successfully!' }
}

// --- Planned Workouts Actions ---

export async function addPlannedWorkout(workout: Omit<PlannedWorkout, 'id' | 'user_id' | 'created_at'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('planned_workouts')
    .insert({
      user_id: user.id,
      ...workout,
    })
    .select()

  if (error) {
    console.error('Error adding planned workout:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Planned workout added successfully!' }
}

export async function getPlannedWorkouts(userId: string): Promise<PlannedWorkout[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('planned_workouts')
    .select('*')
    .eq('user_id', userId)
    .order('workout_date', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching planned workouts:', error.message)
    return []
  }

  return data as PlannedWorkout[]
}

export async function updatePlannedWorkout(id: string, updates: Partial<Omit<PlannedWorkout, 'id' | 'user_id' | 'created_at'>>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { error } = await supabase
    .from('planned_workouts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating planned workout:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Planned workout updated successfully!' }
}

export async function deletePlannedWorkout(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { error } = await supabase
    .from('planned_workouts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting planned workout:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Planned workout deleted successfully!' }
}
