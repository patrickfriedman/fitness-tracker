"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dumbbell, Mail, Lock, UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [primaryGoal, setPrimaryGoal] = useState<"strength" | "hypertrophy" | "fat_loss" | "endurance" | "general_fitness">("general_fitness")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    let result;

    if (isRegistering) {
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      if (password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      result = await register({ email, password, name, primaryGoal })
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
    const result = await login("demo@fittracker.com", "demo123") // Using a specific demo email/password
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

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FitTracker Pro
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            {isRegistering ? "Enter your details to create a new account." : "Your fitness journey starts here"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="primary-goal">Primary Goal</Label>
                <Select
                  value={primaryGoal}
                  onValueChange={(value: "strength" | "hypertrophy" | "fat_loss" | "endurance" | "general_fitness") =>
                    setPrimaryGoal(value)
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="hypertrophy">Muscle Building</SelectItem>
                    <SelectItem value="fat_loss">Fat Loss</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegistering ? "Create a password (min 6 characters)" : "Enter your password"}
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={isRegistering ? 6 : undefined}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isRegistering ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                isRegistering ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <Button variant="link" onClick={() => setIsRegistering(false)} disabled={loading} className="p-0 h-auto">
                  Sign In
                </Button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <Button variant="link" onClick={() => setIsRegistering(true)} disabled={loading} className="p-0 h-auto">
                  Sign Up
                </Button>
              </>
            )}
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Logging in as Demo...
                </span>
              ) : (
                "Try Demo Account"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
