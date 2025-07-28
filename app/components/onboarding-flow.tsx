"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Dumbbell, Target, Scale } from "lucide-react"
import type { User as FitnessUser } from "../../types/fitness"

interface OnboardingFlowProps {
  onComplete: (user: FitnessUser) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primaryGoal: "",
    currentWeight: "",
    goalWeight: "",
    currentBodyFat: "",
    goalBodyFat: "",
    experience: "",
    workoutDays: "",
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      const user: FitnessUser = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        primaryGoal: formData.primaryGoal as any,
        createdAt: new Date().toISOString(),
      }
      onComplete(user)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email
      case 2:
        return formData.primaryGoal
      case 3:
        return formData.currentWeight
      case 4:
        return formData.experience && formData.workoutDays
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Welcome to FitTracker</h1>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            Step {step} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold mb-2">Let's get to know you</h2>
                <p className="text-gray-600">Tell us a bit about yourself to personalize your experience</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold mb-2">What's your primary goal?</h2>
                <p className="text-gray-600">This helps us tailor your experience and recommendations</p>
              </div>

              <RadioGroup
                value={formData.primaryGoal}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryGoal: value }))}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="strength" id="strength" />
                  <div className="flex-1">
                    <Label htmlFor="strength" className="font-medium">
                      Build Strength
                    </Label>
                    <p className="text-sm text-gray-600">Focus on getting stronger and lifting heavier weights</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="hypertrophy" id="hypertrophy" />
                  <div className="flex-1">
                    <Label htmlFor="hypertrophy" className="font-medium">
                      Build Muscle
                    </Label>
                    <p className="text-sm text-gray-600">Increase muscle size and definition</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="fat_loss" id="fat_loss" />
                  <div className="flex-1">
                    <Label htmlFor="fat_loss" className="font-medium">
                      Lose Fat
                    </Label>
                    <p className="text-sm text-gray-600">Reduce body fat and improve body composition</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="endurance" id="endurance" />
                  <div className="flex-1">
                    <Label htmlFor="endurance" className="font-medium">
                      Improve Endurance
                    </Label>
                    <p className="text-sm text-gray-600">Build cardiovascular fitness and stamina</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Scale className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold mb-2">Body Metrics</h2>
                <p className="text-gray-600">Help us track your progress by setting your starting point and goals</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentWeight">Current Weight (lb)</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    step="0.1"
                    placeholder="185.0"
                    value={formData.currentWeight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentWeight: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="goalWeight">
                    Goal Weight (lb) <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    id="goalWeight"
                    type="number"
                    step="0.1"
                    placeholder="180.0"
                    value={formData.goalWeight}
                    onChange={(e) => setFormData((prev) => ({ ...prev, goalWeight: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="currentBodyFat">
                    Current Body Fat % <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    id="currentBodyFat"
                    type="number"
                    step="0.1"
                    placeholder="18.0"
                    value={formData.currentBodyFat}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentBodyFat: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="goalBodyFat">
                    Goal Body Fat % <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    id="goalBodyFat"
                    type="number"
                    step="0.1"
                    placeholder="15.0"
                    value={formData.goalBodyFat}
                    onChange={(e) => setFormData((prev) => ({ ...prev, goalBodyFat: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h2 className="text-xl font-semibold mb-2">Workout Preferences</h2>
                <p className="text-gray-600">Tell us about your workout experience and schedule</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Experience Level</Label>
                  <RadioGroup
                    value={formData.experience}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner (0-1 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate (1-3 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced (3+ years)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">How many days per week can you workout?</Label>
                  <RadioGroup
                    value={formData.workoutDays}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, workoutDays: value }))}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="3days" />
                      <Label htmlFor="3days">3 days per week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="4days" />
                      <Label htmlFor="4days">4 days per week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="5days" />
                      <Label htmlFor="5days">5 days per week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6+" id="6days" />
                      <Label htmlFor="6days">6+ days per week</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>

            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === totalSteps ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
