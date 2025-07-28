"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Scale, Target, TrendingUp, TrendingDown, Edit, Save, X } from "lucide-react"
import type { BodyMetrics } from "../../types/fitness"

interface BodyMetricsWidgetProps {
  userId: string
  currentMetrics: BodyMetrics | null
  onUpdate: (metrics: BodyMetrics) => void
}

export function BodyMetricsWidget({ userId, currentMetrics, onUpdate }: BodyMetricsWidgetProps) {
  const [isLogging, setIsLogging] = useState(false)
  const [isEditingGoals, setIsEditingGoals] = useState(false)
  const [newMetrics, setNewMetrics] = useState({
    weight: currentMetrics?.weight || 0,
    bodyFatPercentage: currentMetrics?.bodyFatPercentage || 0,
  })
  const [goalMetrics, setGoalMetrics] = useState({
    goalWeight: currentMetrics?.goalWeight || 0,
    goalBodyFat: currentMetrics?.goalBodyFat || 0,
  })

  const handleLogMetrics = () => {
    const updatedMetrics: BodyMetrics = {
      userId,
      date: new Date().toISOString().split("T")[0],
      weight: newMetrics.weight,
      bodyFatPercentage: newMetrics.bodyFatPercentage,
      goalWeight: currentMetrics?.goalWeight || goalMetrics.goalWeight,
      goalBodyFat: currentMetrics?.goalBodyFat || goalMetrics.goalBodyFat,
    }
    onUpdate(updatedMetrics)
    setIsLogging(false)
  }

  const handleUpdateGoals = () => {
    const updatedMetrics: BodyMetrics = {
      userId,
      date: new Date().toISOString().split("T")[0],
      weight: currentMetrics?.weight || newMetrics.weight,
      bodyFatPercentage: currentMetrics?.bodyFatPercentage || newMetrics.bodyFatPercentage,
      goalWeight: goalMetrics.goalWeight,
      goalBodyFat: goalMetrics.goalBodyFat,
    }
    onUpdate(updatedMetrics)
    setIsEditingGoals(false)
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

  const weightTrend =
    currentMetrics?.goalWeight && currentMetrics?.weight
      ? currentMetrics.weight > currentMetrics.goalWeight
        ? "above"
        : "below"
      : "on-track"

  const bodyFatTrend =
    currentMetrics?.goalBodyFat && currentMetrics?.bodyFatPercentage
      ? currentMetrics.bodyFatPercentage > currentMetrics.goalBodyFat
        ? "above"
        : "below"
      : "on-track"

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-blue-700 dark:text-blue-400">
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5" />
            <span>Body Metrics</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingGoals(!isEditingGoals)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            >
              <Target className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLogging(!isLogging)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goal Editing */}
        {isEditingGoals && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3">
            <h4 className="font-medium text-sm">Edit Goals</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="goal-weight" className="text-xs">
                  Goal Weight (lb)
                </Label>
                <Input
                  id="goal-weight"
                  type="number"
                  step="0.1"
                  value={goalMetrics.goalWeight || ""}
                  onChange={(e) =>
                    setGoalMetrics((prev) => ({ ...prev, goalWeight: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="goal-bodyfat" className="text-xs">
                  Goal Body Fat (%)
                </Label>
                <Input
                  id="goal-bodyfat"
                  type="number"
                  step="0.1"
                  value={goalMetrics.goalBodyFat || ""}
                  onChange={(e) =>
                    setGoalMetrics((prev) => ({ ...prev, goalBodyFat: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateGoals} size="sm" className="flex-1">
                <Save className="h-3 w-3 mr-1" />
                Save Goals
              </Button>
              <Button onClick={() => setIsEditingGoals(false)} variant="outline" size="sm" className="flex-1">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Metrics Logging */}
        {isLogging && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3">
            <h4 className="font-medium text-sm">Log Today's Metrics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="current-weight" className="text-xs">
                  Weight (lb)
                </Label>
                <Input
                  id="current-weight"
                  type="number"
                  step="0.1"
                  value={newMetrics.weight || ""}
                  onChange={(e) =>
                    setNewMetrics((prev) => ({ ...prev, weight: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="current-bodyfat" className="text-xs">
                  Body Fat (%)
                </Label>
                <Input
                  id="current-bodyfat"
                  type="number"
                  step="0.1"
                  value={newMetrics.bodyFatPercentage || ""}
                  onChange={(e) =>
                    setNewMetrics((prev) => ({ ...prev, bodyFatPercentage: Number.parseFloat(e.target.value) || 0 }))
                  }
                  className="h-8"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleLogMetrics} size="sm" className="flex-1">
                <Save className="h-3 w-3 mr-1" />
                Log Metrics
              </Button>
              <Button onClick={() => setIsLogging(false)} variant="outline" size="sm" className="flex-1">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Current Metrics Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {currentMetrics?.weight?.toFixed(1) || "--"}
              </p>
              {weightTrend === "above" && <TrendingUp className="h-4 w-4 text-red-500" />}
              {weightTrend === "below" && <TrendingDown className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">lbs current</p>
            {currentMetrics?.goalWeight && (
              <>
                <p className="text-xs text-gray-600 mt-1">Goal: {currentMetrics.goalWeight} lbs</p>
                <Progress value={weightProgress} className="h-1 mt-1" />
              </>
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {currentMetrics?.bodyFatPercentage?.toFixed(1) || "--"}
              </p>
              {bodyFatTrend === "above" && <TrendingUp className="h-4 w-4 text-red-500" />}
              {bodyFatTrend === "below" && <TrendingDown className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">% body fat</p>
            {currentMetrics?.goalBodyFat && (
              <>
                <p className="text-xs text-gray-600 mt-1">Goal: {currentMetrics.goalBodyFat}%</p>
                <Progress value={bodyFatProgress} className="h-1 mt-1" />
              </>
            )}
          </div>
        </div>

        {/* Progress Indicators */}
        {currentMetrics?.goalWeight && currentMetrics?.weight && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Weight Progress</span>
              <Badge variant={weightTrend === "above" ? "destructive" : "default"} className="text-xs">
                {weightTrend === "above"
                  ? `${(currentMetrics.weight - currentMetrics.goalWeight).toFixed(1)} lbs over`
                  : weightTrend === "below"
                    ? `${(currentMetrics.goalWeight - currentMetrics.weight).toFixed(1)} lbs to go`
                    : "On track"}
              </Badge>
            </div>
          </div>
        )}

        {currentMetrics?.goalBodyFat && currentMetrics?.bodyFatPercentage && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Body Fat Progress</span>
              <Badge variant={bodyFatTrend === "above" ? "destructive" : "default"} className="text-xs">
                {bodyFatTrend === "above"
                  ? `${(currentMetrics.bodyFatPercentage - currentMetrics.goalBodyFat).toFixed(1)}% over`
                  : bodyFatTrend === "below"
                    ? `${(currentMetrics.goalBodyFat - currentMetrics.bodyFatPercentage).toFixed(1)}% to go`
                    : "On track"}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
