"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { WaterLog } from '@/types/fitness'
import { addWaterLog } from '@/app/actions/water-actions'
import { useToast } from '@/hooks/use-toast'
import { PlusIcon, MinusIcon } from 'lucide-react'

const WATER_INCREMENT_ML = 250 // Amount of water to add/subtract per button click

export default function WaterTracker({ initialWaterLogs }: { initialWaterLogs: WaterLog[] }) {
  const [currentWaterAmount, setCurrentWaterAmount] = useState(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = initialWaterLogs.find(log => log.log_date === today)
    return todayLog ? todayLog.amount_ml : 0
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const waterGoal = 2000 // Example goal: 2000ml

  const handleAddWater = async (amount: number) => {
    setLoading(true)
    const newAmount = currentWaterAmount + amount
    setCurrentWaterAmount(newAmount)

    const { success, message } = await addWaterLog(newAmount)

    if (success) {
      toast({
        title: 'Success',
        description: message,
      })
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      setCurrentWaterAmount(currentWaterAmount - amount) // Revert on error
    }
    setLoading(false)
  }

  const handleSubtractWater = async (amount: number) => {
    setLoading(true)
    const newAmount = Math.max(0, currentWaterAmount - amount)
    setCurrentWaterAmount(newAmount)

    const { success, message } = await addWaterLog(newAmount)

    if (success) {
      toast({
        title: 'Success',
        description: message,
      })
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
      setCurrentWaterAmount(currentWaterAmount + amount) // Revert on error
    }
    setLoading(false)
  }

  const progressPercentage = (currentWaterAmount / waterGoal) * 100

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Water Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl font-bold">
            {currentWaterAmount} <span className="text-lg text-muted-foreground">ml</span>
          </div>
          <div className="text-sm text-muted-foreground">Goal: {waterGoal} ml</div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubtractWater(WATER_INCREMENT_ML)}
            disabled={loading || currentWaterAmount === 0}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleAddWater(WATER_INCREMENT_ML)}
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4" /> Add {WATER_INCREMENT_ML}ml
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
