'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { updateUserProfile } from '@/app/actions/auth-actions'

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const { toast } = useToast()

  const handleNext = async () => {
    if (step === 1 && !name) {
      toast({
        title: 'Error',
        description: 'Please enter your name.',
        variant: 'destructive',
      })
      return
    }
    if (step === 2 && !goal) {
      toast({
        title: 'Error',
        description: 'Please select a fitness goal.',
        variant: 'destructive',
      })
      return
    }
    if (step === 3 && !activityLevel) {
      toast({
        title: 'Error',
        description: 'Please select your activity level.',
        variant: 'destructive',
      })
      return
    }

    if (step < 4) {
      setStep(step + 1)
    } else {
      // Final step: save data
      const result = await updateUserProfile({ name, fitness_goal: goal, activity_level: activityLevel })
      if (result.success) {
        toast({
          title: 'Onboarding Complete!',
          description: 'Your profile has been set up successfully.',
        })
        // Optionally redirect or update UI
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save profile.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {step === 1 && 'Welcome! What should we call you?'}
            {step === 2 && 'What is your main fitness goal?'}
            {step === 3 && 'How active are you normally?'}
            {step === 4 && 'All set!'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 && 'This helps us personalize your experience.'}
            {step === 2 && 'Choose one that best describes your primary objective.'}
            {step === 3 && 'This helps us recommend suitable plans.'}
            {step === 4 && 'Review your information before finishing.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {step === 2 && (
            <RadioGroup onValueChange={setGoal} value={goal} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lose_weight" id="goal-lose-weight" />
                <Label htmlFor="goal-lose-weight">Lose Weight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gain_muscle" id="goal-gain-muscle" />
                <Label htmlFor="goal-gain-muscle">Gain Muscle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="improve_endurance" id="goal-improve-endurance" />
                <Label htmlFor="goal-improve-endurance">Improve Endurance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintain_fitness" id="goal-maintain-fitness" />
                <Label htmlFor="goal-maintain-fitness">Maintain Fitness</Label>
              </div>
            </RadioGroup>
          )}

          {step === 3 && (
            <RadioGroup onValueChange={setActivityLevel} value={activityLevel} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sedentary" id="activity-sedentary" />
                <Label htmlFor="activity-sedentary">Sedentary (little to no exercise)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lightly_active" id="activity-lightly-active" />
                <Label htmlFor="activity-lightly-active">Lightly Active (light exercise/sports 1-3 days/week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderately_active" id="activity-moderately-active" />
                <Label htmlFor="activity-moderately-active">Moderately Active (moderate exercise/sports 3-5 days/week)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_active" id="activity-very-active" />
                <Label htmlFor="activity-very-active">Very Active (hard exercise/sports 6-7 days/week)</Label>
              </div>
            </RadioGroup>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Name:</span> {name}
              </p>
              <p>
                <span className="font-semibold">Goal:</span> {goal.replace(/_/g, ' ')}
              </p>
              <p>
                <span className="font-semibold">Activity Level:</span> {activityLevel.replace(/_/g, ' ')}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="ml-auto">
              {step < 4 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
