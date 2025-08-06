'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
import { useFormState } from 'react-dom'
import { login, signup } from '@/app/actions/auth-actions'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {text}
    </Button>
  )
}

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const { loginDemoUser } = useAuth()

  const [loginState, loginAction] = useFormState(login, {
    success: false,
    message: '',
    errors: {},
  })

  const [signupState, signupAction] = useFormState(signup, {
    success: false,
    message: '',
    errors: {},
  })

  // Show toast messages for login/signup results
  if (loginState.message && !loginState.errors) {
    toast({
      title: loginState.success ? 'Login Successful' : 'Login Failed',
      description: loginState.message,
      variant: loginState.success ? 'default' : 'destructive',
    })
    loginState.message = '' // Clear message after showing toast
  }

  if (signupState.message && !signupState.errors) {
    toast({
      title: signupState.success ? 'Sign Up Successful' : 'Sign Up Failed',
      description: signupState.message,
      variant: signupState.success ? 'default' : 'destructive',
    })
    signupState.message = '' // Clear message after showing toast
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            {isLogin ? 'Login' : 'Sign Up'}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your credentials to access your fitness dashboard.'
              : 'Create an account to start your fitness journey.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={isLogin ? loginAction : signupAction} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="john_doe" required />
                {signupState.errors?.username && (
                  <p className="text-red-500 text-sm mt-1">{signupState.errors.username}</p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {isLogin && loginState.errors?.email && (
                <p className="text-red-500 text-sm mt-1">{loginState.errors.email}</p>
              )}
              {!isLogin && signupState.errors?.email && (
                <p className="text-red-500 text-sm mt-1">{signupState.errors.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {isLogin && loginState.errors?.password && (
                <p className="text-red-500 text-sm mt-1">{loginState.errors.password}</p>
              )}
              {!isLogin && signupState.errors?.password && (
                <p className="text-red-500 text-sm mt-1">{signupState.errors.password}</p>
              )}
            </div>
            {isLogin && loginState.message && !loginState.errors && (
              <p className="text-red-500 text-sm text-center">{loginState.message}</p>
            )}
            {!isLogin && signupState.message && !signupState.errors && (
              <p className="text-green-500 text-sm text-center">{signupState.message}</p>
            )}
            <SubmitButton text={isLogin ? 'Login' : 'Sign Up'} />
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <Button variant="link" onClick={() => setIsLogin(false)} className="p-0 h-auto">
                  Sign up
                </Button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Button variant="link" onClick={() => setIsLogin(true)} className="p-0 h-auto">
                  Login
                </Button>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={loginDemoUser}>
            Continue with Demo Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
