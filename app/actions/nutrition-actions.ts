'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NutritionLog } from '@/types/fitness'
import { Database } from '@/types/supabase'

export async function getDailyNutritionLogs(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('log_date', today.toISOString())
    .lt('log_date', tomorrow.toISOString())
    .order('log_date', { ascending: false })

  if (error) {
    console.error('Error fetching nutrition logs:', error)
    return { success: false, message: error.message }
  }
  return { success: true, logs: data as NutritionLog[] }
}

export async function addNutritionLog(log: NutritionLog) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert({
      user_id: log.user_id,
      food_item: log.food_item,
      calories: log.calories,
      protein_g: log.protein_g,
      carbs_g: log.carbs_g,
      fat_g: log.fat_g,
      log_date: log.log_date,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding nutrition log:', error)
    return { success: false, message: error.message }
  }
  return { success: true, log: data as NutritionLog }
}

export async function updateNutritionLog(id: string, log: NutritionLog) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data, error } = await supabase
    .from('nutrition_logs')
    .update({
      food_item: log.food_item,
      calories: log.calories,
      protein_g: log.protein_g,
      carbs_g: log.carbs_g,
      fat_g: log.fat_g,
      log_date: log.log_date,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating nutrition log:', error)
    return { success: false, message: error.message }
  }
  return { success: true, log: data as NutritionLog }
}

export async function deleteNutritionLog(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { error } = await supabase.from('nutrition_logs').delete().eq('id', id)

  if (error) {
    console.error('Error deleting nutrition log:', error)
    return { success: false, message: error.message }
  }
  return { success: true, message: 'Nutrition log deleted successfully.' }
}
