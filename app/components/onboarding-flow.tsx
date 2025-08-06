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
import { Target, Activity, Utensils, TrendingUp } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUser } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    primaryGoal: "",
    activityLevel: "",
    preferences: {
      units: "imperial",
      todayWidgets: [] as string[],
    },
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      updateUser({
        primaryGoal: formData.primaryGoal as any,
        preferences: {
          ...user?.preferences,
          ...formData.preferences,
        },
      })
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleWidgetToggle = (widget: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        todayWidgets: checked
          ? [...prev.preferences.todayWidgets, widget]
          : prev.preferences.todayWidgets.filter(w => w !== widget)
      }
    }))
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">What's your primary fitness goal?</h2>
              <p className="text-gray-600">This helps us personalize your experience</p>
            </div>
            
            <RadioGroup
              value={formData.primaryGoal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, primaryGoal: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="weight_loss" id="weight_loss" />
                <Label htmlFor="weight_loss" className="flex-1 cursor-pointer">
                  <div className="font-medium">Weight Loss</div>
                  <div className="text-sm text-gray-500">Burn calories and lose weight</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                <Label htmlFor="muscle_gain" className="flex-1 cursor-pointer">
                  <div className="font-medium">Muscle Gain</div>
                  <div className="text-sm text-gray-500">Build strength and muscle mass</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="maintenance" id="maintenance" />
                <Label htmlFor="maintenance" className="flex-1 cursor-pointer">
                  <div className="font-medium">Maintenance</div>
                  <div className="text-sm text-gray-500">Stay healthy and maintain current fitness</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="endurance" id="endurance" />
                <Label htmlFor="endurance" className="flex-1 cursor-pointer">
                  <div className="font-medium">Endurance</div>
                  <div className="text-sm text-gray-500">Improve cardiovascular fitness</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How active are you?</h2>
              <p className="text-gray-600">This helps us set realistic targets</p>
            </div>
            
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="sedentary" id="sedentary" />
                <Label htmlFor="sedentary" className="flex-1 cursor-pointer">
                  <div className="font-medium">Sedentary</div>
                  <div className="text-sm text-gray-500">Little to no exercise</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="lightly_active" id="lightly_active" />
                <Label htmlFor="lightly_active" className="flex-1 cursor-pointer">
                  <div className="font-medium">Lightly Active</div>
                  <div className="text-sm text-gray-500">Light exercise 1-3 days/week</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="moderately_active" id="moderately_active" />
                <Label htmlFor="moderately_active" className="flex-1 cursor-pointer">
                  <div className="font-medium">Moderately Active</div>
                  <div className="text-sm text-gray-500">Moderate exercise 3-5 days/week</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="very_active" id="very_active" />
                <Label htmlFor="very_active" className="flex-1 cursor-pointer">
                  <div className="font-medium">Very Active</div>
                  <div className="text-sm text-gray-500">Hard exercise 6-7 days/week</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Customize your dashboard</h2>
              <p className="text-gray-600">Choose which widgets to show on your Today tab</p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: "metrics", label: "Body Metrics", description: "Track weight, body fat, etc." },
                { id: "mood", label: "Mood Tracker", description: "Log your daily mood and energy" },
                { id: "water", label: "Water Intake", description: "Track daily hydration" },
                { id: "quick-actions", label: "Quick Actions", description: "Fast access to common tasks" },
              ].map((widget) => (
                <div key={widget.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={widget.id}
                    checked={formData.preferences.todayWidgets.includes(widget.id)}
                    onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked as boolean)}
                  />
                  <Label htmlFor={widget.id} className="flex-1 cursor-pointer">
                    <div className="font-medium">{widget.label}</div>
                    <div className="text-sm text-gray-500">{widget.description}</div>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.primaryGoal !== ""
      case 2:
        return formData.activityLevel !== ""
      case 3:
        return formData.preferences.todayWidgets.length > 0
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-center">Welcome to FitTracker Pro!</CardTitle>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-gray-500">
              Step {step} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {step === totalSteps ? "Complete Setup" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
