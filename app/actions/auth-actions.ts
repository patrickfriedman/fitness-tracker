'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export async function signIn(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string // Assuming username is part of signup form

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message, success: false }
  }

  // Optionally, insert username into a public profiles table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, username, email })
    
    if (profileError) {
      console.error('Profile creation error:', profileError.message)
      return { 
        success: false,
        message: profileError.message 
      }
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Please check your email to confirm your account.' }
}

export async function demoLogin() {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: process.env.DEMO_USER_EMAIL || 'demo@example.com',
    password: process.env.DEMO_USER_PASSWORD || 'demopassword', // Use a strong default or env var
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
