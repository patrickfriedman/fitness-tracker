'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createMoodLog } from '@/app/actions/mood-actions'

export default function MoodTracker() {
  const [mood, setMood] = useState<string>('')
  const { toast } = useToast()

  const handleMoodChange = (value: string) => {
    setMood(value)
  }

  const handleSubmit = async () => {
    if (!mood) {
      toast({
        title: 'Error!',
        description: 'Please select a mood before saving.',
        variant: 'destructive',
      })
      return
    }

    const result = await createMoodLog(mood)

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Mood logged successfully.',
      })
      setMood('') // Reset mood after successful submission
    } else {
      toast({
        title: 'Error!',
        description: result.error || 'Failed to log mood.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">How are you feeling today?</p>
        <RadioGroup onValueChange={handleMoodChange} value={mood} className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="great" id="mood-great" />
            <Label htmlFor="mood-great">😊 Great</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="good" id="mood-good" />
            <Label htmlFor="mood-good">🙂 Good</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="neutral" id="mood-neutral" />
            <Label htmlFor="mood-neutral">😐 Neutral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bad" id="mood-bad" />
            <Label htmlFor="mood-bad">🙁 Bad</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="terrible" id="mood-terrible" />
            <Label htmlFor="mood-terrible">😞 Terrible</Label>
          </div>
        </RadioGroup>
        <Button onClick={handleSubmit} className="w-full">
          Log Mood
        </Button>
      </CardContent>
    </Card>
  )
}
