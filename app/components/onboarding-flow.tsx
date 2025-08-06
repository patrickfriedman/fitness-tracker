'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [primaryGoal, setPrimaryGoal] = useState<string>(user?.primaryGoal || 'general_fitness');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const success = await updateUser({ primaryGoal: primaryGoal as any }); // Cast to any for now
      if (success) {
        toast({
          title: "Onboarding Complete",
          description: "Your preferences have been saved!",
        });
        onComplete?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to save preferences. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to FitTracker!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            Let's set up your primary fitness goal to personalize your experience.
          </p>
          <div className="space-y-2">
            <Label htmlFor="primary-goal">What is your primary fitness goal?</Label>
            <Select value={primaryGoal} onValueChange={setPrimaryGoal} disabled={isLoading}>
              <SelectTrigger id="primary-goal">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general_fitness">General Fitness</SelectItem>
                <SelectItem value="strength">Strength Gain</SelectItem>
                <SelectItem value="hypertrophy">Muscle Building</SelectItem>
                <SelectItem value="fat_loss">Fat Loss</SelectItem>
                <SelectItem value="endurance">Endurance Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save and Continue'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
