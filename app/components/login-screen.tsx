'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function LoginScreen() {
  const { login, register, loginDemo } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (isRegistering) {
        await register(email, password, username)
      } else {
        await login(email, password)
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await loginDemo()
    } catch (err: any) {
      setError(err.message || 'Failed to log in as demo user.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Button variant="ghost" onClick={handleDemoLogin} disabled={loading}>
              <Image src="/placeholder-logo.png" alt="Fitness App Logo" width={64} height={64} />
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold">
            {isRegistering ? 'Create Account' : 'Login'}
          </CardTitle>
          <CardDescription>
            {isRegistering ? 'Enter your details to create an account' : 'Enter your credentials to access your fitness journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRegistering ? 'Creating...' : 'Logging in...'}
                </>
              ) : (
                isRegistering ? 'Create Account' : 'Login'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(false)} disabled={loading}>
                  Login
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(true)} disabled={loading}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={handleDemoLogin} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entering Demo...
                </>
              ) : (
                'Continue as Demo User'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
