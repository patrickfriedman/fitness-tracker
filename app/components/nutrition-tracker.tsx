'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Utensils, Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { NutritionLog } from '@/types/fitness'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

const DAILY_CALORIE_GOAL = 2000; // Example daily calorie goal

export default function NutritionTracker() {
  const { user, isDemo } = useAuth()
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog[] | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchNutritionLogs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    if (isDemo) {
      // Simulate demo data
      setTodayNutrition([
        {
          id: 'demo-nut-1',
          user_id: user.id,
          date: today,
          meal_type: 'breakfast',
          food_items: [{ name: 'Oatmeal', quantity: 1, unit: 'serving', calories: 150, protein: 5, carbs: 25, fat: 3 }],
          total_calories: 150, total_protein: 5, total_carbs: 25, total_fat: 3,
          created_at: new Date().toISOString(),
        },
        {
          id: 'demo-nut-2',
          user_id: user.id,
          date: today,
          meal_type: 'lunch',
          food_items: [{ name: 'Chicken Salad', quantity: 1, unit: 'serving', calories: 350, protein: 30, carbs: 15, fat: 20 }],
          total_calories: 350, total_protein: 30, total_carbs: 15, total_fat: 20,
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today);

    if (error) {
      console.error('Error fetching nutrition logs:', error.message);
    } else {
      setTodayNutrition(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNutritionLogs();
  }, [user, isDemo, today]);

  const totalCaloriesToday = todayNutrition?.reduce((sum, log) => sum + (log.total_calories || 0), 0) || 0;
  const progressPercentage = (totalCaloriesToday / DAILY_CALORIE_GOAL) * 100;

  const handleLogMeal = () => {
    // Placeholder for opening a meal logging form/modal
    alert('Logging a new meal! (Feature coming soon)');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Nutrition</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-2 w-full mt-4" />
          <Skeleton className="h-10 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Nutrition</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalCaloriesToday} kcal
        </div>
        <p className="text-xs text-muted-foreground">
          {Math.round(progressPercentage)}% of daily goal ({DAILY_CALORIE_GOAL} kcal)
        </p>
        <Progress value={progressPercentage} className="mt-4 h-2" />
        <div className="mt-4 text-sm">
          <p className="font-medium">Meals Logged:</p>
          <ul className="list-disc pl-5">
            {todayNutrition && todayNutrition.length > 0 ? (
              todayNutrition.map((log, index) => (
                <li key={index}>
                  {log.meal_type.charAt(0).toUpperCase() + log.meal_type.slice(1)}: {log.total_calories} kcal
                </li>
              ))
            ) : (
              <li>No meals logged today.</li>
            )}
          </ul>
        </div>
        <Button className="w-full mt-4" onClick={handleLogMeal}>
          <Plus className="mr-2 h-4 w-4" />
          Log New Meal
        </Button>
      </CardContent>
    </Card>
  );
}
