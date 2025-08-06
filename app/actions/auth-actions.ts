'use server'

import { getServiceRoleClient } from '@/lib/supabase-server'
import { getBrowserClient } from '@/lib/supabase-browser'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = getBrowserClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign-in error:', error.message)
    return { success: false, message: error.message }
  }

  redirect('/')
}

export async function signUp(formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = getBrowserClient()
  const serviceRoleSupabase = getServiceRoleClient()

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
    console.error('Sign-up error:', error.message)
    return { success: false, message: error.message }
  }

  if (data.user) {
    // Optionally, insert username into public.users table if you have one
    // This is an example, adjust according to your 'users' table schema
    const { error: insertError } = await serviceRoleSupabase
      .from('users')
      .insert({ id: data.user.id, username: username, email: email })

    if (insertError) {
      console.error('Error inserting user profile:', insertError.message)
      // You might want to handle this more gracefully, e.g., delete the auth user
      return { success: false, message: 'Error creating user profile.' }
    }
  }

  return { success: true, message: 'Please check your email for verification!' }
}

export async function signOut() {
  const supabase = getBrowserClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign-out error:', error.message)
    return { success: false, message: error.message }
  }

  redirect('/login')
}

export async function demoLogin() {
  const supabase = getBrowserClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: 'demo@example.com',
    password: 'demopassword',
  })

  if (error) {
    console.error('Demo login error:', error.message)
    return { success: false, message: error.message }
  }

  redirect('/')
}
