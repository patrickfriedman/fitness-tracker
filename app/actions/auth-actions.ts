'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { UserProfile } from '@/types/fitness'

export async function login(email: string, password: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(email: string, password: string) {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Signup error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, message: 'Please check your email for a confirmation link.' }
}

export async function logout() {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getSession() {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

export async function updateUserProfile(profile: Partial<UserProfile>) {
  const supabase = createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: userError?.message || 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...profile }, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, data }
}

export async function getProfile() {
  const supabase = createSupabaseServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: userError?.message || 'User not authenticated.' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
