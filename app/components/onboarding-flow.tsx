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
import { Target, Activity, Settings, CheckCircle } from 'lucide-react'

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    primaryGoal: "",
    activityLevel: "",
    preferences: {
      theme: "light",
      units: "imperial",
      todayWidgets: [] as string[],
    },
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      updateUser({
        primaryGoal: formData.primaryGoal as any,
        preferences: formData.preferences,
      })
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">What's your primary fitness goal?</h2>
              <p className="text-gray-600">This helps us personalize your experience</p>
            </div>
            
            <RadioGroup
              value={formData.primaryGoal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, primaryGoal: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="weight-loss" id="weight-loss" />
                <Label htmlFor="weight-loss" className="flex-1 cursor-pointer">
                  <div className="font-medium">Weight Loss</div>
                  <div className="text-sm text-gray-500">Lose weight and improve body composition</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                <Label htmlFor="muscle-gain" className="flex-1 cursor-pointer">
                  <div className="font-medium">Muscle Gain</div>
                  <div className="text-sm text-gray-500">Build muscle and increase strength</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="endurance" id="endurance" />
                <Label htmlFor="endurance" className="flex-1 cursor-pointer">
                  <div className="font-medium">Endurance</div>
                  <div className="text-sm text-gray-500">Improve cardiovascular fitness</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="general-fitness" id="general-fitness" />
                <Label htmlFor="general-fitness" className="flex-1 cursor-pointer">
                  <div className="font-medium">General Fitness</div>
                  <div className="text-sm text-gray-500">Stay healthy and maintain fitness</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How active are you currently?</h2>
              <p className="text-gray-600">This helps us recommend appropriate workouts</p>
            </div>
            
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <div className="font-medium">Beginner</div>
                  <div className="text-sm text-gray-500">Little to no exercise experience</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium">Intermediate</div>
                  <div className="text-sm text-gray-500">Some exercise experience, 2-3 times per week</div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Advanced</div>
                  <div className="text-sm text-gray-500">Regular exercise routine, 4+ times per week</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Customize your dashboard</h2>
              <p className="text-gray-600">Choose which widgets to show on your Today tab</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-medium">Today Dashboard Widgets</Label>
                
                {[
                  { id: "metrics", label: "Body Metrics", description: "Weight, body fat, measurements" },
                  { id: "quick-actions", label: "Quick Actions", description: "Fast access to common tasks" },
                  { id: "mood", label: "Mood Tracker", description: "Track your daily mood and energy" },
                  { id: "water", label: "Water Intake", description: "Monitor daily hydration" },
                  { id: "quote", label: "Motivational Quote", description: "Daily inspiration" },
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
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Preferences</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="units">Units</Label>
                    <RadioGroup
                      value={formData.preferences.units}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, units: value as "imperial" | "metric" }
                      }))}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial">Imperial (lbs, ft)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric">Metric (kg, cm)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <RadioGroup
                      value={formData.preferences.theme}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, theme: value as "light" | "dark" }
                      }))}
                      className="mt-2"
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
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.primaryGoal !== ""
      case 2:
        return formData.activityLevel !== ""
      case 3:
        return true // Always can complete the last step
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl">Welcome to FitTracker Pro</CardTitle>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Setup
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
