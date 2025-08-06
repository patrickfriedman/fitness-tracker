'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Plus, Minus, Droplet } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { WaterLog } from '@/types/fitness'

const WATER_GOAL_ML = 2000 // Example daily water goal in ml

export default function WaterTracker() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [currentWater, setCurrentWater] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    const fetchWaterLog = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching water log:', error)
        toast({
          title: 'Error',
          description: 'Failed to load water intake.',
          variant: 'destructive',
        })
      } else if (data) {
        setCurrentWater(data.amount_ml || 0)
      }
      setIsLoading(false)
    }

    fetchWaterLog()
  }, [user, supabase, today, toast])

  const updateWater = async (amount: number) => {
    if (!user?.id || user.id === 'demo-user-123') {
      toast({
        title: 'Demo Mode',
        description: 'Water intake cannot be saved in demo mode.',
      })
      return
    }

    setIsUpdating(true)
    const newAmount = Math.max(0, currentWater + amount)

    const { error } = await supabase
      .from('water_logs')
      .upsert(
        {
          user_id: user.id,
          date: today,
          amount_ml: newAmount,
        },
        { onConflict: 'user_id,date' }
      )

    if (error) {
      console.error('Error updating water log:', error)
      toast({
        title: 'Error',
        description: 'Failed to update water intake.',
        variant: 'destructive',
      })
    } else {
      setCurrentWater(newAmount)
      toast({
        title: 'Success',
        description: 'Water intake updated!',
      })
    }
    setIsUpdating(false)
  }

  const progress = (currentWater / WATER_GOAL_ML) * 100

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Water Intake</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Water Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Droplet className="h-8 w-8 text-blue-500" />
          <span className="text-4xl font-bold">
            {Math.round(currentWater / 1000)}L
          </span>
          <span className="text-xl text-muted-foreground">/ {WATER_GOAL_ML / 1000}L</span>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => updateWater(-250)}
            disabled={isUpdating || currentWater === 0}
            variant="outline"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button onClick={() => updateWater(250)} disabled={isUpdating}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
