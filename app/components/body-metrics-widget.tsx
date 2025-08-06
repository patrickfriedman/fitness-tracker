"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Scale, TrendingUp, Plus } from 'lucide-react'

export function BodyMetricsWidget() {
  const [metrics, setMetrics] = useState({
    weight: 175,
    bodyFat: 15,
    lastUpdated: "2024-01-15"
  })
  const [isOpen, setIsOpen] = useState(false)
  const [newMetrics, setNewMetrics] = useState({
    weight: "",
    bodyFat: ""
  })

  const handleSave = () => {
    if (newMetrics.weight) {
      setMetrics(prev => ({
        ...prev,
        weight: parseFloat(newMetrics.weight),
        bodyFat: newMetrics.bodyFat ? parseFloat(newMetrics.bodyFat) : prev.bodyFat,
        lastUpdated: new Date().toISOString().split('T')[0]
      }))
      setNewMetrics({ weight: "", bodyFat: "" })
      setIsOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Body Metrics</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Body Metrics</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={newMetrics.weight}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  placeholder="Enter body fat percentage"
                  value={newMetrics.bodyFat}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, bodyFat: e.target.value }))}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Metrics
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Scale className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{metrics.weight} lbs</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Weight</p>
          </div>
        </div>
        
        {metrics.bodyFat && (
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{metrics.bodyFat}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Body Fat</p>
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Last updated: {new Date(metrics.lastUpdated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
