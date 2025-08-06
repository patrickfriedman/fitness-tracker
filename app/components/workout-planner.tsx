"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { CalendarPlus, Edit, Trash2 } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { PlannedWorkout } from "@/types/fitness"
import { format, isSameDay, parseISO } from "date-fns"

export function WorkoutPlanner() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentWorkout, setCurrentWorkout] = useState<PlannedWorkout | null>(null)

  const [workoutName, setWorkoutName] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (user?.id && selectedDate) {
      fetchPlannedWorkouts(selectedDate)
    }
  }, [user?.id, selectedDate])

  const fetchPlannedWorkouts = async (date: Date) => {
    if (!user?.id) return

    setLoading(true)
    try {
      const dateString = format(date, 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('planned_workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateString)
        .order('created_at', { ascending: true })

      if (error) throw error

      setPlannedWorkouts(data as PlannedWorkout[])
    } catch (error: any) {
      console.error("Error fetching planned workouts:", error.message)
      toast({
        title: "Error",
        description: "Failed to load planned workouts.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setWorkoutName("")
    setNotes("")
    setCurrentWorkout(null)
  }

  const handleOpenDialog = (workout?: PlannedWorkout) => {
    if (workout) {
      setCurrentWorkout(workout)
      setWorkoutName(workout.name)
      setNotes(workout.notes || "")
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !selectedDate) return

    setLoading(true)
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd')
      const workoutData = {
        user_id: user.id,
        date: dateString,
        name: workoutName,
        notes: notes || null,
      }

      let error = null
      if (currentWorkout) {
        const { error: updateError } = await supabase
          .from('planned_workouts')
          .update(workoutData)
          .eq('id', currentWorkout.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('planned_workouts')
          .insert(workoutData)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Success",
        description: `Workout ${currentWorkout ? 'updated' : 'planned'} successfully!`,
      })
      setIsDialogOpen(false)
      fetchPlannedWorkouts(selectedDate) // Re-fetch to update the display
    } catch (error: any) {
      console.error("Error saving planned workout:", error.message)
      toast({
        title: "Error",
        description: "Failed to save planned workout.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (workoutId: string) => {
    if (!user?.id || !selectedDate) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('planned_workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Planned workout deleted.",
      })
      fetchPlannedWorkouts(selectedDate)
    } catch (error: any) {
      console.error("Error deleting planned workout:", error.message)
      toast({
        title: "Error",
        description: "Failed to delete planned workout.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Planner</CardTitle>
        <CalendarPlus className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border w-full"
        />
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">
            Workouts for {selectedDate ? format(selectedDate, 'PPP') : 'Selected Date'}
          </h3>
          {loading ? (
            <div className="text-center py-2">Loading...</div>
          ) : plannedWorkouts.length > 0 ? (
            <ul className="space-y-2">
              {plannedWorkouts.map((workout) => (
                <li key={workout.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div>
                    <p className="font-medium">{workout.name}</p>
                    {workout.notes && <p className="text-sm text-muted-foreground">{workout.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(workout)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(workout.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No workouts planned for this day.</p>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4 w-full" onClick={() => handleOpenDialog()}>
                <CalendarPlus className="mr-2 h-4 w-4" /> Plan New Workout
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{currentWorkout ? "Edit Planned Workout" : "Plan New Workout"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="workout-name">Workout Name</Label>
                  <Input id="workout-name" value={workoutName} onChange={(e) => setWorkoutName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Focus on strength, light cardio" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : (currentWorkout ? "Save Changes" : "Plan Workout")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
