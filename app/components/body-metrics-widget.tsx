"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Scale, Ruler, Plus } from 'lucide-react'

interface BodyMetrics {
  weight: number
  height: number
  bodyFat?: number
  date: string
}

export function BodyMetricsWidget() {
  const [metrics, setMetrics] = useState<BodyMetrics[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newMetrics, setNewMetrics] = useState({
    weight: "",
    height: "",
    bodyFat: ""
  })

  useEffect(() => {
    const stored = localStorage.getItem("fitness-metrics")
    if (stored) {
      setMetrics(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    const metricsData: BodyMetrics = {
      weight: parseFloat(newMetrics.weight),
      height: parseFloat(newMetrics.height),
      bodyFat: newMetrics.bodyFat ? parseFloat(newMetrics.bodyFat) : undefined,
      date: new Date().toISOString()
    }

    const updated = [metricsData, ...metrics.slice(0, 9)] // Keep last 10 entries
    setMetrics(updated)
    localStorage.setItem("fitness-metrics", JSON.stringify(updated))
    
    setNewMetrics({ weight: "", height: "", bodyFat: "" })
    setIsOpen(false)
  }

  const latestMetrics = metrics[0]
  const previousMetrics = metrics[1]

  const weightChange = latestMetrics && previousMetrics 
    ? latestMetrics.weight - previousMetrics.weight 
    : 0

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
              <DialogTitle>Add Body Metrics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={newMetrics.weight}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter weight"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  value={newMetrics.height}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter height"
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  value={newMetrics.bodyFat}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, bodyFat: e.target.value }))}
                  placeholder="Enter body fat percentage"
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
        {latestMetrics ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scale className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Weight</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{latestMetrics.weight} lbs</div>
                {weightChange !== 0 && (
                  <div className={`text-xs ${weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ruler className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Height</span>
              </div>
              <div className="font-semibold">{latestMetrics.height}"</div>
            </div>

            {latestMetrics.bodyFat && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Body Fat</span>
                <div className="font-semibold">{latestMetrics.bodyFat}%</div>
              </div>
            )}

            {latestMetrics.weight && latestMetrics.height && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">BMI</span>
                <div className="font-semibold">
                  {((latestMetrics.weight / (latestMetrics.height * latestMetrics.height)) * 703).toFixed(1)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No metrics recorded yet</p>
            <p className="text-gray-400 text-xs">Add your first measurement to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
