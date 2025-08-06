'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function OnboardingFlow() {
  const { user, updateUser, loading } = useAuth()
  const [primaryGoal, setPrimaryGoal] = useState<string | undefined>(user?.primaryGoal || undefined)
  const [step, setStep] = useState(1)

  const handleGoalSelect = (value: string) => {
    setPrimaryGoal(value)
  }

  const handleCompleteOnboarding = async () => {
    if (!primaryGoal) {
      toast({
        title: 'Please select a primary goal.',
        variant: 'destructive',
      })
      return
    }

    const success = await updateUser({ primaryGoal: primaryGoal as any }) // Cast to any for now
    if (success) {
      toast({
        title: 'Onboarding Complete!',
        description: 'Your fitness journey begins now.',
      })
      setStep(2) // Or redirect, or show dashboard
    } else {
      toast({
        title: 'Error',
        description: 'Failed to save your goal. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome, {user?.name || 'Fitness Enthusiast'}!</CardTitle>
          <CardDescription>Let's set up your fitness journey.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's your primary fitness goal?</h3>
              <RadioGroup onValueChange={handleGoalSelect} value={primaryGoal}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="strength" id="strength" />
                  <Label htmlFor="strength">Build Strength</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hypertrophy" id="hypertrophy" />
                  <Label htmlFor="hypertrophy">Gain Muscle (Hypertrophy)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fat_loss" id="fat_loss" />
                  <Label htmlFor="fat_loss">Lose Fat</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="endurance" id="endurance" />
                  <Label htmlFor="endurance">Improve Endurance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="general_fitness" id="general_fitness" />
                  <Label htmlFor="general_fitness">General Fitness / Health</Label>
                </div>
              </RadioGroup>
              <Button onClick={handleCompleteOnboarding} className="w-full" disabled={loading || !primaryGoal}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Complete Onboarding'}
              </Button>
            </div>
          )}
          {step === 2 && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-500">Setup Complete!</h3>
              <p className="mt-2 text-muted-foreground">You're all set to start tracking your progress.</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
