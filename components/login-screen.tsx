'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn, signUp, demoLogin } from '@/app/actions/auth-actions'
import { useToast } from '@/components/ui/use-toast' // Correct import for useToast

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast() // Destructure toast from useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)

    let result
    if (isSignUp) {
      result = await signUp(formData)
    } else {
      result = await signIn(formData)
    }

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else if (result?.success) {
      toast({
        title: 'Success',
        description: result.message,
      })
    }
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    const result = await demoLogin()
    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            {isSignUp ? 'Create an account' : 'Log in to your account'}
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Enter your details below to create your account' : 'Enter your email below to log in'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsSignUp(false)} className="p-0 h-auto">
                  Sign In
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Button variant="link" onClick={() => setIsSignUp(true)} className="p-0 h-auto">
                  Sign Up
                </Button>
              </>
            )}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
              {loading ? 'Loading...' : 'Continue with Demo Account'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
