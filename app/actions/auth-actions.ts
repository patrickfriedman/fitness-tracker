'use server'

import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign in error:', error.message)
    return { 
      success: false,
      message: error.message 
    }
  }

  redirect('/')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    console.error('Sign up error:', error.message)
    return { 
      success: false,
      message: error.message 
    }
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

  return { success: true, message: 'Please check your email for verification!' }
}

export async function demoLogin() {
  const supabase = createClient()

  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@example.com'
  const demoPassword = process.env.DEMO_USER_PASSWORD || 'demopassword'

  const { error } = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  })

  if (error) {
    console.error('Demo login error:', error.message)
    return {
      success: false,
      message: error.message,
    }
  }

  redirect('/')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
