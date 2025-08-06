"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { Target, Activity, Scale, Calendar } from 'lucide-react'

interface OnboardingData {
  primaryGoal: string
  fitnessLevel: string
  workoutDays: string[]
  preferences: {
    units: string
    todayWidgets: string[]
  }
}

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { updateUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    primaryGoal: "",
    fitnessLevel: "",
    workoutDays: [],
    preferences: {
      units: "imperial",
      todayWidgets: ["metrics", "quick-actions", "mood", "water"]
    }
  })

  const steps = [
    {
      title: "What's your primary fitness goal?",
      content: (
        <RadioGroup
          value={data.primaryGoal}
          onValueChange={(value) => setData(prev => ({ ...prev, primaryGoal: value }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weight_loss" id="weight_loss" />
            <Label htmlFor="weight_loss">Weight Loss</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="muscle_gain" id="muscle_gain" />
            <Label htmlFor="muscle_gain">Muscle Gain</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strength" id="strength" />
            <Label htmlFor="strength">Build Strength</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="endurance" id="endurance" />
            <Label htmlFor="endurance">Improve Endurance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general_fitness" id="general_fitness" />
            <Label htmlFor="general_fitness">General Fitness</Label>
          </div>
        </RadioGroup>
      )
    },
    {
      title: "What's your current fitness level?",
      content: (
        <RadioGroup
          value={data.fitnessLevel}
          onValueChange={(value) => setData(prev => ({ ...prev, fitnessLevel: value }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner">Beginner (0-6 months)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate">Intermediate (6 months - 2 years)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced">Advanced (2+ years)</Label>
          </div>
        </RadioGroup>
      )
    },
    {
      title: "Which days do you prefer to work out?",
      content: (
        <div className="space-y-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={data.workoutDays.includes(day)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setData(prev => ({
                      ...prev,
                      workoutDays: [...prev.workoutDays, day]
                    }))
                  } else {
                    setData(prev => ({
                      ...prev,
                      workoutDays: prev.workoutDays.filter(d => d !== day)
                    }))
                  }
                }}
              />
              <Label htmlFor={day}>{day}</Label>
            </div>
          ))}
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      updateUser({
        primaryGoal: data.primaryGoal,
        fitnessLevel: data.fitnessLevel,
        workoutDays: data.workoutDays,
        preferences: data.preferences
      })
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return data.primaryGoal !== ""
      case 1:
        return data.fitnessLevel !== ""
      case 2:
        return data.workoutDays.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Let's set up your profile</CardTitle>
            <div className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>
          </div>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{steps[currentStep].title}</h3>
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
