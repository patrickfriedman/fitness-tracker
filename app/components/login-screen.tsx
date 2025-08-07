'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { login, signup, demoLogin } from '@/app/actions/auth-actions' // Corrected import
import { useFormStatus } from 'react-dom'
import { useToast } from '@/hooks/use-toast'

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Loading...' : text}
    </Button>
  )
}

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async (formData: FormData) => {
    const result = await login(formData) // Corrected function call
    if (result?.message) {
      toast({
        title: 'Sign In Failed',
        description: result.message,
        variant: 'destructive',
      })
    }
  }

  const handleSignUp = async (formData: FormData) => {
    const result = await signup(formData) // Corrected function call
    if (result?.message) {
      toast({
        title: result.success ? 'Sign Up Successful' : 'Sign Up Failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      })
      if (result.success) {
        setIsRegistering(false) // Switch back to login after successful registration
      }
    }
  }

  const handleDemoLogin = async () => {
    const result = await demoLogin()
    if (result?.message) {
      toast({
        title: 'Demo Login Failed',
        description: result.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            {isRegistering ? 'Register' : 'Login'}
          </CardTitle>
          <CardDescription>
            {isRegistering
              ? 'Enter your details to create an account'
              : 'Enter your email and password to sign in'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={isRegistering ? handleSignUp : handleSignIn} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="johndoe" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton text={isRegistering ? 'Register' : 'Sign In'} />
          </form>
          <div className="mt-4 text-center text-sm">
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(false)} className="p-0 h-auto">
                  Sign In
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <Button variant="link" onClick={() => setIsRegistering(true)} className="p-0 h-auto">
                  Register
                </Button>
              </>
            )}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleDemoLogin}>
              Demo Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
