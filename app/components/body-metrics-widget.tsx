"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Scale, Target, TrendingUp, Edit, Check, X } from "lucide-react"
import type { BodyMetrics } from "../../types/fitness"

interface BodyMetricsWidgetProps {
  userId: string
  currentMetrics?: BodyMetrics | null
  onUpdate?: (metrics: BodyMetrics) => void
}

export function BodyMetricsWidget({ userId, currentMetrics, onUpdate }: BodyMetricsWidgetProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingGoals, setEditingGoals] = useState(false)
  const [tempWeight, setTempWeight] = useState(currentMetrics?.weight?.toString() || "")
  const [tempBodyFat, setTempBodyFat] = useState(currentMetrics?.bodyFatPercentage?.toString() || "")
  const [tempGoalWeight, setTempGoalWeight] = useState(currentMetrics?.goalWeight?.toString() || "")
  const [tempGoalBodyFat, setTempGoalBodyFat] = useState(currentMetrics?.goalBodyFat?.toString() || "")

  const handleSave = () => {
    const updatedMetrics: BodyMetrics = {
      userId,
      date: new Date().toISOString().split("T")[0],
      weight: Number.parseFloat(tempWeight) || 0,
      bodyFatPercentage: Number.parseFloat(tempBodyFat) || 0,
      goalWeight: currentMetrics?.goalWeight || 0,
      goalBodyFat: currentMetrics?.goalBodyFat || 0,
    }

    onUpdate?.(updatedMetrics)
    setIsEditing(false)
  }

  const handleGoalSave = () => {
    const updatedMetrics: BodyMetrics = {
      userId,
      date: new Date().toISOString().split("T")[0],
      weight: currentMetrics?.weight || 0,
      bodyFatPercentage: currentMetrics?.bodyFatPercentage || 0,
      goalWeight: Number.parseFloat(tempGoalWeight) || 0,
      goalBodyFat: Number.parseFloat(tempGoalBodyFat) || 0,
    }

    onUpdate?.(updatedMetrics)
    setEditingGoals(false)
  }

  const weightProgress =
    currentMetrics?.goalWeight && currentMetrics?.weight
      ? Math.max(
          0,
          100 - Math.abs(((currentMetrics.weight - currentMetrics.goalWeight) / currentMetrics.goalWeight) * 100),
        )
      : 0

  const bodyFatProgress =
    currentMetrics?.goalBodyFat && currentMetrics?.bodyFatPercentage
      ? Math.max(
          0,
          100 -
            Math.abs(
              ((currentMetrics.bodyFatPercentage - currentMetrics.goalBodyFat) / currentMetrics.goalBodyFat) * 100,
            ),
        )
      : 0

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
            <Scale className="h-5 w-5" />
            <span>Body Metrics</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingGoals(!editingGoals)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            >
              <Target className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="weight" className="text-xs">
                  Weight (lbs)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={tempWeight}
                  onChange={(e) => setTempWeight(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="bodyFat" className="text-xs">
                  Body Fat (%)
                </Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={tempBodyFat}
                  onChange={(e) => setTempBodyFat(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex-1">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : editingGoals ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="goalWeight" className="text-xs">
                  Goal Weight (lbs)
                </Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={tempGoalWeight}
                  onChange={(e) => setTempGoalWeight(e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="goalBodyFat" className="text-xs">
                  Goal Body Fat (%)
                </Label>
                <Input
                  id="goalBodyFat"
                  type="number"
                  step="0.1"
                  value={tempGoalBodyFat}
                  onChange={(e) => setTempGoalBodyFat(e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleGoalSave} size="sm" className="flex-1">
                <Check className="h-3 w-3 mr-1" />
                Save Goals
              </Button>
              <Button onClick={() => setEditingGoals(false)} variant="outline" size="sm" className="flex-1">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{currentMetrics?.weight || "--"}</p>
                <p className="text-xs text-blue-600 dark:text-blue-500">Current Weight (lbs)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {currentMetrics?.bodyFatPercentage || "--"}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500">Body Fat</p>
              </div>
            </div>

            {/* Progress Bars */}
            {currentMetrics?.goalWeight && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Weight Goal Progress</span>
                  <span>{weightProgress.toFixed(0)}%</span>
                </div>
                <Progress value={weightProgress} className="h-2" />
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  Goal: {currentMetrics.goalWeight} lbs
                </p>
              </div>
            )}

            {currentMetrics?.goalBodyFat && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Body Fat Goal Progress</span>
                  <span>{bodyFatProgress.toFixed(0)}%</span>
                </div>
                <Progress value={bodyFatProgress} className="h-2" />
                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  Goal: {currentMetrics.goalBodyFat}%
                </p>
              </div>
            )}

            {/* Quick Add Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-transparent">
                <TrendingUp className="h-3 w-3 mr-1" />
                Log Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditingGoals(true)} className="bg-transparent">
                <Target className="h-3 w-3 mr-1" />
                Set Goals
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
