'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { BodyMetric } from '@/types/fitness'

export default function BodyMetricsWidget() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([
    { id: '1', date: new Date('2023-01-01'), weight: 70, bodyFat: 15, muscleMass: 30 },
    { id: '2', date: new Date('2023-02-01'), weight: 69, bodyFat: 14.8, muscleMass: 30.2 },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newMetric, setNewMetric] = useState<Omit<BodyMetric, 'id'>>({
    date: new Date(),
    weight: 0,
    bodyFat: 0,
    muscleMass: 0,
  })

  const handleAddMetric = () => {
    if (newMetric.weight > 0) {
      setMetrics([...metrics, { ...newMetric, id: Date.now().toString() }])
      setNewMetric({ date: new Date(), weight: 0, bodyFat: 0, muscleMass: 0 })
      setIsDialogOpen(false)
      toast({
        title: 'Body Metric Added',
        description: 'Your new body metric has been recorded.',
      })
    } else {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid weight.',
        variant: 'destructive',
      })
    }
  }

  const latestMetric = metrics.sort((a, b) => b.date.getTime() - a.date.getTime())[0]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          Add Metric
        </Button>
      </CardHeader>
      <CardContent>
        {latestMetric ? (
          <div className="text-2xl font-bold">
            {latestMetric.weight} kg
            <p className="text-xs text-muted-foreground">
              Last updated: {latestMetric.date.toLocaleDateString()}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
              <div>
                <span className="font-medium">Body Fat:</span> {latestMetric.bodyFat}%
              </div>
              <div>
                <span className="font-medium">Muscle Mass:</span> {latestMetric.muscleMass}%
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No body metrics recorded yet.</p>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Body Metric</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={newMetric.weight}
                onChange={(e) => setNewMetric({ ...newMetric, weight: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bodyFat" className="text-right">
                Body Fat (%)
              </Label>
              <Input
                id="bodyFat"
                type="number"
                value={newMetric.bodyFat}
                onChange={(e) => setNewMetric({ ...newMetric, bodyFat: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="muscleMass" className="text-right">
                Muscle Mass (%)
              </Label>
              <Input
                id="muscleMass"
                type="number"
                value={newMetric.muscleMass}
                onChange={(e) => setNewMetric({ ...newMetric, muscleMass: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddMetric}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
