'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { MoodLog } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Smile, Meh, Frown } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function MoodTracker() {
  const { user } = useAuth()
  const [moodScore, setMoodScore] = useState<number>(3) // Default to neutral
  const [notes, setNotes] = useState<string>('')
  const [currentMoodLog, setCurrentMoodLog] = useState<MoodLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = getBrowserClient()

  const fetchMoodLog = async () => {
    if (!user?.id) return
    setLoading(true)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching mood log:', error)
      toast({
        title: 'Error',
        description: 'Failed to load daily mood.',
        variant: 'destructive',
      })
    } else if (data) {
      setCurrentMoodLog(data as MoodLog)
      setMoodScore(data.mood_score)
      setNotes(data.notes || '')
    } else {
      setCurrentMoodLog(null)
      setMoodScore(3) // Reset to default if no log for today
      setNotes('')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMoodLog()
  }, [user])

  const handleSaveMood = async () => {
    if (!user?.id) return
    setIsSaving(true)
    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('mood_logs')
      .upsert(
        {
          user_id: user.id,
          date: today,
          mood_score: moodScore,
          notes: notes || null,
        },
        { onConflict: 'user_id,date' }
      )

    if (error) {
      console.error('Error saving mood log:', error)
      toast({
        title: 'Error',
        description: 'Failed to save your mood.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Mood Saved',
        description: 'Your daily mood has been recorded.',
      })
      fetchMoodLog() // Refresh data
    }
    setIsSaving(false)
  }

  const getMoodIcon = (score: number) => {
    if (score >= 4) return <Smile className="h-8 w-8 text-green-500" />
    if (score === 3) return <Meh className="h-8 w-8 text-yellow-500" />
    return <Frown className="h-8 w-8 text-red-500" />
  }

  return (
    <Card className="widget-card">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Daily Mood</CardTitle>
      </CardHeader>
      <CardContent className="widget-content space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-2">
              {getMoodIcon(moodScore)}
              <p className="text-lg font-semibold">
                {moodScore === 1 && 'Very Bad'}
                {moodScore === 2 && 'Bad'}
                {moodScore === 3 && 'Neutral'}
                {moodScore === 4 && 'Good'}
                {moodScore === 5 && 'Excellent'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood-slider">How are you feeling today?</Label>
              <Slider
                id="mood-slider"
                min={1}
                max={5}
                step={1}
                value={[moodScore]}
                onValueChange={(val) => setMoodScore(val[0])}
                className="w-full"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood-notes">Notes (optional)</Label>
              <Textarea
                id="mood-notes"
                placeholder="Any thoughts or reasons for your mood?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <Button onClick={handleSaveMood} className="w-full" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Mood'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
