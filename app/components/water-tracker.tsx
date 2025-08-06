'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Droplet, Plus, Minus } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { WaterEntry } from "@/types/fitness"

const WATER_GOAL_ML = 2500 // Example daily goal in ml

export default function WaterTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentWater, setCurrentWater] = useState(0)
  const [loading, setLoading] = useState(true)

  useState(() => {
    const fetchWaterIntake = async () => {
      if (!user) return
      setLoading(true)
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const { data, error } = await supabase
        .from('water_logs')
        .select('amount_ml')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error fetching water intake:", error)
        toast({
          title: "Error",
          description: "Failed to load water intake.",
          variant: "destructive",
        })
      } else if (data) {
        setCurrentWater(data.amount_ml)
      }
      setLoading(false)
    }
    fetchWaterIntake()
  }, [user])

  const updateWaterIntake = async (newAmount: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track water intake.",
        variant: "destructive",
      })
      return
    }

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    try {
      const { error } = await supabase
        .from('water_logs')
        .upsert({ user_id: user.id, date: today, amount_ml: newAmount }, { onConflict: 'user_id,date' })

      if (error) {
        throw error
      }
      setCurrentWater(newAmount)
      toast({
        title: "Water Updated!",
        description: `You've logged ${newAmount}ml of water today.`,
      })
    } catch (error: any) {
      console.error("Error updating water intake:", error)
      toast({
        title: "Error",
        description: `Failed to update water intake: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleAddWater = (amount: number) => {
    updateWaterIntake(currentWater + amount)
  }

  const handleRemoveWater = (amount: number) => {
    updateWaterIntake(Math.max(0, currentWater - amount))
  }

  const progress = (currentWater / WATER_GOAL_ML) * 100

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-sm text-muted-foreground">Loading water intake...</div>
        ) : (
          <>
            <div className="text-2xl font-bold">{currentWater} ml</div>
            <p className="text-xs text-muted-foreground">of {WATER_GOAL_ML} ml goal</p>
            <Progress value={progress} className="mt-4" />
            <div className="flex justify-between mt-4 space-x-2">
              <Button variant="outline" onClick={() => handleRemoveWater(250)} size="sm">
                <Minus className="h-4 w-4 mr-1" /> 250ml
              </Button>
              <Button onClick={() => handleAddWater(250)} size="sm">
                <Plus className="h-4 w-4 mr-1" /> 250ml
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
