"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Plus, Apple, Utensils } from 'lucide-react'

interface NutritionEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  date: string
}

interface DailyGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function NutritionTracker() {
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  })

  const goals: DailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  }

  useEffect(() => {
    const stored = localStorage.getItem("fitness-nutrition")
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  const handleSaveEntry = () => {
    const entry: NutritionEntry = {
      id: Date.now().toString(),
      name: newEntry.name,
      calories: parseInt(newEntry.calories) || 0,
      protein: parseInt(newEntry.protein) || 0,
      carbs: parseInt(newEntry.carbs) || 0,
      fat: parseInt(newEntry.fat) || 0,
      date: new Date().toISOString()
    }

    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem("fitness-nutrition", JSON.stringify(updated))
    
    setNewEntry({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: ""
    })
    setIsOpen(false)
  }

  // Calculate today's totals
  const today = new Date().toDateString()
  const todayEntries = entries.filter(entry => 
    new Date(entry.date).toDateString() === today
  )

  const totals = todayEntries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + entry.protein,
    carbs: acc.carbs + entry.carbs,
    fat: acc.fat + entry.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Today's Nutrition</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Food Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="food-name">Food Name</Label>
                  <Input
                    id="food-name"
                    value={newEntry.name}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Chicken Breast"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newEntry.calories}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={newEntry.protein}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={newEntry.carbs}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, carbs: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={newEntry.fat}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, fat: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveEntry} className="w-full">
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Calories</span>
                <span>{totals.calories} / {goals.calories}</span>
              </div>
              <Progress value={(totals.calories / goals.calories) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Protein</span>
                <span>{totals.protein}g / {goals.protein}g</span>
              </div>
              <Progress value={(totals.protein / goals.protein) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carbs</span>
                <span>{totals.carbs}g / {goals.carbs}g</span>
              </div>
              <Progress value={(totals.carbs / goals.carbs) * 100} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fat</span>
                <span>{totals.fat}g / {goals.fat}g</span>
              </div>
              <Progress value={(totals.fat / goals.fat) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Apple className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-gray-500">
                        {entry.calories} cal • {entry.protein}g protein
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No meals logged today</p>
              <p className="text-gray-400 text-sm">Start tracking your nutrition</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
