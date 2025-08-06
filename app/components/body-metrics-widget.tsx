"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Scale, Ruler, Weight, PlusCircle, Edit } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { BodyMetric } from "@/types/fitness"
import { format } from "date-fns"

export function BodyMetricsWidget() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [metrics, setMetrics] = useState<BodyMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [weight, setWeight] = useState<string>("")
  const [height, setHeight] = useState<string>("")
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>("")
  const [muscleMassPercentage, setMuscleMassPercentage] = useState<string>("")
  const [waistCircumference, setWaistCircumference] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

  const units = user?.preferences.units || "imperial"

  useEffect(() => {
    if (user?.id) {
      fetchBodyMetrics()
    }
  }, [user?.id])

  const fetchBodyMetrics = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error
      }

      if (data) {
        setMetrics(data as BodyMetric)
        setWeight(data.weight?.toString() || "")
        setHeight(data.height?.toString() || "")
        setBodyFatPercentage(data.body_fat_percentage?.toString() || "")
        setMuscleMassPercentage(data.muscle_mass_percentage?.toString() || "")
        setWaistCircumference(data.waist_circumference?.toString() || "")
        setNotes(data.notes || "")
      } else {
        setMetrics(null)
        resetForm()
      }
    } catch (error: any) {
      console.error("Error fetching body metrics:", error.message)
      toast({
        title: "Error",
        description: "Failed to load body metrics.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setWeight("")
    setHeight("")
    setBodyFatPercentage("")
    setMuscleMassPercentage("")
    setWaistCircumference("")
    setNotes("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const metricData = {
        user_id: user.id,
        date: today,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        body_fat_percentage: bodyFatPercentage ? parseFloat(bodyFatPercentage) : null,
        muscle_mass_percentage: muscleMassPercentage ? parseFloat(muscleMassPercentage) : null,
        waist_circumference: waistCircumference ? parseFloat(waistCircumference) : null,
        notes: notes || null,
      }

      let error = null
      if (metrics) {
        const { error: updateError } = await supabase
          .from('body_metrics')
          .update(metricData)
          .eq('id', metrics.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('body_metrics')
          .insert(metricData)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Success",
        description: "Body metrics saved successfully!",
      })
      setIsDialogOpen(false)
      fetchBodyMetrics() // Re-fetch to update the display
    } catch (error: any) {
      console.error("Error saving body metrics:", error.message)
      toast({
        title: "Error",
        description: "Failed to save body metrics.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : metrics ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold">{metrics.weight || 'N/A'} {units === 'imperial' ? 'lbs' : 'kg'}</p>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="text-2xl font-bold">{metrics.height || 'N/A'} {units === 'imperial' ? 'in' : 'cm'}</p>
            <p className="text-sm text-muted-foreground">Height</p>
            {metrics.bodyFatPercentage && (
              <>
                <p className="text-2xl font-bold">{metrics.bodyFatPercentage}%</p>
                <p className="text-sm text-muted-foreground">Body Fat</p>
              </>
            )}
            {metrics.waistCircumference && (
              <>
                <p className="text-2xl font-bold">{metrics.waistCircumference} {units === 'imperial' ? 'in' : 'cm'}</p>
                <p className="text-sm text-muted-foreground">Waist</p>
              </>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full">
                  <Edit className="mr-2 h-4 w-4" /> Edit Metrics
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Body Metrics</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">Weight ({units === 'imperial' ? 'lbs' : 'kg'})</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="height" className="text-right">Height ({units === 'imperial' ? 'in' : 'cm'})</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bodyFat" className="text-right">Body Fat (%)</Label>
                    <Input id="bodyFat" type="number" value={bodyFatPercentage} onChange={(e) => setBodyFatPercentage(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="muscleMass" className="text-right">Muscle Mass (%)</Label>
                    <Input id="muscleMass" type="number" value={muscleMassPercentage} onChange={(e) => setMuscleMassPercentage(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="waist" className="text-right">Waist ({units === 'imperial' ? 'in' : 'cm'})</Label>
                    <Input id="waist" type="number" value={waistCircumference} onChange={(e) => setWaistCircumference(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
                    <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No metrics logged for today.</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Log Today's Metrics
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log Body Metrics</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="weight" className="text-right">Weight ({units === 'imperial' ? 'lbs' : 'kg'})</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="height" className="text-right">Height ({units === 'imperial' ? 'in' : 'cm'})</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bodyFat" className="text-right">Body Fat (%)</Label>
                    <Input id="bodyFat" type="number" value={bodyFatPercentage} onChange={(e) => setBodyFatPercentage(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="muscleMass" className="text-right">Muscle Mass (%)</Label>
                    <Input id="muscleMass" type="number" value={muscleMassPercentage} onChange={(e) => setMuscleMassPercentage(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="waist" className="text-right">Waist ({units === 'imperial' ? 'in' : 'cm'})</Label>
                    <Input id="waist" type="number" value={waistCircumference} onChange={(e) => setWaistCircumference(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">Notes</Label>
                    <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Logging..." : "Log Metrics"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
