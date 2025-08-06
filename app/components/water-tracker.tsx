'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { DropletIcon, PlusIcon, MinusIcon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0)
  const dailyGoal = 2000 // ml

  const addWater = (amount: number) => {
    setWaterIntake((prev) => {
      const newAmount = prev + amount
      if (newAmount >= dailyGoal) {
        toast({
          title: 'Goal Achieved!',
          description: 'You have reached your daily water intake goal!',
        })
      }
      return newAmount
    })
  }

  const removeWater = (amount: number) => {
    setWaterIntake((prev) => Math.max(0, prev - amount))
  }

  const progress = (waterIntake / dailyGoal) * 100

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <DropletIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{waterIntake} ml</div>
        <p className="text-xs text-muted-foreground">of {dailyGoal} ml goal</p>
        <Progress value={progress} className="mt-4" />
        <div className="flex justify-between mt-4 space-x-2">
          <Button variant="outline" onClick={() => removeWater(250)}>
            <MinusIcon className="h-4 w-4 mr-2" /> 250ml
          </Button>
          <Button onClick={() => addWater(250)}>
            <PlusIcon className="h-4 w-4 mr-2" /> 250ml
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
