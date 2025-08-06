"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Smile, Frown, Meh, PlusCircle, Edit } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { MoodLog } from "@/types/fitness"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function MoodTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [moodScore, setMoodScore] = useState(3) // Default to neutral
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [moodLogId, setMoodLogId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchMoodLog()
    }
  }, [user?.id])

  const fetchMoodLog = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error
      }

      if (data) {
        setMoodScore(data.mood_score)
        setNotes(data.notes || "")
        setMoodLogId(data.id)
      } else {
        setMoodScore(3) // Reset to default if no log for today
        setNotes("")
        setMoodLogId(null)
      }
    } catch (error: any) {
      console.error("Error fetching mood log:", error.message)
      toast({
        title: "Error",
        description: "Failed to load mood data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const logData = {
        user_id: user.id,
        date: today,
        mood_score: moodScore,
        notes: notes || null,
      }

      let error = null
      if (moodLogId) {
        const { error: updateError } = await supabase
          .from('mood_logs')
          .update(logData)
          .eq('id', moodLogId)
        error = updateError
      } else {
        const { data, error: insertError } = await supabase
          .from('mood_logs')
          .insert(logData)
          .select()
          .single()
        error = insertError
        if (data) setMoodLogId(data.id)
      }

      if (error) throw error

      toast({
        title: "Success",
        description: "Mood logged successfully!",
      })
      setIsDialogOpen(false)
      fetchMoodLog() // Re-fetch to update the display
    } catch (error: any) {
      console.error("Error saving mood log:", error.message)
      toast({
        title: "Error",
        description: "Failed to save mood.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getMoodIcon = (score: number) => {
    if (score <= 2) return <Frown className="h-8 w-8 text-red-500" />
    if (score === 3) return <Meh className="h-8 w-8 text-yellow-500" />
    return <Smile className="h-8 w-8 text-green-500" />
  }

  const getMoodText = (score: number) => {
    if (score === 1) return "Very Bad"
    if (score === 2) return "Bad"
    if (score === 3) return "Neutral"
    if (score === 4) return "Good"
    if (score === 5) return "Excellent"
    return ""
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Mood</CardTitle>
        {getMoodIcon(moodScore)}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="text-2xl font-bold text-center">
              {getMoodText(moodScore)}
            </div>
            <p className="text-sm text-muted-foreground text-center">{notes}</p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full">
                  {moodLogId ? <><Edit className="mr-2 h-4 w-4" /> Edit Mood</> : <><PlusCircle className="mr-2 h-4 w-4" /> Log Mood</>}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{moodLogId ? "Edit Daily Mood" : "Log Daily Mood"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="mood-slider">How are you feeling today?</Label>
                    <div className="flex items-center gap-4">
                      <Frown className="h-6 w-6 text-red-500" />
                      <Slider
                        id="mood-slider"
                        min={1}
                        max={5}
                        step={1}
                        value={[moodScore]}
                        onValueChange={(val) => setMoodScore(val[0])}
                        className="flex-grow"
                        disabled={loading}
                      />
                      <Smile className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-center text-lg font-semibold mt-2">
                      {getMoodText(moodScore)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any thoughts or reasons for your mood?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Mood"}
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
