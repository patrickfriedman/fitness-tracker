"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Minus } from 'lucide-react'

export function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0)
  const [goal] = useState(64) // 64 oz daily goal

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`water-${today}`)
    if (stored) {
      setWaterIntake(parseInt(stored))
    }
  }, [])

  const updateWater = (amount: number) => {
    const newIntake = Math.max(0, waterIntake + amount)
    setWaterIntake(newIntake)
    
    const today = new Date().toDateString()
    localStorage.setItem(`water-${today}`, newIntake.toString())
  }

  const progress = Math.min((waterIntake / goal) * 100, 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {waterIntake} oz
            </div>
            <div className="text-sm text-gray-500">
              of {goal} oz goal
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateWater(-8)}
              disabled={waterIntake === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => updateWater(8)}
            >
              <Plus className="h-4 w-4 mr-1" />
              8 oz
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateWater(16)}
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
        </div>
      </CardContent>
    </Card>
  )
}
