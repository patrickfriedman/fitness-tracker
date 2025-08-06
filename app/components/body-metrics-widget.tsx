"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Scale, TrendingUp, TrendingDown, Plus } from 'lucide-react'

interface BodyMetric {
  id: string
  date: string
  weight?: number
  bodyFat?: number
  muscleMass?: number
}

export function BodyMetricsWidget() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newMetric, setNewMetric] = useState({
    weight: "",
    bodyFat: "",
    muscleMass: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("fitness-metrics")
    if (stored) {
      setMetrics(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    const metric: BodyMetric = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: newMetric.weight ? parseFloat(newMetric.weight) : undefined,
      bodyFat: newMetric.bodyFat ? parseFloat(newMetric.bodyFat) : undefined,
      muscleMass: newMetric.muscleMass ? parseFloat(newMetric.muscleMass) : undefined,
    }

    const updatedMetrics = [metric, ...metrics]
    setMetrics(updatedMetrics)
    localStorage.setItem("fitness-metrics", JSON.stringify(updatedMetrics))
    
    setNewMetric({ weight: "", bodyFat: "", muscleMass: "" })
    setIsOpen(false)
  }

  const latestMetric = metrics[0]
  const previousMetric = metrics[1]

  const getWeightTrend = () => {
    if (!latestMetric?.weight || !previousMetric?.weight) return null
    const diff = latestMetric.weight - previousMetric.weight
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? "up" : diff < 0 ? "down" : "same",
    }
  }

  const weightTrend = getWeightTrend()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Body Metrics</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Body Metrics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newMetric.weight}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={newMetric.bodyFat}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, bodyFat: e.target.value }))}
                  placeholder="Enter body fat percentage"
                />
              </div>
              <div>
                <Label htmlFor="muscleMass">Muscle Mass (lbs)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  value={newMetric.muscleMass}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, muscleMass: e.target.value }))}
                  placeholder="Enter muscle mass"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Metrics
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {latestMetric ? (
          <div className="space-y-4">
            {latestMetric.weight && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Scale className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Weight</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">{latestMetric.weight} lbs</span>
                  {weightTrend && (
                    <Badge variant={weightTrend.direction === "up" ? "destructive" : "default"}>
                      {weightTrend.direction === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {weightTrend.value.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {latestMetric.bodyFat && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Body Fat</span>
                <span className="text-lg font-bold">{latestMetric.bodyFat}%</span>
              </div>
            )}
            
            {latestMetric.muscleMass && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Muscle Mass</span>
                <span className="text-lg font-bold">{latestMetric.muscleMass} lbs</span>
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Last updated: {new Date(latestMetric.date).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <Scale className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">No metrics recorded yet</p>
            <Button size="sm" onClick={() => setIsOpen(true)}>
              Add First Metric
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
