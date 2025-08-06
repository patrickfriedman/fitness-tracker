'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

export function LoginScreen() {
  const { login, register, demoLogin, isLoading, error } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // Added confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegistering) {
      if (password !== confirmPassword) {
        // Handle password mismatch error
        return;
      }
      await register(name, email, password)
    } else {
      await login(email, password)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isRegistering ? 'Create Account' : 'Login'}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? 'Enter your details to create a new account.'
              : 'Enter your email and password to access your account.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegistering && ( // Added confirm password field for registration
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isRegistering ? (
                'Register'
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(false)} disabled={isLoading}>
                  Login
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(true)} disabled={isLoading}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={demoLogin} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Continue with Demo Account'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
