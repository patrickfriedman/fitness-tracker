'use server'

import { getBrowserClient, getServiceRoleClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validatedFields = loginSchema.safeParse({ email, password })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation Error',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = getBrowserClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  redirect('/dashboard')
}

export async function signup(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const validatedFields = signupSchema.safeParse({ username, email, password })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation Error',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const supabase = getBrowserClient()
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
    return { success: false, message: error.message }
  }

  // Optionally, insert user into public.users table if needed for additional profile data
  if (data.user) {
    const serviceRoleSupabase = getServiceRoleClient();
    const { error: insertError } = await serviceRoleSupabase
      .from('users')
      .insert({ id: data.user.id, username, email });

    if (insertError) {
      console.error('Error inserting user into public.users:', insertError.message);
      // You might want to handle this error more gracefully, e.g., log it and still proceed
      // or return an error to the user if it's critical.
    }
  }

  return { success: true, message: 'Sign up successful! Please check your email to confirm your account.' }
}

export async function logout() {
  const supabase = getBrowserClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error logging out:', error.message)
  }

  redirect('/login')
}

export async function getSession() {
  const supabase = getBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = getBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
