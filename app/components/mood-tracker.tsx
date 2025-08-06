'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { SmileIcon, MehIcon, FrownIcon } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { MoodLog } from '@/types/fitness'

export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState<MoodLog['mood'] | null>(null)
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])

  const handleMoodSelect = (mood: MoodLog['mood']) => {
    setCurrentMood(mood)
  }

  const handleSubmitMood = () => {
    if (currentMood) {
      const newMoodLog: MoodLog = {
        id: Date.now().toString(),
        date: new Date(),
        mood: currentMood,
      }
      setMoodLogs((prev) => [...prev, newMoodLog])
      toast({
        title: 'Mood Logged!',
        description: `You've logged your mood as ${currentMood}.`,
      })
      setCurrentMood(null) // Reset for next entry
    } else {
      toast({
        title: 'No Mood Selected',
        description: 'Please select a mood before logging.',
        variant: 'destructive',
      })
    }
  }

  const latestMood = moodLogs.sort((a, b) => b.date.getTime() - a.date.getTime())[0]

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mood Tracker</CardTitle>
        {latestMood && (
          <p className="text-xs text-muted-foreground">
            Last logged: {latestMood.date.toLocaleDateString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup
            onValueChange={handleMoodSelect}
            value={currentMood || ''}
            className="flex justify-around"
          >
            <div className="flex flex-col items-center space-y-1">
              <RadioGroupItem value="happy" id="happy" className="peer sr-only" />
              <Label
                htmlFor="happy"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <SmileIcon className="mb-3 h-6 w-6" />
                Happy
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <RadioGroupItem value="neutral" id="neutral" className="peer sr-only" />
              <Label
                htmlFor="neutral"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <MehIcon className="mb-3 h-6 w-6" />
                Neutral
              </Label>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <RadioGroupItem value="sad" id="sad" className="peer sr-only" />
              <Label
                htmlFor="sad"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <FrownIcon className="mb-3 h-6 w-6" />
                Sad
              </Label>
            </div>
          </RadioGroup>
          <Button onClick={handleSubmitMood} className="w-full" disabled={!currentMood}>
            Log Mood
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
