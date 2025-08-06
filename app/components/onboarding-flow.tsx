'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useToast } from '@/hooks/use-toast'

export default function OnboardingFlow() {
  const { session, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const { toast } = useToast()

  // Open onboarding if user is logged in and no profile data exists (simplified check)
  // This would ideally check a 'profiles' table for completion status
  useEffect(() => {
    if (!isLoading && session && !session.user.user_metadata?.onboarding_complete) {
      setIsOpen(true)
    }
  }, [session, isLoading])

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    const supabase = getBrowserClient()
    const user = session?.user

    if (!user) {
      toast({
        title: 'Error',
        description: 'User not logged in.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Update user metadata in auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          gender,
          age: parseInt(age),
          activity_level: activityLevel,
          onboarding_complete: true, // Mark onboarding as complete
        },
      })

      if (authError) throw authError

      // Insert or update body metrics in the public.body_metrics table
      const { error: metricsError } = await supabase
        .from('body_metrics')
        .upsert(
          {
            user_id: user.id,
            weight: parseFloat(weight),
            height: parseFloat(height),
            // You might calculate BMI here or store it as a separate field
            // For simplicity, we'll just store weight and height
            created_at: new Date().toISOString(), // Or use a specific date if tracking history
          },
          { onConflict: 'user_id' } // Update if user_id already exists
        )

      if (metricsError) throw metricsError

      toast({
        title: 'Onboarding Complete',
        description: 'Your profile has been set up successfully!',
      })
      setIsOpen(false)
    } catch (error: any) {
      console.error('Onboarding submission error:', error)
      toast({
        title: 'Error',
        description: `Failed to save profile: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  if (isLoading || !session || session.user.user_metadata?.onboarding_complete) {
    return null // Don't render if loading, not logged in, or onboarding is complete
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Fitness Tracker!</DialogTitle>
          <DialogDescription>
            Let's get you set up. Please provide some basic information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
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
                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 30" />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 175" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 70" />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="activity-level">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activity-level">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                    <SelectItem value="extra_active">Extra Active (very hard exercise/physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 3 && (
            <Button onClick={handleNext} disabled={
              (step === 1 && (!gender || !age)) ||
              (step === 2 && (!height || !weight))
            }>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button onClick={handleSubmit} disabled={!activityLevel}>
              Finish Onboarding
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
