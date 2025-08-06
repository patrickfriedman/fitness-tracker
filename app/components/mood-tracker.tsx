"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { MoodLog } from "@/types/fitness"
import { toast } from "@/components/ui/use-toast"
import { Smile, Frown, Meh, Loader2, Save, Pencil } from 'lucide-react'
import { format } from "date-fns"

export function MoodTracker() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [moodScore, setMoodScore] = useState(3) // Default to neutral
  const [moodLogId, setMoodLogId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const fetchMoodLog = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching mood log:', error.message)
        toast({
          title: 'Error',
          description: 'Failed to load mood.',
          variant: 'destructive',
        })
      } else if (data) {
        setMoodScore(data.mood_score)
        setMoodLogId(data.id)
        setIsEditing(false) // If data exists, show as not editing initially
      } else {
        setMoodScore(3) // Reset to default if no log for today
        setMoodLogId(null)
        setIsEditing(true) // If no data, prompt to edit
      }
      setIsLoading(false)
    }

    fetchMoodLog()
  }, [user?.id, supabase, today])

  const handleSaveMood = async () => {
    if (!user?.id) return

    setIsSaving(true)
    const newMoodLog = {
      user_id: user.id,
      date: today,
      mood_score: moodScore,
    }

    let error = null
    let data = null

    if (moodLogId) {
      // Update existing
      const { data: updateData, error: updateError } = await supabase
        .from('mood_logs')
        .update(newMoodLog)
        .eq('id', moodLogId)
        .select()
        .single()
      data = updateData
      error = updateError
    } else {
      // Insert new
      const { data: insertData, error: insertError } = await supabase
        .from('mood_logs')
        .insert(newMoodLog)
        .select()
        .single()
      data = insertData
      error = insertError
    }

    if (error) {
      console.error('Error saving mood log:', error.message)
      toast({
        title: 'Error',
        description: 'Failed to save mood.',
        variant: 'destructive',
      })
    } else if (data) {
      setMoodLogId(data.id)
      toast({
        title: 'Mood Saved',
        description: 'Your mood has been logged!',
      })
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const getMoodIcon = (score: number) => {
    if (score <= 2) return <Frown className="h-8 w-8 text-red-500" />
    if (score === 3) return <Meh className="h-8 w-8 text-yellow-500" />
    return <Smile className="h-8 w-8 text-green-500" />
  }

  const getMoodText = (score: number) => {
    switch (score) {
      case 1: return 'Very Bad'
      case 2: return 'Bad'
      case 3: return 'Neutral'
      case 4: return 'Good'
      case 5: return 'Excellent'
      default: return ''
    }
  }

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Mood Tracker</CardTitle>
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
        <CardTitle className="text-sm font-medium">Mood Tracker</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          <span className="sr-only">{isEditing ? 'Save' : 'Edit'}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Today: {format(new Date(), 'PPP')}</p>
        <div className="flex flex-col items-center justify-center space-y-4">
          {getMoodIcon(moodScore)}
          <div className="text-xl font-bold">{getMoodText(moodScore)}</div>
          <Slider
            min={1}
            max={5}
            step={1}
            value={[moodScore]}
            onValueChange={(val) => setMoodScore(val[0])}
            className="w-full"
            disabled={!isEditing || isSaving}
          />
        </div>
        {isEditing && (
          <Button onClick={handleSaveMood} className="w-full mt-4" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Mood'}
          </Button>
        )}
        {!isEditing && moodLogId && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Mood logged for today.
          </div>
        )}
        {!isEditing && !moodLogId && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            No mood logged for today. Click edit to log your mood.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
