"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { signInWithEmail, signUpWithEmail } from '@/app/actions/auth-actions'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    let result
    if (isLogin) {
      result = await signInWithEmail(new FormData(event.target as HTMLFormElement))
    } else {
      result = await signUpWithEmail(new FormData(event.target as HTMLFormElement))
    }

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      })
      // Redirection handled by server action
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            {isLogin ? 'Login to Fitness Tracker' : 'Sign Up for Fitness Tracker'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isLogin ? 'Enter your credentials below' : 'Create your account'}
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="link" className="w-full" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </Button>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Continue as Guest (No Auth)
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
