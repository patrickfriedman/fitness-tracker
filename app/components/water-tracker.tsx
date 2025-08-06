"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { WaterLog } from "@/types/fitness"
import { toast } from "@/components/ui/use-toast"
import { Droplet, Plus, Minus, Loader2 } from 'lucide-react'
import { format } from "date-fns"

const WATER_GOAL_ML = 2000 // 2 Liters

export function WaterTracker() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [currentWater, setCurrentWater] = useState(0)
  const [waterLogId, setWaterLogId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const fetchWaterLog = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching water log:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to load water intake.',
          variant: 'destructive',
        })
      } else if (data) {
        setCurrentWater(data.amount_ml)
        setWaterLogId(data.id)
      } else {
        setCurrentWater(0)
        setWaterLogId(null)
      }
      setIsLoading(false)
    }

    fetchWaterLog()
  }, [user?.id, supabase, today])

  const updateWaterLog = async (newAmount: number) => {
    if (!user?.id) return

    setIsUpdating(true)
    let error = null
    let data = null

    if (waterLogId) {
      // Update existing log
      const { data: updateData, error: updateError } = await supabase
        .from('water_logs')
        .update({ amount_ml: newAmount })
        .eq('id', waterLogId)
        .select()
        .single()
      data = updateData
      error = updateError
    } else {
      // Insert new log
      const { data: insertData, error: insertError } = await supabase
        .from('water_logs')
        .insert({ user_id: user.id, date: today, amount_ml: newAmount })
        .select()
        .single()
      data = insertData
      error = insertError
    }

    if (error) {
      console.error('Error updating water log:', error.message)
      toast({
        title: 'Error',
        description: 'Failed to update water intake.',
        variant: 'destructive',
      })
    } else if (data) {
      setCurrentWater(data.amount_ml)
      setWaterLogId(data.id)
      toast({
        title: 'Water Updated',
        description: `You've logged ${data.amount_ml}ml of water today.`,
      })
    }
    setIsUpdating(false)
  }

  const handleAddWater = (amount: number) => {
    const newAmount = Math.max(0, currentWater + amount)
    updateWaterLog(newAmount)
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentWater / 1000} / {WATER_GOAL_ML / 1000} L
        </div>
        <p className="text-xs text-muted-foreground">Goal: {WATER_GOAL_ML / 1000} Liters</p>
        <Progress value={progress} className="w-full mt-4" />
        <div className="flex justify-between mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => handleAddWater(-250)}
            disabled={isUpdating || currentWater === 0}
          >
            <Minus className="h-4 w-4 mr-2" /> 250ml
          </Button>
          <Button
            onClick={() => handleAddWater(250)}
            disabled={isUpdating}
          >
            <Plus className="h-4 w-4 mr-2" /> 250ml
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
