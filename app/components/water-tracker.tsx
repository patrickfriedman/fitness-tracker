"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Minus, Settings, Check, X } from "lucide-react"

interface WaterTrackerProps {
  userId: string
  currentIntake?: number
  goal?: number
  onUpdate?: (newIntake: number) => void
}

export function WaterTrackerWidget({ userId, currentIntake = 0, goal = 64, onUpdate }: WaterTrackerProps) {
  const [intake, setIntake] = useState(currentIntake)
  const [currentGoal, setCurrentGoal] = useState(goal)
  const [isEditing, setIsEditing] = useState(false)
  const [customAmount, setCustomAmount] = useState("")
  const [tempGoal, setTempGoal] = useState(goal.toString())

  const handleIncrement = (amount = 8) => {
    const newIntake = intake + amount
    setIntake(newIntake)
    onUpdate?.(newIntake)
  }

  const handleDecrement = (amount = 8) => {
    const newIntake = Math.max(0, intake - amount)
    setIntake(newIntake)
    onUpdate?.(newIntake)
  }

  const handleCustomAdd = () => {
    const amount = Number.parseFloat(customAmount)
    if (amount > 0) {
      handleIncrement(amount)
      setCustomAmount("")
    }
  }

  const handleGoalSave = () => {
    const newGoal = Number.parseFloat(tempGoal)
    if (newGoal > 0) {
      setCurrentGoal(newGoal)
      setIsEditing(false)
    }
  }

  const progress = (intake / currentGoal) * 100

  const quickAmounts = [4, 8, 12, 16, 20]

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-400">
            <Droplets className="h-5 w-5" />
            <span>Water Intake</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0 text-cyan-600 hover:text-cyan-700"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">{intake}</p>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-sm text-cyan-600 dark:text-cyan-500">oz of</p>
            {isEditing ? (
              <div className="flex items-center space-x-1">
                <Input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  className="w-16 h-6 text-xs text-center"
                />
                <Button variant="ghost" size="sm" onClick={handleGoalSave} className="h-6 w-6 p-0">
                  <Check className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-cyan-600 dark:text-cyan-500">{currentGoal} oz goal</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={Math.min(100, progress)} className="h-3" />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>0 oz</span>
            <span>{currentGoal} oz</span>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-5 gap-1">
          {quickAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleIncrement(amount)}
              className="h-8 text-xs bg-transparent"
            >
              +{amount}
            </Button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Custom oz"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 h-8 text-sm"
          />
          <Button onClick={handleCustomAdd} size="sm" className="h-8 px-3">
            Add
          </Button>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDecrement()}
            disabled={intake === 0}
            className="h-10 w-10 p-0 bg-transparent"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <p className="text-sm font-medium">8 oz</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">default</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleIncrement()}
            className="h-10 w-10 p-0 bg-transparent"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {progress >= 100 && (
          <div className="text-center p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
            <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">🎉 Goal achieved!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
