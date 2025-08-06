'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    setError(null)
    if (step === 1 && !name) {
      setError('Please enter your name.')
      return
    }
    if (step === 2 && !goal) {
      setError('Please select your primary fitness goal.')
      return
    }
    if (step === 3 && (!weight || !height)) {
      setError('Please enter your weight and height.')
      return
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Onboarding complete:', { name, goal, weight, height })
      // In a real app, you'd save this to the database
      // and then redirect the user to the main dashboard.
      // For now, we'll just log it and reset.
      setStep(1) // Reset for demo purposes
      setName('')
      setGoal('')
      setWeight('')
      setHeight('')
      alert('Onboarding complete! Welcome to your fitness journey.')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Fitness Tracker!</CardTitle>
          <CardDescription>Let&apos;s get you set up for success.</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Your Name</h3>
              <div>
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Your Goal</h3>
              <div>
                <Label htmlFor="goal">What&apos;s your primary fitness goal?</Label>
                <Select value={goal} onValueChange={setGoal} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                    <SelectItem value="general_fitness">General Fitness</SelectItem>
                    <SelectItem value="stress_reduction">Stress Reduction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Body Metrics</h3>
              <div>
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 4: Review & Confirm</h3>
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Goal:</strong> {goal.replace(/_/g, ' ')}
              </p>
              <p>
                <strong>Weight:</strong> {weight} kg
              </p>
              <p>
                <strong>Height:</strong> {height} cm
              </p>
              <Textarea placeholder="Any additional notes or preferences?" className="mt-4" />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={loading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finishing...
                  </>
                ) : (
                  'Finish Onboarding'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
