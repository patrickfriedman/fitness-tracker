'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NutritionLog } from '@/types/fitness'
import { Database } from '@/types/supabase'

export async function createNutritionLog(log: Omit<NutritionLog, 'id' | 'user_id' | 'created_at' | 'log_date'>) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert({
      user_id: user.id,
      food_item: log.food_item,
      calories: log.calories,
      protein_g: log.protein_g,
      carbs_g: log.carbs_g,
      fat_g: log.fat_g,
      log_date: new Date().toISOString().split('T')[0], // Set current date
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating nutrition log:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getNutritionLogs() {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('log_date', { ascending: false })

  if (error) {
    console.error('Error fetching nutrition logs:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
