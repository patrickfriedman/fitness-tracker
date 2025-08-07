import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error is typically fixed by calling `cookies().set()` inside a Server Action.
            // For more information, see https://nextjs.org/docs/app/api-reference/functions/cookies#cookiesetname-value-options
            console.warn('Could not set cookie from server component:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called from a Server Component or Server Action.
            // This error is typically fixed by calling `cookies().set()` inside a Server Action.
            // For more information, see https://nextjs.org/docs/app/api-reference/functions/cookies#cookiesetname-value-options
            console.warn('Could not remove cookie from server component:', error)
          }
        },
      },
    }
  )
}
