'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smile, Frown, Meh, Plus } from 'lucide-react'
import { MoodLog } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

interface MoodTrackerProps {
  logs: MoodLog[]
}

export default function MoodTracker({ logs: initialLogs }: MoodTrackerProps) {
  const { session } = useAuth()
  const [logs, setLogs] = useState<MoodLog[]>(initialLogs)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const moodOptions = [
    { name: 'Happy', icon: Smile, value: 'happy' },
    { name: 'Neutral', icon: Meh, value: 'neutral' },
    { name: 'Sad', icon: Frown, value: 'sad' },
  ]

  const handleLogMood = async () => {
    if (!session?.user || !selectedMood) {
      toast({
        title: 'Error',
        description: 'Please select a mood and log in.',
        variant: 'destructive',
      })
      return
    }

    try {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      const { data, error } = await supabase
        .from('mood_logs')
        .upsert(
          {
            user_id: session.user.id,
            date: today,
            mood: selectedMood,
            notes: notes || null,
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single()

      if (error) throw error

      setLogs((prevLogs) => {
        const existingLogIndex = prevLogs.findIndex(log => log.date === today)
        if (existingLogIndex > -1) {
          const updatedLogs = [...prevLogs]
          updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], mood: selectedMood, notes: notes || null }
          return updatedLogs
        }
        return [...prevLogs, { date: today, mood: selectedMood, notes: notes || null }]
      })

      toast({
        title: 'Mood Logged',
        description: `Your mood for today (${selectedMood}) has been recorded.`,
      })
      setSelectedMood(null)
      setNotes('')
    } catch (error: any) {
      console.error('Error logging mood:', error)
      toast({
        title: 'Error',
        description: `Failed to log mood: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  // Initialize selected mood and notes from logs for today
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = logs.find(log => log.date === today)
    if (todayLog) {
      setSelectedMood(todayLog.mood)
      setNotes(todayLog.notes || '')
    } else {
      setSelectedMood(null)
      setNotes('')
    }
  }, [logs])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mood Tracker</CardTitle>
        <Smile className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-around">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? 'default' : 'outline'}
              size="icon"
              onClick={() => setSelectedMood(mood.value)}
              className="flex flex-col h-auto w-auto p-2"
            >
              <mood.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{mood.name}</span>
            </Button>
          ))}
        </div>
        <Textarea
          placeholder="Any notes about your mood today?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[60px]"
        />
        <Button onClick={handleLogMood} disabled={!selectedMood}>
          <Plus className="h-4 w-4 mr-2" /> Log Mood
        </Button>
      </CardContent>
    </Card>
  )
}
