'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function OnboardingFlow() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [gender, setGender] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [height, setHeight] = useState<number | ''>('') // in cm
  const [weight, setWeight] = useState<number | ''>('') // in kg
  const [activityLevel, setActivityLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [onboardedStatus, setOnboardedStatus] = useState<boolean | null>(null);

  const totalSteps = 5

  useEffect(() => {
    const fetchOnboardingStatus = async () => {
      if (!user) {
        setOnboardedStatus(null);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching onboarding status:', error);
        setOnboardedStatus(false); // Assume not onboarded if error
      } else if (data) {
        setOnboardedStatus(data.onboarded);
      } else {
        setOnboardedStatus(false); // No profile found, so not onboarded
      }
      setLoading(false);
    };

    if (!isAuthLoading) {
      fetchOnboardingStatus();
    }
  }, [user, isAuthLoading, supabase]);

  // Don't render if still loading auth or onboarding status, or if already onboarded
  if (isAuthLoading || loading || onboardedStatus === null || onboardedStatus === true) {
    return null
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not logged in.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        gender,
        age,
        height_cm: height,
        weight_kg: weight,
        activity_level: activityLevel,
        fitness_goal: goal,
        onboarded: true, // Mark user as onboarded
      },
      { onConflict: 'id' }
    )

    if (error) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Onboarding Complete',
        description: 'Your fitness profile has been set up successfully!',
      })
      // Redirect or close onboarding modal
      window.location.href = '/' // Redirect to dashboard
    }
    setLoading(false)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardTitle>Step 1: Basic Information</CardTitle>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || '')}
                  placeholder="e.g., 30"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNext} disabled={!gender || !age}>Next</Button>
            </CardFooter>
          </>
        )
      case 2:
        return (
          <>
            <CardTitle>Step 2: Body Measurements</CardTitle>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || '')}
                  placeholder="e.g., 175"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || '')}
                  placeholder="e.g., 70"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!height || !weight}>Next</Button>
            </CardFooter>
          </>
        )
      case 3:
        return (
          <>
            <CardTitle>Step 3: Activity Level</CardTitle>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="activityLevel">How active are you?</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!activityLevel}>Next</Button>
            </CardFooter>
          </>
        )
      case 4:
        return (
          <>
            <CardTitle>Step 4: Fitness Goal</CardTitle>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="goal">What is your primary fitness goal?</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                    <SelectItem value="maintain_fitness">Maintain Fitness</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} disabled={!goal}>Next</Button>
            </CardFooter>
          </>
        )
      case 5:
        return (
          <>
            <CardTitle>Step 5: Review & Submit</CardTitle>
            <CardContent className="space-y-4">
              <p>Please review your information:</p>
              <ul className="list-disc pl-5">
                <li>Gender: {gender || 'N/A'}</li>
                <li>Age: {age || 'N/A'}</li>
                <li>Height: {height ? `${height} cm` : 'N/A'}</li>
                <li>Weight: {weight ? `${weight} kg` : 'N/A'}</li>
                <li>Activity Level: {activityLevel.replace(/_/g, ' ') || 'N/A'}</li>
                <li>Fitness Goal: {goal.replace(/_/g, ' ') || 'N/A'}</li>
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit
              </Button>
            </CardFooter>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Progress value={(step / totalSteps) * 100} className="mb-4" />
        </CardHeader>
        {renderStep()}
      </Card>
    </div>
  )
}
