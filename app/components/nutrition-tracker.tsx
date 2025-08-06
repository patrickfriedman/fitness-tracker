"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Utensils, Trash2 } from 'lucide-react'

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function NutritionTracker() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: ""
  })

  const dailyGoals = {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 75
  }

  const totals = foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const addFood = () => {
    if (newFood.name && newFood.calories) {
      const food: FoodItem = {
        id: Date.now().toString(),
        name: newFood.name,
        calories: parseInt(newFood.calories) || 0,
        protein: parseInt(newFood.protein) || 0,
        carbs: parseInt(newFood.carbs) || 0,
        fat: parseInt(newFood.fat) || 0
      }
      setFoods(prev => [...prev, food])
      setNewFood({ name: "", calories: "", protein: "", carbs: "", fat: "" })
    }
  }

  const removeFood = (id: string) => {
    setFoods(prev => prev.filter(food => food.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Utensils className="h-5 w-5" />
          <span>Nutrition Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Calories", value: totals.calories, goal: dailyGoals.calories, unit: "kcal" },
            { label: "Protein", value: totals.protein, goal: dailyGoals.protein, unit: "g" },
            { label: "Carbs", value: totals.carbs, goal: dailyGoals.carbs, unit: "g" },
            { label: "Fat", value: totals.fat, goal: dailyGoals.fat, unit: "g" }
          ].map((macro) => (
            <div key={macro.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{macro.label}</span>
                <span>{macro.value}/{macro.goal}{macro.unit}</span>
              </div>
              <Progress value={(macro.value / macro.goal) * 100} className="h-2" />
            </div>
          ))}
        </div>

        {/* Add Food Form */}
        <div className="border rounded-lg p-4 space-y-4">
          <h4 className="font-medium">Add Food</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="food-name">Food Name</Label>
              <Input
                id="food-name"
                placeholder="e.g., Chicken Breast"
                value={newFood.name}
                onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="200"
                value={newFood.calories}
                onChange={(e) => setNewFood(prev => ({ ...prev, calories: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="25"
                value={newFood.protein}
                onChange={(e) => setNewFood(prev => ({ ...prev, protein: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="10"
                value={newFood.carbs}
                onChange={(e) => setNewFood(prev => ({ ...prev, carbs: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="5"
                value={newFood.fat}
                onChange={(e) => setNewFood(prev => ({ ...prev, fat: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={addFood} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Food
          </Button>
        </div>

        {/* Food List */}
        {foods.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Today's Foods</h4>
            {foods.map((food) => (
              <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{food.name}</p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{food.calories} kcal</span>
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fat}g</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFood(food.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
