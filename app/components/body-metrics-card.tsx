"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Scale, Target, TrendingUp, TrendingDown } from 'lucide-react'
import type { BodyMetrics } from "../../types/fitness"

interface BodyMetricsCardProps {
  userId: string
  currentMetrics: BodyMetrics | null
  onUpdate: (metrics: BodyMetrics) => void
}

export function BodyMetricsCard({ userId, currentMetrics, onUpdate }: BodyMetricsCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    weight: currentMetrics?.weight?.toString() || "",
    bodyFatPercentage: currentMetrics?.bodyFatPercentage?.toString() || "",
    goalWeight: currentMetrics?.goalWeight?.toString() || "",
    goalBodyFat: currentMetrics?.goalBodyFat?.toString() || "",
  })

  // Mock historical data for chart
  const historicalData = [
    { date: "2025-07-20", weight: 185.2, bodyFat: 19.1 },
    { date: "2025-07-21", weight: 184.8, bodyFat: 18.9 },
    { date: "2025-07-22", weight: 184.1, bodyFat: 18.7 },
    { date: "2025-07-23", weight: 183.5, bodyFat: 18.5 },
    { date: "2025-07-24", weight: 183.2, bodyFat: 18.4 },
    { date: "2025-07-25", weight: 182.9, bodyFat: 18.3 },
    { date: "2025-07-26", weight: 182.6, bodyFat: 18.2 },
    { date: "2025-07-27", weight: 182.4, bodyFat: 18.2 },
  ]

  const handleSave = () => {
    const updatedMetrics: BodyMetrics = {
      userId,
      date: new Date().toISOString().split("T")[0],
      weight: formData.weight ? Number.parseFloat(formData.weight) : undefined,
      bodyFatPercentage: formData.bodyFatPercentage ? Number.parseFloat(formData.bodyFatPercentage) : undefined,
      goalWeight: formData.goalWeight ? Number.parseFloat(formData.goalWeight) : undefined,
      goalBodyFat: formData.goalBodyFat ? Number.parseFloat(formData.goalBodyFat) : undefined,
    }

    onUpdate(updatedMetrics)
    setIsEditing(false)
  }

  const weightTrend =
    historicalData.length >= 2
      ? historicalData[historicalData.length - 1].weight - historicalData[historicalData.length - 2].weight
      : 0

  const bodyFatTrend =
    historicalData.length >= 2
      ? historicalData[historicalData.length - 1].bodyFat - historicalData[historicalData.length - 2].bodyFat
      : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-2">
          <Scale className="h-5 w-5" />
          <span>Body Metrics</span>
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Update"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (lb)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="182.4"
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={formData.bodyFatPercentage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bodyFatPercentage: e.target.value }))}
                  placeholder="18.2"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goalWeight">Goal Weight (lb)</Label>
                <Input
                  id="goalWeight"
                  type="number"
                  step="0.1"
                  value={formData.goalWeight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goalWeight: e.target.value }))}
                  placeholder="180"
                />
              </div>
              <div>
                <Label htmlFor="goalBodyFat">Goal Body Fat (%)</Label>
                <Input
                  id="goalBodyFat"
                  type="number"
                  step="0.1"
                  value={formData.goalBodyFat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, goalBodyFat: e.target.value }))}
                  placeholder="15"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Metrics
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Weight</span>
                  <div className="flex items-center space-x-1">
                    {weightTrend !== 0 && (
                      <>
                        {weightTrend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                        <span className={`text-xs ${weightTrend > 0 ? "text-red-500" : "text-green-500"}`}>
                          {Math.abs(weightTrend).toFixed(1)} lb
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold">{currentMetrics?.weight || "--"} lb</p>
                {currentMetrics?.goalWeight && (
                  <div className="flex items-center space-x-2">
                    <Target className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">Goal: {currentMetrics.goalWeight} lb</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Body Fat</span>
                  <div className="flex items-center space-x-1">
                    {bodyFatTrend !== 0 && (
                      <>
                        {bodyFatTrend > 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                        <span className={`text-xs ${bodyFatTrend > 0 ? "text-red-500" : "text-green-500"}`}>
                          {Math.abs(bodyFatTrend).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold">{currentMetrics?.bodyFatPercentage || "--"}%</p>
                {currentMetrics?.goalBodyFat && (
                  <div className="flex items-center space-x-2">
                    <Target className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">Goal: {currentMetrics.goalBodyFat}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mini Chart */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis hide />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      `${value}${name === "weight" ? " lb" : "%"}`,
                      name === "weight" ? "Weight" : "Body Fat",
                    ]}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                Weight
              </Badge>
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                Body Fat
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
