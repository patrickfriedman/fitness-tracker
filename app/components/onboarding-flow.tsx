'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateUserProfile } from '@/app/actions/user-actions' // Assuming this action exists
import { useRouter } from 'next/navigation'

interface OnboardingFlowProps {
  userId: string;
  initialData?: {
    username?: string;
    gender?: string;
    age?: number;
    height_cm?: number;
    weight_kg?: number;
    fitness_goal?: string;
    activity_level?: string;
  };
}

export default function OnboardingFlow({ userId, initialData }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    gender: initialData?.gender || '',
    age: initialData?.age || '',
    height_cm: initialData?.height_cm || '',
    weight_kg: initialData?.weight_kg || '',
    fitness_goal: initialData?.fitness_goal || '',
    activity_level: initialData?.activity_level || '',
  });
  const { toast } = useToast();
  const router = useRouter();

  const totalSteps = 5;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Basic validation for current step before proceeding
    if (step === 1 && !formData.username) {
      toast({ title: 'Error', description: 'Please enter your username.', variant: 'destructive' });
      return;
    }
    if (step === 2 && (!formData.gender || !formData.age)) {
      toast({ title: 'Error', description: 'Please select gender and enter age.', variant: 'destructive' });
      return;
    }
    if (step === 3 && (!formData.height_cm || !formData.weight_kg)) {
      toast({ title: 'Error', description: 'Please enter your height and weight.', variant: 'destructive' });
      return;
    }
    if (step === 4 && !formData.fitness_goal) {
      toast({ title: 'Error', description: 'Please select your fitness goal.', variant: 'destructive' });
      return;
    }

    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      const dataToUpdate = {
        username: formData.username,
        gender: formData.gender,
        age: formData.age ? parseInt(formData.age as string) : undefined,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm as string) : undefined,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg as string) : undefined,
        fitness_goal: formData.fitness_goal,
        activity_level: formData.activity_level,
      };
      const result = await updateUserProfile(userId, dataToUpdate);
      if (result.success) {
        toast({ title: 'Success', description: 'Onboarding complete! Welcome to your dashboard.' });
        router.push('/'); // Redirect to dashboard
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome to Fitness Tracker!</CardTitle>
          <CardDescription>Let's get you set up with a few quick questions.</CardDescription>
          <Progress value={progress} className="w-full mt-4" />
          <p className="text-sm text-muted-foreground">{`Step ${step} of ${totalSteps}`}</p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tell us about yourself</h3>
              <div className="space-y-2">
                <Label htmlFor="username">What's your username?</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g., FitFanatic23"
                  required
                />
              </div>
              <Button onClick={handleNext} className="w-full">
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
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
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
                <Button onClick={handleNext} className="w-full">
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Physical Attributes</h3>
              <div className="space-y-2">
                <Label htmlFor="height_cm">Height (cm)</Label>
                <Input
                  id="height_cm"
                  name="height_cm"
                  type="number"
                  value={formData.height_cm}
                  onChange={handleChange}
                  placeholder="e.g., 175"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight_kg">Current Weight (kg)</Label>
                <Input
                  id="weight_kg"
                  name="weight_kg"
                  type="number"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  placeholder="e.g., 70"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
                <Button onClick={handleNext} className="w-full">
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Fitness Journey</h3>
              <div className="space-y-2">
                <Label htmlFor="fitness_goal">What's your primary fitness goal?</Label>
                <Select name="fitness_goal" value={formData.fitness_goal} onValueChange={(value) => handleSelectChange('fitness_goal', value)}>
                  <SelectTrigger id="fitness_goal">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                    <SelectItem value="stay_active">Stay Active</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity_level">How active are you currently?</Label>
                <Select name="activity_level" value={formData.activity_level} onValueChange={(value) => handleSelectChange('activity_level', value)}>
                  <SelectTrigger id="activity_level">
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
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
                <Button onClick={handleNext} className="w-full">
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review and Complete</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Username:</strong> {formData.username}</p>
                <p><strong>Gender:</strong> {formData.gender}</p>
                <p><strong>Age:</strong> {formData.age}</p>
                <p><strong>Height:</strong> {formData.height_cm} cm</p>
                <p><strong>Weight:</strong> {formData.weight_kg} kg</p>
                <p><strong>Fitness Goal:</strong> {formData.fitness_goal}</p>
                <p><strong>Activity Level:</strong> {formData.activity_level}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="w-full">
                  Complete Onboarding
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
