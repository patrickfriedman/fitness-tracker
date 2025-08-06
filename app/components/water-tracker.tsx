"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Minus } from 'lucide-react'

export function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(32) // oz
  const dailyGoal = 64 // oz
  const progress = Math.min((waterIntake / dailyGoal) * 100, 100)

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.max(0, prev + amount))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Droplets className="mr-2 h-4 w-4 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {waterIntake} oz
          </p>
          <p className="text-xs text-gray-500">
            of {dailyGoal} oz goal
          </p>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(-8)}
            disabled={waterIntake === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(8)}
          >
            <Plus className="h-4 w-4" />
            8oz
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addWater(16)}
          >
            <Plus className="h-4 w-4" />
            16oz
          </Button>
        </div>
        
        {progress >= 100 && (
          <p className="text-center text-sm text-green-600 font-medium">
            🎉 Daily goal achieved!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
