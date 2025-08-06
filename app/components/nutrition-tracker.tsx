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
  date: string
  meal: string
  food: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function NutritionTracker() {
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    meal: "breakfast",
    food: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  })

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  }

  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`nutrition-${today}`)
    if (stored) {
      setEntries(JSON.parse(stored))
    }
  }, [])

  const handleSave = () => {
    const entry: NutritionEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      meal: newEntry.meal,
      food: newEntry.food,
      calories: parseInt(newEntry.calories) || 0,
      protein: parseInt(newEntry.protein) || 0,
      carbs: parseInt(newEntry.carbs) || 0,
      fat: parseInt(newEntry.fat) || 0,
    }

    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)
    
    const today = new Date().toDateString()
    localStorage.setItem(`nutrition-${today}`, JSON.stringify(updatedEntries))
    
    setNewEntry({
      meal: "breakfast",
      food: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    })
    setIsOpen(false)
  }

  const todayTotals = entries.reduce(
    (totals, entry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + entry.protein,
      carbs: totals.carbs + entry.carbs,
      fat: totals.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Daily Nutrition</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Food</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meal">Meal</Label>
                  <select
                    id="meal"
                    value={newEntry.meal}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, meal: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="food">Food Item</Label>
                  <Input
                    id="food"
                    value={newEntry.food}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, food: e.target.value }))}
                    placeholder="e.g., Chicken Breast, Rice"
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
                      placeholder="300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      value={newEntry.protein}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      value={newEntry.carbs}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, carbs: e.target.value }))}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      value={newEntry.fat}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, fat: e.target.value }))}
                      placeholder="10"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSave} 
                  className="w-full"
                  disabled={!newEntry.food}
                >
                  Add Food
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories</span>
                  <span>{todayTotals.calories}/{dailyGoals.calories}</span>
                </div>
                <Progress value={(todayTotals.calories / dailyGoals.calories) * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{todayTotals.protein}g/{dailyGoals.protein}g</span>
                </div>
                <Progress value={(todayTotals.protein / dailyGoals.protein) * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbs</span>
                  <span>{todayTotals.carbs}g/{dailyGoals.carbs}g</span>
                </div>
                <Progress value={(todayTotals.carbs / dailyGoals.carbs) * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fat</span>
                  <span>{todayTotals.fat}g/{dailyGoals.fat}g</span>
                </div>
                <Progress value={(todayTotals.fat / dailyGoals.fat) * 100} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Today's Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-medium capitalize">{entry.meal}</h3>
                      <p className="text-sm text-gray-600">{entry.food}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{entry.calories} cal</div>
                      <div className="text-gray-500">
                        P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Apple className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-3">No meals logged today</p>
              <Button size="sm" onClick={() => setIsOpen(true)}>
                <Utensils className="h-4 w-4 mr-1" />
                Log First Meal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
