'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { getWaterLog, logWater } from '@/app/actions/water-actions'
import { WaterLog } from '@/types/fitness'

export default function WaterTracker() {
  const [waterAmount, setWaterAmount] = useState(0)
  const [goal, setGoal] = useState(2000) // Example goal in ml
  const { toast } = useToast()

  useEffect(() => {
    const fetchWaterLog = async () => {
      const result = await getWaterLog()
      if (result.success && result.data) {
        setWaterAmount(result.data.amount_ml)
        setGoal(result.data.goal_ml || 2000) // Use logged goal or default
      }
    }
    fetchWaterLog()
  }, [])

  const handleLogWater = async (amount: number) => {
    const newAmount = waterAmount + amount
    const result = await logWater(newAmount, goal)

    if (result.success) {
      setWaterAmount(newAmount)
      toast({
        title: 'Success!',
        description: `Logged ${amount}ml of water.`,
      })
    } else {
      toast({
        title: 'Error!',
        description: result.error || 'Failed to log water.',
        variant: 'destructive',
      })
    }
  }

  const progress = (waterAmount / goal) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Today's Intake</p>
          <p className="text-4xl font-bold">{waterAmount} ml</p>
          <p className="text-sm text-gray-500">Goal: {goal} ml</p>
        </div>
        <Progress value={progress} className="w-full" />
        <div className="flex justify-center gap-2">
          <Button onClick={() => handleLogWater(250)} variant="outline">
            +250ml
          </Button>
          <Button onClick={() => handleLogWater(500)} variant="outline">
            +500ml
          </Button>
          <Button onClick={() => handleLogWater(1000)} variant="outline">
            +1000ml
          </Button>
        </div>
        <Button onClick={() => handleLogWater(-waterAmount)} variant="destructive" className="w-full">
          Reset Daily Intake
        </Button>
      </CardContent>
    </Card>
  )
}
