"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let result;

    if (isRegistering) {
      result = await register({ email, password, username, name })
      if (result.success) {
        toast({
          title: "Account Created!",
          description: "Welcome to FitTracker! You are now logged in.",
        })
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "Please check your details and try again.",
          variant: "destructive",
        })
      }
    } else {
      result = await login(email, password)
      if (result.success) {
        toast({
          title: "Login Successful!",
          description: "Welcome back to FitTracker!",
        })
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        })
      }
    }
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    const result = await login("demo", "demo") // Use "demo" as a special identifier
    if (result.success) {
      toast({
        title: "Demo Login Successful!",
        description: "Exploring FitTracker with a demo account.",
      })
    } else {
      toast({
        title: "Demo Login Failed",
        description: result.error || "Could not log in to demo account.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {isRegistering ? "Create Account" : "Login to FitTracker"}
          </CardTitle>
          <CardDescription>
            {isRegistering ? "Enter your details to create a new account." : "Enter your credentials to access your fitness journey."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRegistering ? "Creating..." : "Logging in..."}
                </span>
              ) : (
                isRegistering ? "Create Account" : "Login"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <Button variant="link" onClick={() => setIsRegistering(false)} disabled={loading}>
                  Login
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="link" onClick={() => setIsRegistering(true)} disabled={loading}>
                  Sign up
                </Button>
              </>
            )}
          </div>
          <div className="mt-4">
            <Button variant="outline" className="w-full" onClick={handleDemoLogin} disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Logging in as Demo...
                </span>
              ) : (
                "Login as Demo User"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
