'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Droplet, Plus, Minus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'
import { getBrowserClient } from '@/lib/supabase'
import { WaterLog } from '@/types/fitness'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

const WATER_GOAL_ML = 2000 // Example goal: 2 liters

export default function WaterTracker() {
  const { user, isDemo } = useAuth()
  const [currentWater, setCurrentWater] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = getBrowserClient()
  const today = format(new Date(), 'yyyy-MM-dd')

  const fetchWaterLog = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    if (isDemo) {
      setCurrentWater(1500); // Simulate demo data
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching water log:', error.message);
    } else if (data) {
      setCurrentWater(data.amount_ml);
    } else {
      setCurrentWater(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWaterLog();
  }, [user, isDemo, today]);

  const updateWaterLog = async (newAmount: number) => {
    if (!user) return;

    setIsUpdating(true);
    if (isDemo) {
      setCurrentWater(newAmount);
      setIsUpdating(false);
      return;
    }

    const { error } = await supabase
      .from('water_logs')
      .upsert(
        { user_id: user.id, date: today, amount_ml: newAmount },
        { onConflict: 'user_id,date' }
      );

    if (error) {
      console.error('Error updating water log:', error.message);
    } else {
      setCurrentWater(newAmount);
    }
    setIsUpdating(false);
  };

  const handleAddWater = (amount: number) => {
    const newAmount = currentWater + amount;
    updateWaterLog(newAmount);
  };

  const handleRemoveWater = (amount: number) => {
    const newAmount = Math.max(0, currentWater - amount);
    updateWaterLog(newAmount);
  };

  const progressPercentage = (currentWater / WATER_GOAL_ML) * 100;

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
          <Droplet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-2 w-full mt-4" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentWater} ml / {WATER_GOAL_ML} ml
        </div>
        <p className="text-xs text-muted-foreground">
          {Math.round(progressPercentage)}% of daily goal
        </p>
        <Progress value={progressPercentage} className="mt-4 h-2" />
        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleRemoveWater(250)}
            disabled={isUpdating || currentWater === 0}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => handleAddWater(250)}
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
