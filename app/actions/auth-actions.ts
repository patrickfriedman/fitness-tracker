'use server'

import { getBrowserClient, getServiceRoleClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { User } from '@/types/fitness'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = getBrowserClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = getBrowserClient()
  const serviceRoleSupabase = getServiceRoleClient()

  // First, sign up the user with email and password
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, // Store username in auth.users metadata
      },
    },
  })

  if (authError) {
    console.error('Supabase Auth Sign-up error:', authError.message)
    return { success: false, message: `Sign-up error: ${authError.message}` }
  }

  if (authData.user) {
    // Insert user profile into public.users table using service role client
    const { error: profileError } = await serviceRoleSupabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        name: username, // Store username in public.users table
      })

    if (profileError) {
      console.error('Supabase Profile Insert error:', profileError.message)
      // If profile insertion fails, you might want to delete the auth user as well
      await serviceRoleSupabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, message: `Profile creation error: ${profileError.message}` }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = getBrowserClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
    return { success: false, message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function deleteAccount() {
  const supabase = getServiceRoleClient() // Use service role for deleting user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Failed to get user for deletion:', userError?.message)
    return { success: false, message: userError?.message || 'User not found.' }
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

  if (deleteError) {
    console.error('Account deletion error:', deleteError.message)
    return { success: false, message: deleteError.message }
  }

  // Clear session cookies after deletion
  cookies().delete('sb-access-token')
  cookies().delete('sb-refresh-token')

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const supabase = getServiceRoleClient()

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)

  if (error) {
    console.error('Update profile error:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

export async function fetchUserProfile(userId: string): Promise<User | null> {
  const supabase = getServiceRoleClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error.message)
    return null
  }

  if (!data) {
    return null
  }

  // Map database columns to User type
  return {
    id: data.id,
    name: data.name || '',
    email: data.email || '',
    primaryGoal: data.primary_goal as User['primaryGoal'],
    preferences: data.preferences as User['preferences'],
  }
}
