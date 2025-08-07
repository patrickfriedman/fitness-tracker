'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createPlannedWorkout } from '@/app/actions/workout-actions'

export default function WorkoutPlanner() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [workoutName, setWorkoutName] = useState('')
  const [duration, setDuration] = useState('')
  const { toast } = useToast()

  const handlePlanWorkout = async () => {
    if (!date || !workoutName || !duration) {
      toast({
        title: 'Error!',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      })
      return
    }

    const result = await createPlannedWorkout({
      workout_name: workoutName,
      planned_date: date.toISOString().split('T')[0], // Format to YYYY-MM-DD
      duration_minutes: parseInt(duration),
    })

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Workout planned successfully.',
      })
      setWorkoutName('')
      setDuration('')
      setDate(new Date()) // Reset date to today
    } else {
      toast({
        title: 'Error!',
        description: result.error || 'Failed to plan workout.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="workoutName">Workout Name</Label>
          <Input
            id="workoutName"
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Leg Day, Cardio"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 45"
          />
        </div>
        <div>
          <Label htmlFor="plannedDate">Planned Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'
                  }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handlePlanWorkout} className="w-full">
          Plan Workout
        </Button>
      </CardContent>
    </Card>
  )
}
