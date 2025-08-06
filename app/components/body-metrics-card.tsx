'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { BodyMetrics } from '@/types/fitness'
import { Scale, Ruler, Gauge, Weight } from 'lucide-react'

interface BodyMetricsCardProps {
  metrics: BodyMetrics
}

export default function BodyMetricsCard({ metrics: initialMetrics }: BodyMetricsCardProps) {
  const { session } = useAuth()
  const [metrics, setMetrics] = useState<BodyMetrics>(initialMetrics)
  const [isEditing, setIsEditing] = useState(false)
  const [newWeight, setNewWeight] = useState(metrics.weight?.toString() || '')
  const [newHeight, setNewHeight] = useState(metrics.height?.toString() || '')
  const [newBodyFat, setNewBodyFat] = useState(metrics.bodyFat?.toString() || '')
  const [newMuscleMass, setNewMuscleMass] = useState(metrics.muscleMass?.toString() || '')
  const supabase = getBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    setNewWeight(metrics.weight?.toString() || '')
    setNewHeight(metrics.height?.toString() || '')
    setNewBodyFat(metrics.bodyFat?.toString() || '')
    setNewMuscleMass(metrics.muscleMass?.toString() || '')
  }, [metrics])

  const handleSaveMetrics = async () => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'Please log in to update metrics.',
        variant: 'destructive',
      })
      return
    }

    try {
      const updatedMetrics = {
        user_id: session.user.id,
        weight: parseFloat(newWeight),
        height: parseFloat(newHeight),
        body_fat: newBodyFat ? parseFloat(newBodyFat) : null,
        muscle_mass: newMuscleMass ? parseFloat(newMuscleMass) : null,
        created_at: new Date().toISOString(), // Log current timestamp for the update
      }

      const { data, error } = await supabase
        .from('body_metrics')
        .upsert(updatedMetrics, { onConflict: 'user_id' }) // Update if user_id exists
        .select()
        .single()

      if (error) throw error

      if (data) {
        // Recalculate BMI if weight and height are available
        const calculatedBmi = (data.weight && data.height)
          ? parseFloat((data.weight / ((data.height / 100) ** 2)).toFixed(1))
          : null;

        setMetrics({
          weight: data.weight,
          height: data.height,
          bmi: calculatedBmi,
          bodyFat: data.body_fat,
          muscleMass: data.muscle_mass,
        })
        toast({
          title: 'Metrics Updated',
          description: 'Your body metrics have been successfully updated!',
        })
        setIsEditing(false)
      }
    } catch (error: any) {
      console.error('Error saving metrics:', error)
      toast({
        title: 'Error',
        description: `Failed to save metrics: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Weight className="h-5 w-5" />
          {metrics.weight ? `${metrics.weight} kg` : 'N/A'}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Ruler className="h-4 w-4" />
          Height: {metrics.height ? `${metrics.height} cm` : 'N/A'}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gauge className="h-4 w-4" />
          BMI: {metrics.bmi ? metrics.bmi : 'N/A'}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gauge className="h-4 w-4" />
          Body Fat: {metrics.bodyFat ? `${metrics.bodyFat}%` : 'N/A'}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Weight className="h-4 w-4" />
          Muscle Mass: {metrics.muscleMass ? `${metrics.muscleMass}%` : 'N/A'}
        </div>
        <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
          Edit Metrics
        </Button>
      </CardContent>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Body Metrics</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="e.g., 70" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={newHeight} onChange={(e) => setNewHeight(e.target.value)} placeholder="e.g., 175" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body-fat">Body Fat (%)</Label>
              <Input id="body-fat" type="number" value={newBodyFat} onChange={(e) => setNewBodyFat(e.target.value)} placeholder="e.g., 15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="muscle-mass">Muscle Mass (%)</Label>
              <Input id="muscle-mass" type="number" value={newMuscleMass} onChange={(e) => setNewMuscleMass(e.target.value)} placeholder="e.g., 40" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMetrics}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
