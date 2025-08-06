import Metadata from 'next'
import GeistSans from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
// If 'GeistMono' is not exported, try using 'GeistMonoFont' or check the module for the correct export.
// For example, if the correct export is 'GeistMonoFont', use:
// import { GeistMonoFont } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="FitTracker" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
