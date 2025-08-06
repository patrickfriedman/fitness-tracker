'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Smile, Frown, Meh, PlusCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import type { MoodEntry } from "@/types/fitness"

export default function MoodTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [moodScore, setMoodScore] = useState(3) // Default to neutral
  const [notes, setNotes] = useState("")
  const [isLogging, setIsLogging] = useState(false)
  const [latestMood, setLatestMood] = useState<MoodEntry | null>(null)
  const [loadingMood, setLoadingMood] = useState(true)

  useState(() => {
    const fetchMood = async () => {
      if (!user) return
      setLoadingMood(true)
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error("Error fetching mood:", error)
        toast({
          title: "Error",
          description: "Failed to load mood entry.",
          variant: "destructive",
        })
      } else if (data) {
        setLatestMood(data as MoodEntry)
        setMoodScore(data.mood_score)
        setNotes(data.notes || "")
      }
      setLoadingMood(false)
    }
    fetchMood()
  }, [user])

  const getMoodEmoji = (score: number) => {
    if (score === 1) return "😞"
    if (score === 2) return "🙁"
    if (score === 3) return "😐"
    if (score === 4) return "🙂"
    if (score === 5) return "😁"
    return "😐"
  }

  const getMoodDescription = (score: number) => {
    if (score === 1) return "Very Bad"
    if (score === 2) return "Bad"
    if (score === 3) return "Neutral"
    if (score === 4) return "Good"
    if (score === 5) return "Excellent"
    return "Neutral"
  }

  const handleLogMood = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track your mood.",
        variant: "destructive",
      })
      return
    }

    setIsLogging(true)
    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const newMood: Partial<MoodEntry> = {
        user_id: user.id,
        date: today,
        mood_score: moodScore,
        notes: notes || null,
      }

      const { error } = await supabase
        .from('mood_logs')
        .upsert(newMood, { onConflict: 'user_id,date' })

      if (error) {
        throw error
      }

      toast({
        title: "Mood Logged!",
        description: `Your mood for today (${getMoodDescription(moodScore)}) has been recorded.`,
      })
      setLatestMood({ ...newMood, id: latestMood?.id || 'new' } as MoodEntry) // Update latest mood
      setIsLogging(false)
    } catch (error: any) {
      console.error("Error logging mood:", error)
      toast({
        title: "Error",
        description: `Failed to log mood: ${error.message}`,
        variant: "destructive",
      })
      setIsLogging(false)
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Mood</CardTitle>
        <Smile className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loadingMood ? (
          <div className="text-center text-sm text-muted-foreground">Loading mood...</div>
        ) : latestMood ? (
          <>
            <div className="text-4xl text-center mb-2">{getMoodEmoji(latestMood.mood_score)}</div>
            <div className="text-lg font-bold text-center">{getMoodDescription(latestMood.mood_score)}</div>
            {latestMood.notes && (
              <p className="text-xs text-muted-foreground text-center mt-1 line-clamp-2">
                "{latestMood.notes}"
              </p>
            )}
            <p className="text-xs text-muted-foreground text-center mt-1">
              Last updated: {new Date(latestMood.date).toLocaleDateString()}
            </p>
          </>
        ) : (
          <div className="text-sm text-muted-foreground text-center">No mood logged today.</div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Log Mood
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Your Mood</DialogTitle>
              <DialogDescription>
                Rate your mood for today and add any notes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center gap-4">
                <Frown className="h-6 w-6 text-muted-foreground" />
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[moodScore]}
                  onValueChange={(val) => setMoodScore(val[0])}
                  className="w-[60%]"
                  disabled={isLogging}
                />
                <Smile className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center text-xl font-bold">
                {getMoodEmoji(moodScore)} {getMoodDescription(moodScore)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mood-notes">Notes (Optional)</Label>
                <Textarea
                  id="mood-notes"
                  placeholder="What made you feel this way today?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isLogging}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleLogMood} disabled={isLogging}>
                {isLogging ? "Logging..." : "Save Mood"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
