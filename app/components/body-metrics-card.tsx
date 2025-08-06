'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// This component is likely a duplicate or older version of BodyMetricsWidget.
// Keeping it for completeness as it was in the previous context, but
// BodyMetricsWidget is the more comprehensive one.
export default function BodyMetricsCard() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [bodyFat, setBodyFat] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveMetrics = async () => {
    if (!user?.id || user.id === 'demo-user-123') {
      toast({
        title: 'Demo Mode',
        description: 'Body metrics cannot be saved in demo mode.',
      })
      return
    }

    setIsSaving(true)
    const newMetric = {
      user_id: user.id,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      weight: parseFloat(weight) || null,
      height: parseFloat(height) || null,
      body_fat_percentage: parseFloat(bodyFat) || null,
    }

    const { error } = await supabase.from('body_metrics').insert(newMetric)

    if (error) {
      console.error('Error saving body metrics:', error)
      toast({
        title: 'Error',
        description: 'Failed to save body metrics.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Body metrics saved!',
      })
      setWeight('');
      setHeight('');
      setBodyFat('');
    }
    setIsSaving(false)
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Log Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight-card">Weight (kg/lbs)</Label>
            <Input
              id="weight-card"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height-card">Height (cm/in)</Label>
            <Input
              id="height-card"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body-fat-card">Body Fat (%)</Label>
            <Input
              id="body-fat-card"
              type="number"
              placeholder="e.g., 15"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSaveMetrics} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Metrics
        </Button>
      </CardContent>
    </Card>
  )
}
