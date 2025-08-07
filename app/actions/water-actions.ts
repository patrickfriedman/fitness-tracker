'use server'

import { createClient } from '@/lib/supabase-server'
import { WaterLog } from '@/types/fitness'
import { revalidatePath } from 'next/cache'

export async function addWaterLog(amount_ml: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'User not authenticated.' }
  }

  // Check if there's an existing log for today
  const today = new Date().toISOString().split('T')[0]
  const { data: existingLogs, error: fetchError } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('log_date', today)

  if (fetchError) {
    console.error('Error fetching existing water log:', fetchError.message)
    return { success: false, message: fetchError.message }
  }

  if (existingLogs && existingLogs.length > 0) {
    // Update existing log
    const { error } = await supabase
      .from('water_logs')
      .update({ amount_ml })
      .eq('id', existingLogs[0].id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating water log:', error.message)
      return { success: false, message: error.message }
    }
    revalidatePath('/')
    return { success: true, message: 'Water intake updated successfully!' }
  } else {
    // Insert new log
    const { error } = await supabase
      .from('water_logs')
      .insert({
        user_id: user.id,
        log_date: today,
        amount_ml,
      })
      .select()

    if (error) {
      console.error('Error adding water log:', error.message)
      return { success: false, message: error.message }
    }
    revalidatePath('/')
    return
