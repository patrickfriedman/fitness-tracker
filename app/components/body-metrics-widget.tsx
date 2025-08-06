'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { BodyMetric } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, PlusCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function BodyMetricsWidget() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newWeight, setNewWeight] = useState<string>('')
  const [newBodyFat, setNewBodyFat] = useState<string>('')
  const [newNotes, setNewNotes] = useState<string>('')
  const supabase = getBrowserClient()

  const fetchMetrics = async () => {
    if (!user?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('body_metrics')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5) // Show last 5 entries

    if (error) {
      console.error('Error fetching body metrics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load body metrics.',
        variant: 'destructive',
      })
    } else {
      setMetrics(data as BodyMetric[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMetrics()
  }, [user])

  const handleAddMetric = async () => {
    if (!user?.id) return
    setIsAdding(true)
    const parsedWeight = parseFloat(newWeight)
    const parsedBodyFat = parseFloat(newBodyFat)

    if (isNaN(parsedWeight) && isNaN(parsedBodyFat)) {
      toast({
        title: 'Input Error',
        description: 'Please enter at least a valid weight or body fat percentage.',
        variant: 'destructive',
      })
      setIsAdding(false)
      return
    }

    const { error } = await supabase.from('body_metrics').insert({
      user_id: user.id,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      weight: isNaN(parsedWeight) ? null : parsedWeight,
      body_fat_percentage: isNaN(parsedBodyFat) ? null : parsedBodyFat,
      notes: newNotes || null,
    })

    if (error) {
      console.error('Error adding body metric:', error)
      toast({
        title: 'Error',
        description: 'Failed to add body metric.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Body metric added successfully!',
      })
      setNewWeight('')
      setNewBodyFat('')
      setNewNotes('')
      fetchMetrics() // Refresh data
    }
    setIsAdding(false)
  }

  const latestMetric = metrics[0]

  return (
    <Card className="widget-card">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Body Metrics</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Metric
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Body Metric</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight ({user?.preferences?.units === 'metric' ? 'kg' : 'lbs'})</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g., 180.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  placeholder="e.g., 15.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddMetric} disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Metric'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="widget-content">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : latestMetric ? (
          <div className="space-y-2">
            <p>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(latestMetric.date).toLocaleDateString()}
            </p>
            {latestMetric.weight && (
              <p>
                <span className="font-medium">Weight:</span> {latestMetric.weight}{' '}
                {user?.preferences?.units === 'metric' ? 'kg' : 'lbs'}
              </p>
            )}
            {latestMetric.body_fat_percentage && (
              <p>
                <span className="font-medium">Body Fat:</span> {latestMetric.body_fat_percentage}%
              </p>
            )}
            {latestMetric.notes && (
              <p>
                <span className="font-medium">Notes:</span> {latestMetric.notes}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No body metrics recorded yet. Add your first entry!</p>
        )}
      </CardContent>
    </Card>
  )
}
