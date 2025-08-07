import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/theme-context'
import { Toaster } from '@/components/ui/toaster'
import { getSession } from '@/app/actions/auth-actions' // Corrected import
import { redirect } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fitness Tracker',
  description: 'Track your fitness journey',
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();

  // Redirect to login if no session and not on the login page
  // Note: This logic might need refinement based on your exact routing strategy
  // and if you have public pages that don't require authentication.
  // For now, it redirects if no session and the current path is not /login.
  const isLoginPage = children?.props?.child?.props?.segment === 'login';
  if (!session && !isLoginPage) {
    redirect('/login');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
