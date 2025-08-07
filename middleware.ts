import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: { path?: string; expires?: Date; maxAge?: number; domain?: string; secure?: boolean; httpOnly?: boolean; sameSite?: 'strict' | 'lax' | 'none'; }) {
          request.cookies.set(name, value, options)
          response.cookies.set(name, value, options)
        },
        remove(name: string, options: { path?: string; expires?: Date; maxAge?: number; domain?: string; secure?: boolean; httpOnly?: boolean; sameSite?: 'strict' | 'lax' | 'none'; }) {
          request.cookies.set(name, '', options)
          response.cookies.set(name, '', options)
        },
      },
    }
  )

  // Refresh the session to ensure it's up-to-date
  await supabase.auth.getSession()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - signup (signup page)
     * - api (api routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|signup|api).*)',
  ],
}
