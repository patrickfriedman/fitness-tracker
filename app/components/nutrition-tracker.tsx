"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Apple, Target } from 'lucide-react'

export function NutritionTracker() {
  const [isOpen, setIsOpen] = useState(false)
  const [dailyStats, setDailyStats] = useState({
    calories: 1450,
    protein: 85,
    carbs: 120,
    fat: 45
  })
  const [newEntry, setNewEntry] = useState({
    food: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  })

  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  }

  const handleAddEntry = () => {
    if (newEntry.food && newEntry.calories) {
      setDailyStats(prev => ({
        calories: prev.calories + parseInt(newEntry.calories),
        protein: prev.protein + (parseInt(newEntry.protein) || 0),
        carbs: prev.carbs + (parseInt(newEntry.carbs) || 0),
        fat: prev.fat + (parseInt(newEntry.fat) || 0)
      }))
      setNewEntry({ food: "", calories: "", protein: "", carbs: "", fat: "" })
      setIsOpen(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Apple className="mr-2 h-5 w-5" />
          Nutrition Tracker
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="food">Food Item</Label>
                <Input
                  id="food"
                  placeholder="e.g., Chicken Breast"
                  value={newEntry.food}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, food: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="250"
                    value={newEntry.calories}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, calories: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="25"
                    value={newEntry.protein}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, protein: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="10"
                    value={newEntry.carbs}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, carbs: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    placeholder="5"
                    value={newEntry.fat}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, fat: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleAddEntry} className="w-full">
                Add Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Calories</span>
              <span className="text-sm text-gray-600">
                {dailyStats.calories}/{goals.calories}
              </span>
            </div>
            <Progress value={(dailyStats.calories / goals.calories) * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Protein</span>
              <span className="text-sm text-gray-600">
                {dailyStats.protein}g/{goals.protein}g
              </span>
            </div>
            <Progress value={(dailyStats.protein / goals.protein) * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Carbs</span>
              <span className="text-sm text-gray-600">
                {dailyStats.carbs}g/{goals.carbs}g
              </span>
            </div>
            <Progress value={(dailyStats.carbs / goals.carbs) * 100} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fat</span>
              <span className="text-sm text-gray-600">
                {dailyStats.fat}g/{goals.fat}g
              </span>
            </div>
            <Progress value={(dailyStats.fat / goals.fat) * 100} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
