"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Scale, Ruler, Plus, TrendingUp, TrendingDown } from 'lucide-react'

export function BodyMetricsWidget() {
  const [metrics, setMetrics] = useState({
    weight: 175,
    bodyFat: 15.2,
    muscle: 145,
    height: 70,
  })
  
  const [newMetrics, setNewMetrics] = useState({
    weight: "",
    bodyFat: "",
    muscle: "",
  })

  const handleAddMetrics = () => {
    if (newMetrics.weight) {
      setMetrics(prev => ({
        ...prev,
        weight: parseFloat(newMetrics.weight),
        bodyFat: newMetrics.bodyFat ? parseFloat(newMetrics.bodyFat) : prev.bodyFat,
        muscle: newMetrics.muscle ? parseFloat(newMetrics.muscle) : prev.muscle,
      }))
      setNewMetrics({ weight: "", bodyFat: "", muscle: "" })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Body Metrics</CardTitle>
        <Dialog>
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
                  placeholder="175"
                  value={newMetrics.weight}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, weight: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  placeholder="15.2"
                  value={newMetrics.bodyFat}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, bodyFat: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="muscle">Muscle Mass (lbs)</Label>
                <Input
                  id="muscle"
                  type="number"
                  placeholder="145"
                  value={newMetrics.muscle}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, muscle: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddMetrics} className="w-full">
                Save Metrics
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{metrics.weight}</p>
              <p className="text-xs text-gray-500">lbs</p>
            </div>
            <TrendingDown className="h-4 w-4 text-green-600 ml-auto" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Ruler className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{metrics.bodyFat}</p>
              <p className="text-xs text-gray-500">% body fat</p>
            </div>
            <TrendingDown className="h-4 w-4 text-green-600 ml-auto" />
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Muscle Mass</span>
            <span className="font-medium">{metrics.muscle} lbs</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Height</span>
            <span className="font-medium">{Math.floor(metrics.height / 12)}'{metrics.height % 12}"</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
