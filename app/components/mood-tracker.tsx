'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Smile, Frown, Meh, Laugh, Angry } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Database } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'

type MoodLog = Database['public']['Tables']['mood_logs']['Row']

export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()

  const moodOptions = [
    { value: 'terrible', icon: Frown, label: 'Terrible' },
    { value: 'bad', icon: Meh, label: 'Bad' },
    { value: 'neutral', icon: Smile, label: 'Neutral' },
    { value: 'good', icon: Laugh, label: 'Good' },
    { value: 'excellent', icon: Laugh, label: 'Excellent' }, // Using Laugh for excellent too, or find another icon
  ]

  useEffect(() => {
    const fetchMoodLog = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching mood log:', error)
      } else if (data) {
        setCurrentMood(data.mood_level)
      }
    }

    fetchMoodLog()
  }, [supabase])

  const handleMoodSelect = async (mood: string) => {
    setCurrentMood(mood)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('mood_logs')
      .upsert(
        {
          user_id: user.id,
          log_date: today,
          mood_level: mood,
        },
        { onConflict: 'user_id,log_date' }
      )

    if (error) {
      console.error('Error updating mood log:', error)
      toast({
        title: 'Error',
        description: 'Failed to log mood.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Mood Logged',
        description: `Your mood for today (${mood}) has been recorded.`,
      })
    }
  }

  const SelectedMoodIcon = moodOptions.find(m => m.value === currentMood)?.icon || Smile

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">How are you feeling?</CardTitle>
        <SelectedMoodIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-around gap-2">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              variant={currentMood === mood.value ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleMoodSelect(mood.value)}
              className="flex flex-col h-auto w-auto p-2"
            >
              <mood.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{mood.label}</span>
            </Button>
          ))}
        </div>
        {currentMood && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Today's mood: <span className="font-semibold capitalize">{currentMood}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
