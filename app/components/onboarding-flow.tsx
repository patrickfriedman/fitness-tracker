'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/components/ui/use-toast'

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    goal: '',
    activityLevel: '',
    weight: '',
    height: '',
    age: '',
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    // Basic validation for current step before moving on
    if (step === 1 && !formData.goal) {
      toast({
        title: 'Please select a goal.',
        variant: 'destructive',
      })
      return
    }
    if (step === 2 && !formData.activityLevel) {
      toast({
        title: 'Please select your activity level.',
        variant: 'destructive',
      })
      return
    }
    if (step === 3 && (!formData.weight || !formData.height || !formData.age)) {
      toast({
        title: 'Please fill in all body metrics.',
        variant: 'destructive',
      })
      return
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1)
    } else {
      // Onboarding complete
      toast({
        title: 'Onboarding Complete!',
        description: 'Your fitness profile has been set up.',
      })
      console.log('Onboarding Data:', formData)
      // Here you would typically send data to your backend/Supabase
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Onboarding: Tell Us About Yourself</CardTitle>
        <Progress value={progress} className="w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What is your primary fitness goal?</h3>
            <Select onValueChange={(value) => handleSelectChange('goal', value)} value={formData.goal}>
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Lose Weight</SelectItem>
                <SelectItem value="gain-muscle">Gain Muscle</SelectItem>
                <SelectItem value="improve-endurance">Improve Endurance</SelectItem>
                <SelectItem value="maintain-fitness">Maintain Fitness</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What is your activity level?</h3>
            <Select onValueChange={(value) => handleSelectChange('activityLevel', value)} value={formData.activityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                <SelectItem value="lightly-active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                <SelectItem value="moderately-active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                <SelectItem value="very-active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                <SelectItem value="extra-active">Extra Active (very hard exercise/physical job)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enter your current body metrics:</h3>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="e.g., 70"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="e.g., 175"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="e.g., 30"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold">Review your information:</h3>
            <p><strong>Goal:</strong> {formData.goal || 'Not set'}</p>
            <p><strong>Activity Level:</strong> {formData.activityLevel || 'Not set'}</p>
            <p><strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : 'Not set'}</p>
            <p><strong>Height:</strong> {formData.height ? `${formData.height} cm` : 'Not set'}</p>
            <p><strong>Age:</strong> {formData.age || 'Not set'}</p>
            <p className="text-muted-foreground mt-4">You can always update these details later in your profile settings.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === totalSteps ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  )
}
