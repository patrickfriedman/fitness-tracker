'use server'

import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export async function login(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient()

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
      errors: { general: error.message },
    }
  }

  redirect('/')
}

export async function signup(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient()

  const validatedFields = signupSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, email, password } = validatedFields.data

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
    return {
      success: false,
      message: error.message,
      errors: { general: error.message },
    }
  }

  if (data.user && !data.session) {
    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      errors: {},
    }
  }

  redirect('/')
}

export async function logout() {
  const cookieStore = cookies()
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getSession() {
  const cookieStore = cookies()
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function demoLogin() {
  const cookieStore = cookies()
  const supabase = createClient()

  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@example.com';
  const demoPassword = process.env.DEMO_USER_PASSWORD || 'demopassword'; // Use a strong default or env var

  const { error } = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  if (error) {
    console.error('Demo login error:', error.message);
    return {
      success: false,
      message: error.message,
    };
  }

  redirect('/');
}
