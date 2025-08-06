"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    primaryGoal: "",
    fitnessLevel: "",
    workoutFrequency: "",
    preferredWorkoutTime: "",
    height: "",
    weight: "",
    targetWeight: "",
    medicalConditions: "",
    preferences: {
      units: "imperial" as "metric" | "imperial",
      theme: "light" as "light" | "dark",
      todayWidgets: ["metrics", "quick-actions", "mood"] as string[],
    },
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (user) {
      updateUser({
        ...user,
        primaryGoal: formData.primaryGoal as any,
        preferences: {
          ...user.preferences,
          ...formData.preferences,
        },
      })
    }
    onComplete()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What's your primary fitness goal?</h2>
              <p className="text-gray-600">This helps us personalize your experience.</p>
            </div>
            <RadioGroup
              value={formData.primaryGoal}
              onValueChange={(value) => setFormData({ ...formData, primaryGoal: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="strength" id="strength" />
                <Label htmlFor="strength">Build Strength</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hypertrophy" id="hypertrophy" />
                <Label htmlFor="hypertrophy">Build Muscle (Hypertrophy)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="endurance" id="endurance" />
                <Label htmlFor="endurance">Improve Endurance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight_loss" id="weight_loss" />
                <Label htmlFor="weight_loss">Lose Weight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general_fitness" id="general_fitness" />
                <Label htmlFor="general_fitness">General Fitness</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What's your fitness level?</h2>
              <p className="text-gray-600">Be honest - this helps us recommend appropriate workouts.</p>
            </div>
            <RadioGroup
              value={formData.fitnessLevel}
              onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner (New to fitness)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate (Some experience)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced (Very experienced)</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about your body metrics</h2>
              <p className="text-gray-600">This helps us track your progress and set realistic goals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="70"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="weight">Current Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="150"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="140"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="medicalConditions">Any medical conditions or injuries? (Optional)</Label>
              <Textarea
                id="medicalConditions"
                placeholder="Let us know about any conditions that might affect your workouts..."
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Customize your preferences</h2>
              <p className="text-gray-600">Set up your dashboard and preferences.</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Units</Label>
                <RadioGroup
                  value={formData.preferences.units}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, units: value as "metric" | "imperial" },
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial">Imperial (lbs, inches)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric">Metric (kg, cm)</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Theme</Label>
                <RadioGroup
                  value={formData.preferences.theme}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, theme: value as "light" | "dark" },
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>Welcome to FitTracker Pro!</CardTitle>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !formData.primaryGoal) ||
                (currentStep === 2 && !formData.fitnessLevel)
              }
            >
              {currentStep === totalSteps ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
