'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createBodyMetric } from '@/app/actions/body-metrics-actions'

export default function BodyMetricsCard() {
  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [bodyFat, setBodyFat] = useState<string>('')
  const [muscleMass, setMuscleMass] = useState<string>('')
  const { toast } = useToast()

  const handleSubmit = async () => {
    const result = await createBodyMetric({
      weight_kg: weight ? parseFloat(weight) : undefined,
      height_cm: height ? parseFloat(height) : undefined,
      body_fat_percent: bodyFat ? parseFloat(bodyFat) : undefined,
      muscle_mass_kg: muscleMass ? parseFloat(muscleMass) : undefined,
    })

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Body metrics saved successfully.',
      })
      setWeight('')
      setHeight('')
      setBodyFat('')
      setMuscleMass('')
    } else {
      toast({
        title: 'Error!',
        description: result.error || 'Failed to save body metrics.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70.5"
          />
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g., 175"
          />
        </div>
        <div>
          <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700">
            Body Fat (%)
          </label>
          <Input
            id="bodyFat"
            type="number"
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
            placeholder="e.g., 15.2"
          />
        </div>
        <div>
          <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700">
            Muscle Mass (kg)
          </label>
          <Input
            id="muscleMass"
            type="number"
            value={muscleMass}
            onChange={(e) => setMuscleMass(e.target.value)}
            placeholder="e.g., 55.0"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Save Metrics
        </Button>
      </CardContent>
    </Card>
  )
}
