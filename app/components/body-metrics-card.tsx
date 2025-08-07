'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarIcon, Scale, Ruler } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

type BodyMetric = Database['public']['Tables']['body_metrics']['Row']

export default function BodyMetricsCard() {
  const [weight, setWeight] = useState<number | ''>('')
  const [height, setHeight] = useState<number | ''>('')
  const [logDate, setLogDate] = useState<Date | undefined>(new Date())
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLatestMetrics = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching body metrics:', error)
      } else if (data) {
        setWeight(data.weight_kg || '')
        setHeight(data.height_cm || '')
        setLogDate(data.log_date ? new Date(data.log_date) : new Date())
      }
    }

    fetchLatestMetrics()
  }, [supabase])

  const handleSaveMetrics = async () => {
    if (!weight || !height || !logDate) {
      toast({
        title: 'Missing Information',
        description: 'Please enter your weight, height, and select a date.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: 'Error',
        description: 'User not logged in.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const { error } = await supabase.from('body_metrics').upsert(
      {
        user_id: user.id,
        log_date: logDate.toISOString().split('T')[0],
        weight_kg: weight,
        height_cm: height,
      },
      { onConflict: 'user_id,log_date' } // Update if entry for this user and date already exists
    )

    if (error) {
      console.error('Error saving body metrics:', error)
      toast({
        title: 'Error',
        description: 'Failed to save body metrics.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Body Metrics Saved!',
        description: 'Your body measurements have been updated.',
      })
    }
    setLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log Body Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || '')}
            placeholder="e.g., 70.5"
            required
          />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || '')}
            placeholder="e.g., 175"
            required
          />
        </div>
        <div>
          <Label htmlFor="logDate">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !logDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {logDate ? format(logDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={logDate}
                onSelect={setLogDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveMetrics} className="w-full" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Metrics
        </Button>
      </CardFooter>
    </Card>
  )
}
