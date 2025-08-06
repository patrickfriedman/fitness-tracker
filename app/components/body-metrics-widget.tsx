'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Scale, Ruler, Percent } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { BodyMetric } from "@/types/fitness"

export default function BodyMetricsWidget() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [bodyFat, setBodyFat] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const [recentMetrics, setRecentMetrics] = useState<BodyMetric[]>([])
  const [loadingMetrics, setLoadingMetrics] = useState(true)

  const units = user?.preferences.units || "imperial"
  const weightUnit = units === "imperial" ? "lbs" : "kg"
  const heightUnit = units === "imperial" ? "inches" : "cm"

  // Fetch recent metrics on component mount
  useState(() => {
    const fetchMetrics = async () => {
      if (!user) return
      setLoadingMetrics(true)
      const { data, error } = await supabase
        .from('body_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(3) // Fetch last 3 entries for display

      if (error) {
        console.error("Error fetching body metrics:", error)
        toast({
          title: "Error",
          description: "Failed to load body metrics.",
          variant: "destructive",
        })
      } else {
        setRecentMetrics(data as BodyMetric[])
      }
      setLoadingMetrics(false)
    }
    fetchMetrics()
  }, [user])

  const handleLogMetrics = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to log body metrics.",
        variant: "destructive",
      })
      return
    }

    setIsLogging(true)
    try {
      const newMetric: Partial<BodyMetric> = {
        user_id: user.id,
        date: new Date().toISOString(),
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        body_fat_percentage: bodyFat ? parseFloat(bodyFat) : undefined,
      }

      const { data, error } = await supabase
        .from('body_metrics')
        .insert(newMetric)
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Metrics Logged!",
        description: "Your body metrics have been successfully recorded.",
      })
      setWeight("")
      setHeight("")
      setBodyFat("")
      setIsLogging(false)
      // Refresh recent metrics
      setRecentMetrics((prev) => [data[0] as BodyMetric, ...prev].slice(0, 3))
    } catch (error: any) {
      console.error("Error logging metrics:", error)
      toast({
        title: "Error",
        description: `Failed to log metrics: ${error.message}`,
        variant: "destructive",
      })
      setIsLogging(false)
    }
  }

  const latestMetric = recentMetrics[0]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Body Metrics</CardTitle>
        <Scale className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loadingMetrics ? (
          <div className="text-center text-sm text-muted-foreground">Loading metrics...</div>
        ) : latestMetric ? (
          <>
            <div className="text-2xl font-bold">
              {latestMetric.weight ? `${latestMetric.weight}${weightUnit}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {latestMetric.height ? `${latestMetric.height}${heightUnit} height` : ''}
              {latestMetric.height && latestMetric.body_fat_percentage ? ' • ' : ''}
              {latestMetric.body_fat_percentage ? `${latestMetric.body_fat_percentage}% BF` : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(latestMetric.date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">No metrics logged yet.</div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Log Metrics
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Body Metrics</DialogTitle>
              <DialogDescription>
                Enter your current body measurements.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">
                  Weight ({weightUnit})
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="col-span-3"
                  disabled={isLogging}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="height" className="text-right">
                  Height ({heightUnit})
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="col-span-3"
                  disabled={isLogging}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bodyFat" className="text-right">
                  Body Fat (%)
                </Label>
                <Input
                  id="bodyFat"
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="col-span-3"
                  disabled={isLogging}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleLogMetrics} disabled={isLogging}>
                {isLogging ? "Logging..." : "Save Metrics"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
