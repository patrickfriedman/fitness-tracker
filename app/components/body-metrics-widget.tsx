'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Plus, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { BodyMetric } from '@/types/fitness'

export default function BodyMetricsWidget() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [weight, setWeight] = useState<string>('')
  const [height, setHeight] = useState<string>('')
  const [bodyFat, setBodyFat] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastMetric, setLastMetric] = useState<BodyMetric | null>(null)

  useEffect(() => {
    const fetchLastMetrics = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching body metrics:', error)
        toast({
          title: 'Error',
          description: 'Failed to load body metrics.',
          variant: 'destructive',
        })
      } else if (data) {
        setLastMetric(data as BodyMetric)
        setWeight(data.weight?.toString() || '')
        setHeight(data.height?.toString() || '')
        setBodyFat(data.body_fat_percentage?.toString() || '')
      }
      setIsLoading(false)
    }

    fetchLastMetrics()
  }, [user, supabase, toast])

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
      // Update lastMetric to reflect the newly saved data
      setLastMetric({
        id: 'new', // Placeholder ID
        userId: user.id,
        date: newMetric.date,
        weight: newMetric.weight || undefined,
        height: newMetric.height || undefined,
        bodyFatPercentage: newMetric.body_fat_percentage || undefined,
      })
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Body Metrics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastMetric && (
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(lastMetric.date).toLocaleDateString()}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg/lbs)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm/in)</Label>
            <Input
              id="height"
              type="number"
              placeholder="e.g., 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body-fat">Body Fat (%)</Label>
            <Input
              id="body-fat"
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
