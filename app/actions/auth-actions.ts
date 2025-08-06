'use server'

import { getServiceRoleClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User } from '@/types/fitness'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = getServiceRoleClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Server sign-in error:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

export async function signUp(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = getServiceRoleClient()

  // First, create the user in auth.users
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name, // Store name in auth.users metadata
      },
    },
  })

  if (authError) {
    console.error('Server sign-up error:', authError.message)
    return { success: false, error: authError.message }
  }

  // If user is created, insert into public.users table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name: name,
        email: email,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError.message)
      // Optionally, you might want to delete the auth.user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: 'Failed to create user profile.' }
    }
  }

  return { success: true, error: null }
}

export async function signOut() {
  const supabase = getServiceRoleClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign-out error:', error.message)
    return { success: false, error: error.message }
  }

  // Clear cookies and redirect
  cookies().delete('sb-access-token')
  cookies().delete('sb-refresh-token')
  redirect('/login')
}

export async function deleteAccount(userId: string) {
  const supabase = getServiceRoleClient()

  // Delete user from auth.users, which should cascade to public.users due to foreign key constraint
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error('Delete account error:', error.message)
    return { success: false, error: error.message }
  }

  // Also sign out the user after deletion
  await signOut()
  return { success: true, error: null }
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
