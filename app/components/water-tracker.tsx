'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/auth-context'
import { WaterLog } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Plus, Minus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

const WATER_GOAL_ML = 2000 // Example daily water goal in ml (2 liters)
const INCREMENT_ML = 250 // Amount to add/subtract per button click

export default function WaterTracker() {
  const { user } = useAuth()
  const [currentWater, setCurrentWater] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = getBrowserClient()

  const fetchWaterLog = async () => {
    if (!user?.id) return
    setLoading(true)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const { data, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching water log:', error)
      toast({
        title: 'Error',
        description: 'Failed to load water intake.',
        variant: 'destructive',
      })
    } else if (data) {
      setCurrentWater(data.amount_ml)
    } else {
      setCurrentWater(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWaterLog()
  }, [user])

  const updateWaterLog = async (newAmount: number) => {
    if (!user?.id) return
    setIsUpdating(true)
    const today = new Date().toISOString().split('T')[0]

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
        title: 'Water Updated',
        description: `Water intake set to ${newAmount / 1000} L.`,
      })
    }
    setIsUpdating(false)
  }

  const handleAddWater = () => {
    const newAmount = currentWater + INCREMENT_ML
    updateWaterLog(newAmount)
  }

  const handleSubtractWater = () => {
    const newAmount = Math.max(0, currentWater - INCREMENT_ML)
    updateWaterLog(newAmount)
  }

  const progressPercentage = (currentWater / WATER_GOAL_ML) * 100

  return (
    <Card className="widget-card">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Water Intake</CardTitle>
      </CardHeader>
      <CardContent className="widget-content space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="text-center text-2xl font-bold">
              {(currentWater / 1000).toFixed(1)} L / {(WATER_GOAL_ML / 1000).toFixed(1)} L
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-center gap-2">
              <Button onClick={handleSubtractWater} disabled={isUpdating || currentWater === 0} variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <Button onClick={handleAddWater} disabled={isUpdating} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
