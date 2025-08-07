"use client"

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MoodLog } from '@/types/fitness'
import { addMoodLog } from '@/app/actions/mood-actions'
import { useToast } from '@/hooks/use-toast'
import { Smile, Meh, Frown, Angry, Laugh } from 'lucide-react'
import { cn } from '@/lib/utils'

const moodOptions = [
  { rating: 1, icon: Frown, label: 'Awful', color: 'text-red-500' },
  { rating: 2, icon: Meh, label: 'Bad', color: 'text-orange-500' },
  { rating: 3, icon: Smile, label: 'Okay', color: 'text-yellow-500' },
  { rating: 4, icon: Laugh, label: 'Good', color: 'text-green-500' },
  { rating: 5, icon: Laugh, label: 'Great', color: 'text-blue-500' }, // Using Laugh for Great too, or could add another icon
]

export default function MoodTracker({ initialMoodLogs }: { initialMoodLogs: MoodLog[] }) {
  const [moodRating, setMoodRating] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const latestMood = initialMoodLogs.length > 0 ? initialMoodLogs[0] : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (moodRating === null) {
      toast({
        title: 'Input Error',
        description: 'Please select your mood rating.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const newMoodLog: Omit<MoodLog, 'id' | 'user_id' | 'log_date' | 'created_at'> = {
      mood_rating: moodRating,
      notes: notes || null,
    }

    const { success, message } = await addMoodLog(newMoodLog)

    if (success) {
      toast({
        title: 'Success',
        description: message,
      })
      setMoodRating(null)
      setNotes('')
    } else {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestMood && (
          <div className="text-sm text-muted-foreground">
            <p>Last logged: {new Date(latestMood.log_date).toLocaleDateString()}</p>
            <p>Mood: {moodOptions.find(m => m.rating === latestMood.mood_rating)?.label}</p>
            {latestMood.notes && <p>Notes: {latestMood.notes}</p>}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label>How are you feeling today?</Label>
            <div className="flex justify-around gap-2">
              {moodOptions.map((mood) => (
                <Button
                  key={mood.rating}
                  type="button"
                  variant={moodRating === mood.rating ? 'default' : 'outline'}
                  size="icon"
                  className={cn(
                    'flex flex-col h-auto w-auto p-2',
                    moodRating === mood.rating ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
                  )}
                  onClick={() => setMoodRating(mood.rating)}
                  disabled={loading}
                >
                  <mood.icon className={cn('h-6 w-6', mood.color)} />
                  <span className="text-xs mt-1">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="moodNotes">Notes (optional)</Label>
            <Textarea
              id="moodNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any thoughts or reasons for your mood?"
              rows={3}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || moodRating === null}>
            {loading ? 'Logging...' : 'Log Mood'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
