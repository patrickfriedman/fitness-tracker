"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { BodyMetric } from '@/types/fitness'
import { addBodyMetric } from '@/app/actions/body-metrics-actions'
import { useToast } from '@/hooks/use-toast'

export default function BodyMetricsWidget({ initialMetrics }: { initialMetrics: BodyMetric[] }) {
  const [weight, setWeight] = useState<number | ''>('')
  const [height, setHeight] = useState<number | ''>('')
  const [bodyFat, setBodyFat] = useState<number | ''>('')
  const [muscleMass, setMuscleMass] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const latestMetric = initialMetrics.length > 0 ? initialMetrics[0] : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!weight && !height && !bodyFat && !muscleMass) {
      toast({
        title: 'Input Error',
        description: 'Please enter at least one body metric to log.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const newMetric: Omit<BodyMetric, 'id' | 'user_id' | 'log_date' | 'created_at'> = {
      weight_kg: weight === '' ? null : Number(weight),
      height_cm: height === '' ? null : Number(height),
      body_fat_percent: bodyFat === '' ? null : Number(bodyFat),
      muscle_mass_kg: muscleMass === '' ? null : Number(muscleMass),
    }

    const { success, message } = await addBodyMetric(newMetric)

    if (success) {
      toast({
        title: 'Success',
        description: message,
      })
      setWeight('')
      setHeight('')
      setBodyFat('')
      setMuscleMass('')
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestMetric && (
          <div className="text-sm text-muted-foreground">
            <p>Last logged: {new Date(latestMetric.log_date).toLocaleDateString()}</p>
            {latestMetric.weight_kg && <p>Weight: {latestMetric.weight_kg} kg</p>}
            {latestMetric.height_cm && <p>Height: {latestMetric.height_cm} cm</p>}
            {latestMetric.body_fat_percent && <p>Body Fat: {latestMetric.body_fat_percent}%</p>}
            {latestMetric.muscle_mass_kg && <p>Muscle Mass: {latestMetric.muscle_mass_kg} kg</p>}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 75.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 170"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat (%)</Label>
              <Input
                id="bodyFat"
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 15.2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
              <Input
                id="muscleMass"
                type="number"
                step="0.1"
                value={muscleMass}
                onChange={(e) => setMuscleMass(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="e.g., 60.1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging...' : 'Log Metrics'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
