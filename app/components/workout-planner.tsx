"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Plus, Clock } from 'lucide-react'

export function WorkoutPlanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [plannedWorkouts, setPlannedWorkouts] = useState([
    { id: 1, name: "Upper Body", date: "2024-01-16", time: "09:00", type: "Strength" },
    { id: 2, name: "Cardio Session", date: "2024-01-17", time: "18:00", type: "Cardio" },
    { id: 3, name: "Leg Day", date: "2024-01-18", time: "10:00", type: "Strength" }
  ])
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    date: "",
    time: "",
    type: ""
  })

  const handleAddWorkout = () => {
    if (newWorkout.name && newWorkout.date && newWorkout.time) {
      const workout = {
        id: Date.now(),
        ...newWorkout
      }
      setPlannedWorkouts(prev => [...prev, workout].sort((a, b) => 
        new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
      ))
      setNewWorkout({ name: "", date: "", time: "", type: "" })
      setIsOpen(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Workout Planner
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Plan Workout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Plan New Workout</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workout-name">Workout Name</Label>
                <Input
                  id="workout-name"
                  placeholder="e.g., Upper Body, Cardio"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workout-date">Date</Label>
                  <Input
                    id="workout-date"
                    type="date"
                    value={newWorkout.date}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="workout-time">Time</Label>
                  <Input
                    id="workout-time"
                    type="time"
                    value={newWorkout.time}
                    onChange={(e) => setNewWorkout(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="workout-type">Type</Label>
                <Select value={newWorkout.type} onValueChange={(value) => setNewWorkout(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strength">Strength Training</SelectItem>
                    <SelectItem value="Cardio">Cardio</SelectItem>
                    <SelectItem value="Flexibility">Flexibility</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddWorkout} className="w-full">
                Schedule Workout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">Upcoming Workouts</h3>
          {plannedWorkouts.map((workout) => (
            <div key={workout.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-sm">{workout.name}</p>
                <p className="text-xs text-gray-500">{formatDate(workout.date)}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-3 w-3" />
                  {workout.time}
                </div>
                <p className="text-xs text-gray-500">{workout.type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
