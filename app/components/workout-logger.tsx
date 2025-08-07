'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createWorkoutLog } from '@/app/actions/workout-actions'

export default function WorkoutLogger() {
  const [workoutType, setWorkoutType] = useState('')
  const [duration, setDuration] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [notes, setNotes] = useState('')
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!workoutType || !duration) {
      toast({
        title: 'Error!',
        description: 'Workout type and duration are required.',
        variant: 'destructive',
      })
      return
    }

    const result = await createWorkoutLog({
      workout_type: workoutType,
      duration_minutes: parseInt(duration),
      calories_burned: caloriesBurned ? parseInt(caloriesBurned) : undefined,
      notes: notes || undefined,
    })

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Workout logged successfully.',
      })
      setWorkoutType('')
      setDuration('')
      setCaloriesBurned('')
      setNotes('')
    } else {
      toast({
        title: 'Error!',
        description: result.error || 'Failed to log workout.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Workout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700">
            Workout Type
          </label>
          <Input
            id="workoutType"
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="e.g., Running, Weightlifting"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 60"
          />
        </div>
        <div>
          <label htmlFor="caloriesBurned" className="block text-sm font-medium text-gray-700">
            Calories Burned (optional)
          </label>
          <Input
            id="caloriesBurned"
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
            placeholder="e.g., 300"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Felt great today!"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Log Workout
        </Button>
      </CardContent>
    </Card>
  )
}
