"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Dumbbell, Target, Ruler, Weight, Scale } from 'lucide-react'

export function OnboardingFlow() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [primaryGoal, setPrimaryGoal] = useState<"strength" | "hypertrophy" | "fat_loss" | "endurance" | "general_fitness">(user?.primaryGoal || "general_fitness")
  const [units, setUnits] = useState<"imperial" | "metric">(user?.preferences.units || "imperial")
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    setLoading(true)
    if (step === 1) {
      // Update primary goal
      const success = await updateUser({ primaryGoal })
      if (success) {
        setStep(2)
      } else {
        toast({
          title: "Error",
          description: "Failed to save primary goal. Please try again.",
          variant: "destructive",
        })
      }
    } else if (step === 2) {
      // Update units
      const success = await updateUser({ preferences: { ...user?.preferences, units } })
      if (success) {
        setStep(3)
      } else {
        toast({
          title: "Error",
          description: "Failed to save units. Please try again.",
          variant: "destructive",
        })
      }
    } else if (step === 3) {
      // Save initial body metrics
      if (user) {
        try {
          // In a real app, this would call a server action to save body metrics
          // For now, we'll just update the user preferences to mark onboarding complete
          const success = await updateUser({
            preferences: {
              ...user.preferences,
              units, // Ensure units are saved if changed in this step
              onboardingComplete: true, // Mark onboarding as complete
            }
          })
          if (success) {
            toast({
              title: "Onboarding Complete!",
              description: "You're all set to start your fitness journey.",
            })
            // Optionally, redirect or refresh to show dashboard
          } else {
            toast({
              title: "Error",
              description: "Failed to save body metrics. Please try again.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error saving body metrics:", error)
          toast({
            title: "Error",
            description: "An unexpected error occurred while saving metrics.",
            variant: "destructive",
          })
        }
      }
    }
    setLoading(false)
  }

  if (!user) {
    return null; // Should not happen if OnboardingFlow is rendered after successful login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome, {user.name || user.username}!
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Let's set up your fitness profile.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                What's your primary fitness goal?
              </h3>
              <Select value={primaryGoal} onValueChange={(value: typeof primaryGoal) => setPrimaryGoal(value)} disabled={loading}>
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

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Ruler className="h-5 w-5 text-blue-500" />
                Choose your preferred units:
              </h3>
              <Select value={units} onValueChange={(value: typeof units) => setUnits(value)} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-500" />
                Enter your current body metrics:
              </h3>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight ({units === 'imperial' ? 'lbs' : 'kg'})</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="weight"
                    type="number"
                    placeholder={`e.g., ${units === 'imperial' ? '180' : '82'}`}
                    className="pl-10"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height ({units === 'imperial' ? 'inches' : 'cm'})</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="height"
                    type="number"
                    placeholder={`e.g., ${units === 'imperial' ? '70' : '178'}`}
                    className="pl-10"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : (
              step < 3 ? "Next" : "Finish Onboarding"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
