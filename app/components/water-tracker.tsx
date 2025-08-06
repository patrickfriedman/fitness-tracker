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
        <CardTitle className="text-lg flex items-center">
          <Droplets className="h-5 w-5 text-blue-500 mr-2" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {waterIntake}
          </div>
          <div className="text-sm text-gray-500">
            of {dailyGoal} oz goal
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
        
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
            <Plus className="h-4 w-4 mr-1" />
            8 oz
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => addWater(16)}
          >
            <Plus className="h-4 w-4 mr-1" />
            16 oz
          </Button>
        </div>
        
        {progress >= 100 && (
          <div className="text-center text-sm text-green-600 font-medium">
            🎉 Daily goal achieved!
          </div>
        )}
      </CardContent>
    </Card>
  )
}
