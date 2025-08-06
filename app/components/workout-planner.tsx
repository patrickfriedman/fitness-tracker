'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

// Define a type for planned workouts (similar to WorkoutLog but for future)
interface PlannedWorkout {
  id: string;
  user_id: string;
  date: string; // ISO date string for planned date
  name: string;
  notes?: string;
  // Could add planned exercises here too
}

export default function WorkoutPlanner() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [plannedWorkouts, setPlannedWorkouts] = useState<PlannedWorkout[]>([])
  const [loadingPlans, setLoadingPlans] = useState(true)

  const [workoutName, setWorkoutName] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState("")
  const [isPlanning, setIsPlanning] = useState(false)

  useState(() => {
    const fetchPlannedWorkouts = async () => {
      if (!user) return
      setLoadingPlans(true)
      const { data, error } = await supabase
        .from('planned_workouts') // Assuming a 'planned_workouts' table
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date().toISOString().split('T')[0]) // Only future/today plans
        .order('date', { ascending: true })

      if (error) {
        console.error("Error fetching planned workouts:", error)
        toast({
          title: "Error",
          description: "Failed to load workout plans.",
          variant: "destructive",
        })
      } else {
        setPlannedWorkouts(data as PlannedWorkout[])
      }
      setLoadingPlans(false)
    }
    fetchPlannedWorkouts()
  }, [user])

  const handlePlanWorkout = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to plan workouts.",
        variant: "destructive",
      })
      return
    }
    if (!workoutName || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please enter workout name and select a date.",
        variant: "destructive",
      })
      return
    }

    setIsPlanning(true)
    try {
      const newPlan: Partial<PlannedWorkout> = {
        user_id: user.id,
        date: selectedDate.toISOString().split('T')[0],
        name: workoutName,
        notes: notes || null,
      }

      const { data, error } = await supabase
        .from('planned_workouts')
        .insert(newPlan)
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Workout Planned!",
        description: `"${workoutName}" planned for ${format(selectedDate, "PPP")}.`,
      })
      setWorkoutName("")
      setSelectedDate(undefined)
      setNotes("")
      setIsPlanning(false)
      setPlannedWorkouts((prev) => [...prev, data[0] as PlannedWorkout].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    } catch (error: any) {
      console.error("Error planning workout:", error)
      toast({
        title: "Error",
        description: `Failed to plan workout: ${error.message}`,
        variant: "destructive",
      })
      setIsPlanning(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    if (!user) return
    try {
      const { error } = await supabase
        .from('planned_workouts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user owns the plan

      if (error) {
        throw error
      }
      toast({
        title: "Plan Deleted",
        description: "Workout plan successfully removed.",
      })
      setPlannedWorkouts(plannedWorkouts.filter(plan => plan.id !== id))
    } catch (error: any) {
      console.error("Error deleting plan:", error)
      toast({
        title: "Error",
        description: `Failed to delete plan: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Workout Planner</CardTitle>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loadingPlans ? (
          <div className="text-center text-sm text-muted-foreground">Loading plans...</div>
        ) : plannedWorkouts.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Upcoming Workouts:</h3>
            {plannedWorkouts.map((plan) => (
              <div key={plan.id} className="flex justify-between items-center border-b pb-2 mb-2 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium">{plan.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(plan.date), "PPP")}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)} disabled={isPlanning}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mb-4">No upcoming workouts planned.</div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Plan New Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Plan New Workout</DialogTitle>
              <DialogDescription>
                Schedule a workout for a future date.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="plan-name">Workout Name</Label>
                <Input
                  id="plan-name"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  placeholder="e.g., Leg Day"
                  disabled={isPlanning}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                      disabled={isPlanning}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()} // Disable past dates
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-notes">Notes (Optional)</Label>
                <Input
                  id="plan-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Focus on heavy lifts"
                  disabled={isPlanning}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handlePlanWorkout} disabled={isPlanning}>
                {isPlanning ? "Planning..." : "Save Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
