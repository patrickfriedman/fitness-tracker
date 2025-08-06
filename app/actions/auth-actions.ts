'use server'

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { User } from '@/types/fitness'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for server actions')
}

// Create an admin client for server-side operations only
const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function serverSignIn(email: string, password: string) {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Server sign-in error:', error)
    return { success: false, error: error.message }
  }
  return { success: true, user: data.user }
}

export async function serverSignUp(userData: Partial<User> & { email: string; password: string }) {
  const { data, error } = await supabaseAdmin.auth.signUp({
    email: userData.email,
    password: userData.password,
  })

  if (error) {
    console.error('Server sign-up error:', error)
    return { success: false, error: error.message }
  }

  if (data.user) {
    // Create user profile in users table
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: data.user.id,
        name: userData.name || '',
        email: userData.email,
        primary_goal: userData.primaryGoal || 'general_fitness',
        preferences: {
          theme: "light",
          units: "imperial",
          todayWidgets: ["metrics", "quick-actions", "mood", "water"],
        }
      })

    if (profileError) {
      console.error('Server profile creation error:', profileError)
      // Optionally, delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      return { success: false, error: profileError.message }
    }
    return { success: true, user: data.user }
  }

  return { success: false, error: 'No user data returned after sign up.' }
}

export async function serverDeleteAccount(userId: string) {
  try {
    // Delete user data from custom tables first
    await supabaseAdmin.from('workout_logs').delete().eq('user_id', userId)
    await supabaseAdmin.from('nutrition_logs').delete().eq('user_id', userId)
    await supabaseAdmin.from('body_metrics').delete().eq('user_id', userId)
    await supabaseAdmin.from('mood_logs').delete().eq('user_id', userId)
    await supabaseAdmin.from('water_logs').delete().eq('user_id', userId)
    await supabaseAdmin.from('planned_workouts').delete().eq('user_id', userId)
    await supabaseAdmin.from('users').delete().eq('id', userId)

    // Then delete the auth user
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Server delete account error:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error: any) {
    console.error('Server delete account exception:', error)
    return { success: false, error: error.message }
  }
}

export async function serverUpdateUserProfile(userId: string, userData: Partial<User>) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        name: userData.name,
        primary_goal: userData.primaryGoal,
        preferences: userData.preferences
      })
      .eq('id', userId)

    if (error) {
      console.error('Server update user profile error:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error: any) {
    console.error('Server update user profile exception:', error)
    return { success: false, error: error.message }
  }
}
