"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    primaryGoal: user?.primaryGoal || "hypertrophy",
    fitnessLevel: "intermediate",
    workoutDays: 4,
    preferredTime: "morning",
    equipment: [] as string[],
    todayWidgets: ["metrics", "quick-actions", "mood", "water"] as string[]
  })

  const steps = [
    {
      title: "What's your primary fitness goal?",
      content: (
        <div className="space-y-4">
          <Select
            value={formData.primaryGoal}
            onValueChange={(value) => setFormData(prev => ({ ...prev, primaryGoal: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="strength">Build Strength</SelectItem>
              <SelectItem value="hypertrophy">Build Muscle</SelectItem>
              <SelectItem value="fat_loss">Lose Fat</SelectItem>
              <SelectItem value="endurance">Improve Endurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    {
      title: "What's your current fitness level?",
      content: (
        <div className="space-y-4">
          <Select
            value={formData.fitnessLevel}
            onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
              <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
              <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
    {
      title: "How many days per week do you want to work out?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6].map((days) => (
              <Button
                key={days}
                variant={formData.workoutDays === days ? "default" : "outline"}
                onClick={() => setFormData(prev => ({ ...prev, workoutDays: days }))}
                className="h-12"
              >
                {days} days
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "What equipment do you have access to?",
      content: (
        <div className="space-y-4">
          {["Dumbbells", "Barbell", "Resistance Bands", "Pull-up Bar", "Gym Membership", "Bodyweight Only"].map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={equipment}
                checked={formData.equipment.includes(equipment)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({ ...prev, equipment: [...prev.equipment, equipment] }))
                  } else {
                    setFormData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e !== equipment) }))
                  }
                }}
              />
              <Label htmlFor={equipment}>{equipment}</Label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Customize your dashboard",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose which widgets to show on your Today tab:</p>
          {[
            { id: "metrics", label: "Body Metrics" },
            { id: "quick-actions", label: "Quick Actions" },
            { id: "mood", label: "Mood Tracker" },
            { id: "water", label: "Water Tracker" },
            { id: "quote", label: "Motivational Quote" }
          ].map((widget) => (
            <div key={widget.id} className="flex items-center space-x-2">
              <Checkbox
                id={widget.id}
                checked={formData.todayWidgets.includes(widget.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFormData(prev => ({ ...prev, todayWidgets: [...prev.todayWidgets, widget.id] }))
                  } else {
                    setFormData(prev => ({ ...prev, todayWidgets: prev.todayWidgets.filter(w => w !== widget.id) }))
                  }
                }}
              />
              <Label htmlFor={widget.id}>{widget.label}</Label>
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
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    updateUser({
      primaryGoal: formData.primaryGoal as "strength" | "hypertrophy" | "fat_loss" | "endurance",
      preferences: {
        theme: "light",
        units: "imperial",
        todayWidgets: formData.todayWidgets,
        fitnessLevel: formData.fitnessLevel,
        workoutDays: formData.workoutDays,
        preferredTime: formData.preferredTime,
        equipment: formData.equipment
      }
    })
    onComplete()
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardTitle className="text-center">{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].content}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Complete" : "Next"}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
