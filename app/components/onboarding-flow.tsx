'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/contexts/auth-context'
import { updateUserProfile } from '@/app/actions/auth-actions'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { User } from '@/types/fitness'

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, isLoading: authLoading, dispatch } = useAuth();
  const [primaryGoal, setPrimaryGoal] = useState<User['primaryGoal'] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveGoal = async () => {
    if (!user?.id || !primaryGoal) {
      toast({
        title: 'Error',
        description: 'Please select a primary goal.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await updateUserProfile(user.id, { primaryGoal });
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Goal Saved',
        description: 'Your primary fitness goal has been set!',
      });
      // Update the user context immediately
      dispatch({ type: 'SET_USER', payload: { ...user, primaryGoal } });
      onComplete();
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to save goal.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Your Fitness Journey!</CardTitle>
          <CardDescription>
            Let's get you set up. What's your primary fitness goal?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={primaryGoal}
            onValueChange={(value: User['primaryGoal']) => setPrimaryGoal(value)}
            className="grid grid-cols-1 gap-4"
          >
            <Label
              htmlFor="strength"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="strength" value="strength" className="sr-only" />
              <span className="text-lg font-semibold">Strength Training</span>
              <span className="text-sm text-muted-foreground text-center">
                Focus on increasing your lifting capacity.
              </span>
            </Label>
            <Label
              htmlFor="hypertrophy"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="hypertrophy" value="hypertrophy" className="sr-only" />
              <span className="text-lg font-semibold">Muscle Gain (Hypertrophy)</span>
              <span className="text-sm text-muted-foreground text-center">
                Build muscle mass and improve body composition.
              </span>
            </Label>
            <Label
              htmlFor="weight_loss"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="weight_loss" value="weight_loss" className="sr-only" />
              <span className="text-lg font-semibold">Weight Loss</span>
              <span className="text-sm text-muted-foreground text-center">
                Reduce body fat and achieve a healthier weight.
              </span>
            </Label>
            <Label
              htmlFor="endurance"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="endurance" value="endurance" className="sr-only" />
              <span className="text-lg font-semibold">Endurance</span>
              <span className="text-sm text-muted-foreground text-center">
                Improve cardiovascular health and stamina.
              </span>
            </Label>
            <Label
              htmlFor="general_fitness"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <RadioGroupItem id="general_fitness" value="general_fitness" className="sr-only" />
              <span className="text-lg font-semibold">General Fitness</span>
              <span className="text-sm text-muted-foreground text-center">
                Maintain overall health and well-being.
              </span>
            </Label>
          </RadioGroup>
          <Button onClick={handleSaveGoal} className="w-full" disabled={isLoading || !primaryGoal}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save Goal & Continue'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
