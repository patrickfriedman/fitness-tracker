"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Droplet, Plus, Minus } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { WaterLog } from "@/types/fitness"
import { format } from "date-fns"

const WATER_GOAL_ML = 3000 // Example goal: 3 liters

export function WaterTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentAmount, setCurrentAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [waterLogId, setWaterLogId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchWaterLog()
    }
  }, [user?.id])

  const fetchWaterLog = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error
      }

      if (data) {
        setCurrentAmount(data.amount_ml)
        setWaterLogId(data.id)
      } else {
        setCurrentAmount(0)
        setWaterLogId(null)
      }
    } catch (error: any) {
      console.error("Error fetching water log:", error.message)
      toast({
        title: "Error",
        description: "Failed to load water intake.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateWaterLog = async (newAmount: number) => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const logData = {
        user_id: user.id,
        date: today,
        amount_ml: newAmount,
      }

      let error = null
      if (waterLogId) {
        const { error: updateError } = await supabase
          .from('water_logs')
          .update(logData)
          .eq('id', waterLogId)
        error = updateError
      } else {
        const { data, error: insertError } = await supabase
          .from('water_logs')
          .insert(logData)
          .select()
          .single()
        error = insertError
        if (data) setWaterLogId(data.id)
      }

      if (error) throw error

      setCurrentAmount(newAmount)
      toast({
        title: "Success",
        description: "Water intake updated.",
      })
    } catch (error: any) {
      console.error("Error updating water log:", error.message)
      toast({
        title: "Error",
        description: "Failed to update water intake.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddWater = (amount: number) => {
    const newAmount = Math.min(WATER_GOAL_ML, currentAmount + amount)
    updateWaterLog(newAmount)
  }

  const handleRemoveWater = (amount: number) => {
    const newAmount = Math.max(0, currentAmount - amount)
    updateWaterLog(newAmount)
  }

  const progressPercentage = (currentAmount / WATER_GOAL_ML) * 100

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              {currentAmount / 1000} / {WATER_GOAL_ML / 1000} L
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-center gap-2">
              <Button onClick={() => handleRemoveWater(250)} variant="outline" size="icon" disabled={loading}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleAddWater(250)} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" /> Add 250ml
              </Button>
              <Button onClick={() => handleAddWater(500)} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" /> Add 500ml
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
