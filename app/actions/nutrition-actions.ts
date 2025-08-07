'use server'

import { createClient } from '@/lib/supabase-server'
import { NutritionLog } from '@/types/fitness'
import { revalidatePath } from 'next/cache'

export async function addNutritionLog(log: Omit<NutritionLog, 'id' | 'user_id' | 'log_date' | 'created_at'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert({
      user_id: user.id,
      log_date: new Date().toISOString().split('T')[0], // Current date
      ...log,
    })
    .select()

  if (error) {
    console.error('Error adding nutrition log:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Nutrition log added successfully!' }
}

export async function getNutritionLogs(userId: string): Promise<NutritionLog[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .order('created_at', { ascending: false }) // Order by creation time for logs on the same day

  if (error) {
    console.error('Error fetching nutrition logs:', error.message)
    return []
  }

  return data as NutritionLog[]
}

export async function updateNutritionLog(id: string, updates: Partial<Omit<NutritionLog, 'id' | 'user_id' | 'created_at'>>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { error } = await supabase
    .from('nutrition_logs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only update their own logs

  if (error) {
    console.error('Error updating nutrition log:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Nutrition log updated successfully!' }
}

export async function deleteNutritionLog(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  const { error } = await supabase
    .from('nutrition_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user can only delete their own logs

  if (error) {
    console.error('Error deleting nutrition log:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Nutrition log deleted successfully!' }
}
