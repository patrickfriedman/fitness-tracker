"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { BodyMetric } from "@/types/fitness"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Scale, Ruler, Percent, Pencil, Save } from 'lucide-react'
import { format } from "date-fns"

export function BodyMetricsWidget() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [metrics, setMetrics] = useState<BodyMetric | null>(null)
  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [bodyFat, setBodyFat] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching body metrics:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to load body metrics.',
          variant: 'destructive',
        })
      } else if (data) {
        setMetrics(data as BodyMetric)
        setWeight(data.weight?.toString() || '')
        setHeight(data.height?.toString() || '')
        setBodyFat(data.body_fat_percentage?.toString() || '')
      }
      setIsLoading(false)
    }

    fetchMetrics()
  }, [user?.id, supabase, today])

  const handleSaveMetrics = async () => {
    if (!user?.id) return

    setIsSaving(true)
    const newMetrics = {
      user_id: user.id,
      date: today,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      body_fat_percentage: bodyFat ? parseFloat(bodyFat) : null,
    }

    let error = null
    let data = null

    if (metrics?.id) {
      // Update existing
      const { data: updateData, error: updateError } = await supabase
        .from('body_metrics')
        .update(newMetrics)
        .eq('id', metrics.id)
        .select()
        .single()
      data = updateData
      error = updateError
    } else {
      // Insert new
      const { data: insertData, error: insertError } = await supabase
        .from('body_metrics')
        .insert(newMetrics)
        .select()
        .single()
      data = insertData
      error = insertError
    }

    if (error) {
      console.error('Error saving body metrics:', error.message)
      toast({
        title: 'Error',
        description: 'Failed to save body metrics.',
        variant: 'destructive',
      })
    } else if (data) {
      setMetrics(data as BodyMetric)
      toast({
        title: 'Success',
        description: 'Body metrics saved!',
      })
      setIsEditing(false)
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          <span className="sr-only">{isEditing ? 'Save' : 'Edit'}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Today: {format(new Date(), 'PPP')}</p>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-muted-foreground" />
            <Label htmlFor="weight" className="sr-only">Weight</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled={!isEditing || isSaving}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-muted-foreground" />
            <Label htmlFor="height" className="sr-only">Height</Label>
            <Input
              id="height"
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              disabled={!isEditing || isSaving}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground">cm</span>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-muted-foreground" />
            <Label htmlFor="bodyFat" className="sr-only">Body Fat %</Label>
            <Input
              id="bodyFat"
              type="number"
              placeholder="Body Fat (%)"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              disabled={!isEditing || isSaving}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
        {isEditing && (
          <Button onClick={handleSaveMetrics} className="w-full mt-4" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        )}
        {!isEditing && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Last updated: {metrics?.created_at ? format(new Date(metrics.created_at), 'PPP p') : 'N/A'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
