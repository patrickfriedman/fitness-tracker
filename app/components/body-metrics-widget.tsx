"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Scale, Target, TrendingUp } from 'lucide-react'

export function BodyMetricsWidget() {
  const [metrics, setMetrics] = useState({
    weight: 175,
    bodyFat: 18,
    goalWeight: 170,
    goalBodyFat: 15,
  })
  const [isOpen, setIsOpen] = useState(false)

  const weightProgress = ((metrics.weight - metrics.goalWeight) / metrics.weight) * 100
  const bodyFatProgress = ((metrics.bodyFat - metrics.goalBodyFat) / metrics.bodyFat) * 100

  const handleSave = (newMetrics: typeof metrics) => {
    setMetrics(newMetrics)
    setIsOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{metrics.weight} lbs</p>
              <p className="text-xs text-muted-foreground">Current Weight</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{metrics.goalWeight} lbs</p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
          </div>
          <Progress value={Math.max(0, 100 - Math.abs(weightProgress))} className="h-2" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{metrics.bodyFat}%</p>
              <p className="text-xs text-muted-foreground">Body Fat</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{metrics.goalBodyFat}%</p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
          </div>
          <Progress value={Math.max(0, 100 - Math.abs(bodyFatProgress))} className="h-2" />
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full mt-4">
              Update Metrics
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Body Metrics</DialogTitle>
            </DialogHeader>
            <MetricsForm metrics={metrics} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function MetricsForm({ metrics, onSave }: { metrics: any; onSave: (metrics: any) => void }) {
  const [formData, setFormData] = useState(metrics)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="goalWeight">Goal Weight (lbs)</Label>
          <Input
            id="goalWeight"
            type="number"
            value={formData.goalWeight}
            onChange={(e) => setFormData({ ...formData, goalWeight: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="bodyFat">Body Fat (%)</Label>
          <Input
            id="bodyFat"
            type="number"
            value={formData.bodyFat}
            onChange={(e) => setFormData({ ...formData, bodyFat: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="goalBodyFat">Goal Body Fat (%)</Label>
          <Input
            id="goalBodyFat"
            type="number"
            value={formData.goalBodyFat}
            onChange={(e) => setFormData({ ...formData, goalBodyFat: Number(e.target.value) })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  )
}
