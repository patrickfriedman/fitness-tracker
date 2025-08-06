import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'

export const metadata = {
  title: 'FitTracker Pro',
  description: 'Your fitness journey starts here',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="FitTracker" />
        <link rel="apple-touch-icon" href="/app-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
