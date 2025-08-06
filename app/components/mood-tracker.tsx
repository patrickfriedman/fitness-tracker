'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Smile, Meh, Frown } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { MoodLog } from '@/types/fitness'

export default function MoodTracker() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [mood, setMood] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    const fetchMoodLog = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('mood_logs')
        .select('mood_score')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching mood log:', error)
        toast({
          title: 'Error',
          description: 'Failed to load mood.',
          variant: 'destructive',
        })
      } else if (data) {
        setMood(data.mood_score)
      }
      setIsLoading(false)
    }

    fetchMoodLog()
  }, [user, supabase, today, toast])

  const handleMoodSelect = async (score: number) => {
    if (!user?.id || user.id === 'demo-user-123') {
      toast({
        title: 'Demo Mode',
        description: 'Mood cannot be saved in demo mode.',
      })
      return
    }

    setIsSaving(true)
    const { error } = await supabase
      .from('mood_logs')
      .upsert(
        {
          user_id: user.id,
          date: today,
          mood_score: score,
        },
        { onConflict: 'user_id,date' }
      )

    if (error) {
      console.error('Error saving mood:', error)
      toast({
        title: 'Error',
        description: 'Failed to save mood.',
        variant: 'destructive',
      })
    } else {
      setMood(score)
      toast({
        title: 'Success',
        description: 'Mood saved!',
      })
    }
    setIsSaving(false)
  }

  const getMoodIcon = (score: number | null) => {
    if (score === null) return null
    if (score >= 4) return <Smile className="h-8 w-8 text-green-500" />
    if (score >= 2) return <Meh className="h-8 w-8 text-yellow-500" />
    return <Frown className="h-8 w-8 text-red-500" />
  }

  if (isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>How are you feeling?</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="flex justify-center space-x-4">
          {[1, 2, 3, 4, 5].map((score) => (
            <Button
              key={score}
              variant={mood === score ? 'default' : 'outline'}
              size="icon"
              onClick={() => handleMoodSelect(score)}
              disabled={isSaving}
              className="h-12 w-12 text-lg"
            >
              {score}
            </Button>
          ))}
        </div>
        {mood !== null && (
          <div className="flex items-center justify-center space-x-2">
            {getMoodIcon(mood)}
            <p className="text-lg font-semibold">
              You rated your mood as {mood}/5.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
