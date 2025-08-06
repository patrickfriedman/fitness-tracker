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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Water Intake</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600">{waterIntake}</p>
          <p className="text-sm text-gray-600">oz of {dailyGoal} oz goal</p>
        </div>
        
        <Progress value={progress} className="w-full" />
        
        <div className="flex justify-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addWater(-8)}
            disabled={waterIntake === 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => addWater(8)}
          >
            <Plus className="h-4 w-4" />
            8 oz
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addWater(16)}
          >
            <Plus className="h-4 w-4" />
            16 oz
          </Button>
        </div>
        
        {progress >= 100 && (
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              🎉 Daily goal achieved!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
