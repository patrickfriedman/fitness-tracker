"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Apple, Zap, Beef } from 'lucide-react'

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
}

interface DailyNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export function NutritionTracker() {
  const [dailyNutrition, setDailyNutrition] = useState<DailyNutrition>({
    calories: 1450,
    protein: 120,
    carbs: 180,
    fat: 45,
  })

  const goals = {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 75,
  }

  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    serving: "",
  })

  const commonFoods = [
    { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
    { name: "Brown Rice", calories: 112, protein: 2.6, carbs: 23, fat: 0.9, serving: "100g" },
    { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: "1 medium" },
    { name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: "100g" },
  ]

  const addFood = (food?: typeof commonFoods[0]) => {
    const foodToAdd = food || {
      name: newFood.name,
      calories: parseFloat(newFood.calories),
      protein: parseFloat(newFood.protein),
      carbs: parseFloat(newFood.carbs),
      fat: parseFloat(newFood.fat),
      serving: newFood.serving,
    }

    setDailyNutrition(prev => ({
      calories: prev.calories + foodToAdd.calories,
      protein: prev.protein + foodToAdd.protein,
      carbs: prev.carbs + foodToAdd.carbs,
      fat: prev.fat + foodToAdd.fat,
    }))

    if (!food) {
      setNewFood({ name: "", calories: "", protein: "", carbs: "", fat: "", serving: "" })
    }
  }

  const MacroCard = ({ 
    title, 
    current, 
    goal, 
    unit, 
    icon: Icon, 
    color 
  }: { 
    title: string
    current: number
    goal: number
    unit: string
    icon: any
    color: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className="text-sm text-gray-500">
          {Math.round(current)}/{goal}{unit}
        </span>
      </div>
      <Progress value={(current / goal) * 100} className="h-2" />
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <Apple className="h-5 w-5 mr-2" />
          Nutrition Tracker
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Food Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium">Quick Add</h4>
                <div className="grid grid-cols-2 gap-2">
                  {commonFoods.map((food, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addFood(food)}
                      className="justify-start h-auto p-2"
                    >
                      <div className="text-left">
                        <div className="font-medium text-xs">{food.name}</div>
                        <div className="text-xs text-gray-500">{food.calories} cal</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium">Custom Food</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="foodName">Food Name</Label>
                    <Input
                      id="foodName"
                      placeholder="e.g., Oatmeal"
                      value={newFood.name}
                      onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serving">Serving Size</Label>
                    <Input
                      id="serving"
                      placeholder="e.g., 1 cup"
                      value={newFood.serving}
                      onChange={(e) => setNewFood(prev => ({ ...prev, serving: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="300"
                      value={newFood.calories}
                      onChange={(e) => setNewFood(prev => ({ ...prev, calories: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="10"
                      value={newFood.protein}
                      onChange={(e) => setNewFood(prev => ({ ...prev, protein: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="50"
                      value={newFood.carbs}
                      onChange={(e) => setNewFood(prev => ({ ...prev, carbs: e.target.value }))}
                    />
                  </div>
                  <div>
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
                <Button 
                  onClick={() => addFood()} 
                  className="w-full"
                  disabled={!newFood.name || !newFood.calories}
                >
                  Add Food
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(dailyNutrition.calories)}
          </div>
          <div className="text-sm text-gray-500">
            of {goals.calories} calories
          </div>
        </div>
        
        <div className="space-y-3">
          <MacroCard
            title="Protein"
            current={dailyNutrition.protein}
            goal={goals.protein}
            unit="g"
            icon={Beef}
            color="text-red-600"
          />
          <MacroCard
            title="Carbs"
            current={dailyNutrition.carbs}
            goal={goals.carbs}
            unit="g"
            icon={Apple}
            color="text-green-600"
          />
          <MacroCard
            title="Fat"
            current={dailyNutrition.fat}
            goal={goals.fat}
            unit="g"
            icon={Zap}
            color="text-yellow-600"
          />
        </div>
      </CardContent>
    </Card>
  )
}
