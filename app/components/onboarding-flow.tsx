"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/app/actions/profile-actions' // Assuming you'll create this action
import { useAuth } from '@/contexts/auth-context'

export default function OnboardingFlow() {
  const { session } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [gender, setGender] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [height, setHeight] = useState<number | ''>('') // in cm
  const [weight, setWeight] = useState<number | ''>('') // in kg
  const [goal, setGoal] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [loading, setLoading] = useState(false)

  const totalSteps = 3

  const handleNext = () => {
    if (step === 1 && (!gender || !age)) {
      toast({
        title: 'Validation Error',
        description: 'Please select gender and enter age.',
        variant: 'destructive',
      })
      return
    }
    if (step === 2 && (!height || !weight)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter height and weight.',
        variant: 'destructive',
      })
      return
    }
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!goal || !activityLevel) {
      toast({
        title: 'Validation Error',
        description: 'Please select your fitness goal and activity level.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const profileData = {
      gender,
      age: Number(age),
      height_cm: Number(height),
      weight_kg: Number(weight),
      fitness_goal: goal,
      activity_level: activityLevel,
    }

    const { success, message } = await updateProfile(session.user.id, profileData)

    if (success) {
      toast({
        title: 'Onboarding Complete',
        description: message,
      })
      router.push('/') // Redirect to dashboard
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 30"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 175"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select your primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">Lose Weight</SelectItem>
                  <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                  <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                  <SelectItem value="maintain_fitness">Maintain Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (hard exercise/sports 6-7 days/week)</SelectItem>
                  <SelectItem value="extra_active">Extra Active (very hard exercise/physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Onboarding - Step {step} of {totalSteps}</CardTitle>
          <Progress value={(step / totalSteps) * 100} className="w-full mt-4" />
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
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
              {loading ? 'Finishing...' : 'Finish Onboarding'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
