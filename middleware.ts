import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase-server' // Use server client for middleware

export async function middleware(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Allow access to login page without session
  if (pathname.startsWith('/login')) {
    if (session) {
      // If logged in, redirect from login to home
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Protect other routes: redirect to login if no session
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (e.g. /public/images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
