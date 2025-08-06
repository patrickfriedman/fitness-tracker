'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function OnboardingFlow() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [name, setName] = useState(user?.name || "")
  const [primaryGoal, setPrimaryGoal] = useState(user?.primaryGoal || "general_fitness")
  const [units, setUnits] = useState(user?.preferences.units || "imperial")
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (step === 1) {
      if (!name) {
        toast({
          title: "Missing Information",
          description: "Please enter your name.",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!primaryGoal) {
        toast({
          title: "Missing Information",
          description: "Please select your primary fitness goal.",
          variant: "destructive",
        })
        return
      }
      setStep(3)
    } else if (step === 3) {
      setLoading(true)
      const success = await updateUser({
        name,
        primaryGoal: primaryGoal as 'strength' | 'hypertrophy' | 'endurance' | 'weight_loss' | 'general_fitness',
        preferences: { ...user?.preferences, units }
      })
      setLoading(false)
      if (success) {
        toast({
          title: "Onboarding Complete!",
          description: "You're all set to start your fitness journey.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save preferences. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to FitTracker!</CardTitle>
          <CardDescription>Let's get you set up for success.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: What's your name?</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: What's your primary fitness goal?</h3>
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select value={primaryGoal} onValueChange={(value) => setPrimaryGoal(value as any)} disabled={loading}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="hypertrophy">Hypertrophy (Muscle Growth)</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Choose your preferred units.</h3>
              <div className="space-y-2">
                <Label htmlFor="units">Units</Label>
                <Select value={units} onValueChange={(value) => setUnits(value as 'imperial' | 'metric')} disabled={loading}>
                  <SelectTrigger id="units">
                    <SelectValue placeholder="Select units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
                    <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={loading} className="ml-auto">
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                step < 3 ? "Next" : "Finish"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
