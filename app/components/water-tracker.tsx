'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, Plus, Minus } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'

type WaterLog = Database['public']['Tables']['water_logs']['Row']

export default function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0)
  const [targetIntake, setTargetIntake] = useState(2000) // Default target in ml
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchWaterLog = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching water log:', error)
      } else if (data) {
        setWaterIntake(data.amount_ml || 0)
        setTargetIntake(data.target_ml || 2000)
      }
    }

    fetchWaterLog()
  }, [supabase])

  const updateWaterIntake = async (amount: number) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please log in to track water.',
        variant: 'destructive',
      })
      return
    }

    const newIntake = Math.max(0, waterIntake + amount)
    setWaterIntake(newIntake)

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    const { error } = await supabase
      .from('water_logs')
      .upsert(
        {
          user_id: user.id,
          log_date: today,
          amount_ml: newIntake,
          target_ml: targetIntake,
        },
        { onConflict: 'user_id,log_date' } // Update if user_id and date already exist
      )

    if (error) {
      console.error('Error updating water log:', error)
      toast({
        title: 'Error',
        description: 'Failed to update water intake.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Water Intake Updated',
        description: `You've consumed ${newIntake}ml of water today!`,
      })
    }
  }

  const progress = (waterIntake / targetIntake) * 100

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{waterIntake} ml</div>
        <p className="text-xs text-muted-foreground">Target: {targetIntake} ml</p>
        <div className="relative h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700 mt-2">
          <div
            className="absolute h-full rounded-full bg-blue-500"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="outline" size="icon" onClick={() => updateWaterIntake(-250)}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button onClick={() => updateWaterIntake(250)}>
            <Plus className="mr-2 h-4 w-4" /> Add 250ml
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
