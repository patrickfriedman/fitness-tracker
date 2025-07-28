"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Apple, Plus, Search, Utensils, Target, Check, X, Trash2 } from "lucide-react"
import type { NutritionLog, FoodItem } from "../../types/fitness"

interface NutritionTrackerProps {
  userId: string
}

interface MealPlanItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: "breakfast" | "lunch" | "dinner" | "snacks"
}

const commonFoods: FoodItem[] = [
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: "1 medium" },
  { name: "Chicken Breast", calories: 231, protein: 43.5, carbs: 0, fat: 5, serving: "100g" },
  { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: "1 cup cooked" },
  { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0, serving: "170g" },
  { name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, serving: "28g (24 nuts)" },
  { name: "Oatmeal", calories: 154, protein: 5, carbs: 28, fat: 3, serving: "1 cup cooked" },
  { name: "Eggs", calories: 155, protein: 13, carbs: 1, fat: 11, serving: "2 large" },
  { name: "Salmon", calories: 206, protein: 22, carbs: 0, fat: 12, serving: "100g" },
  { name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0.1, serving: "1 medium" },
  { name: "Avocado", calories: 234, protein: 3, carbs: 12, fat: 21, serving: "1 medium" },
]

export function NutritionTracker({ userId }: NutritionTrackerProps) {
  const [todayLog, setTodayLog] = useState<NutritionLog>({
    userId,
    date: new Date().toISOString().split("T")[0],
    caloriesConsumed: 1250,
    calorieLimit: 2200,
    protein: 85,
    carbs: 140,
    fat: 45,
    fiber: 25,
    sugar: 35,
    sodium: 1800,
    meals: [],
    waterIntake: 32,
    waterGoal: 64,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [tempCalorieGoal, setTempCalorieGoal] = useState(todayLog.calorieLimit.toString())
  const [customFoods, setCustomFoods] = useState<FoodItem[]>([])
  const [isAddingCustomFood, setIsAddingCustomFood] = useState(false)
  const [newCustomFood, setNewCustomFood] = useState<FoodItem>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving: "",
  })

  // Meal planning state
  const [mealPlan, setMealPlan] = useState<MealPlanItem[]>([])
  const [isAddingToMealPlan, setIsAddingToMealPlan] = useState<string | null>(null)

  const allFoods = [...commonFoods, ...customFoods]
  const filteredFoods = allFoods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const addFood = (food: FoodItem) => {
    setTodayLog((prev) => ({
      ...prev,
      caloriesConsumed: prev.caloriesConsumed + food.calories,
      protein: prev.protein + food.protein,
      carbs: prev.carbs + food.carbs,
      fat: prev.fat + food.fat,
    }))
  }

  const addCustomFood = () => {
    if (newCustomFood.name && newCustomFood.calories > 0) {
      setCustomFoods((prev) => [...prev, newCustomFood])
      setNewCustomFood({
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        serving: "",
      })
      setIsAddingCustomFood(false)
    }
  }

  const addToMealPlan = (food: FoodItem, mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
    const newMealItem: MealPlanItem = {
      id: `meal-${Date.now()}`,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      mealType,
    }
    setMealPlan((prev) => [...prev, newMealItem])
    setIsAddingToMealPlan(null)
  }

  const removeMealPlanItem = (id: string) => {
    setMealPlan((prev) => prev.filter((item) => item.id !== id))
  }

  const getMealPlanByType = (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
    return mealPlan.filter((item) => item.mealType === mealType)
  }

  const handleGoalSave = () => {
    const newGoal = Number.parseFloat(tempCalorieGoal)
    if (newGoal > 0) {
      setTodayLog((prev) => ({
        ...prev,
        calorieLimit: newGoal,
      }))
      setIsEditingGoal(false)
    }
  }

  const calorieProgress = (todayLog.caloriesConsumed / todayLog.calorieLimit) * 100
  const proteinProgress = (todayLog.protein / 150) * 100 // Assuming 150g protein goal
  const carbProgress = (todayLog.carbs / 250) * 100 // Assuming 250g carb goal
  const fatProgress = (todayLog.fat / 80) * 100 // Assuming 80g fat goal

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Overview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("daily-overview-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="daily-overview-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  <span>Nutrition Overview</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingGoal(!isEditingGoal)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <Target className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Calorie Goal Editing */}
              {isEditingGoal && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                  <div>
                    <Label htmlFor="calorie-goal" className="text-xs">
                      Daily Calorie Goal
                    </Label>
                    <Input
                      id="calorie-goal"
                      type="number"
                      value={tempCalorieGoal}
                      onChange={(e) => setTempCalorieGoal(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleGoalSave} size="sm" className="flex-1">
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button onClick={() => setIsEditingGoal(false)} variant="outline" size="sm" className="flex-1">
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Calorie Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Calories</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-green-600">{todayLog.caloriesConsumed}</span>
                    <span className="text-sm text-gray-600">/ {todayLog.calorieLimit}</span>
                    <Badge variant={calorieProgress > 100 ? "destructive" : "outline"} className="text-xs">
                      {calorieProgress.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={Math.min(100, calorieProgress)} className="h-3" />
                <p className="text-xs text-center text-gray-600">
                  {todayLog.calorieLimit - todayLog.caloriesConsumed > 0
                    ? `${todayLog.calorieLimit - todayLog.caloriesConsumed} calories remaining`
                    : `${todayLog.caloriesConsumed - todayLog.calorieLimit} calories over limit`}
                </p>
              </div>

              {/* Macronutrients */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{todayLog.protein}g</p>
                  <p className="text-xs text-gray-600">Protein</p>
                  <Progress value={Math.min(100, proteinProgress)} className="h-1 mt-1" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-600">{todayLog.carbs}g</p>
                  <p className="text-xs text-gray-600">Carbs</p>
                  <Progress value={Math.min(100, carbProgress)} className="h-1 mt-1" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{todayLog.fat}g</p>
                  <p className="text-xs text-gray-600">Fat</p>
                  <Progress value={Math.min(100, fatProgress)} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Food</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("add-food-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="add-food-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span>Add Food</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsAddingCustomFood(true)}>
                  Add Custom Food
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredFoods.map((food, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-3 justify-between bg-transparent"
                    onClick={() => addFood(food)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{food.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {food.serving} • {food.calories} cal
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                      <p>P: {food.protein}g</p>
                      <p>
                        C: {food.carbs}g • F: {food.fat}g
                      </p>
                    </div>
                  </Button>
                ))}
              </div>

              {filteredFoods.length === 0 && searchTerm && (
                <div className="text-center py-8 text-gray-500">
                  <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No foods found</p>
                  <p className="text-sm">Try a different search term or add a custom food</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Meal Planning</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("meal-planning-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="meal-planning-widget">
          <Card>
            <CardHeader>
              <CardTitle>Meal Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="breakfast" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                  <TabsTrigger value="lunch">Lunch</TabsTrigger>
                  <TabsTrigger value="dinner">Dinner</TabsTrigger>
                  <TabsTrigger value="snacks">Snacks</TabsTrigger>
                </TabsList>

                {(["breakfast", "lunch", "dinner", "snacks"] as const).map((mealType) => (
                  <TabsContent key={mealType} value={mealType} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{mealType}</h4>
                      <Button variant="outline" size="sm" onClick={() => setIsAddingToMealPlan(mealType)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Food
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {getMealPlanByType(mealType).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              {item.calories} cal • P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMealPlanItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      {getMealPlanByType(mealType).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No {mealType} planned yet</p>
                          <p className="text-sm">Add foods to plan your {mealType}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Custom Food Modal */}
      {isAddingCustomFood && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Custom Food</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  value={newCustomFood.name}
                  onChange={(e) => setNewCustomFood((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Homemade Protein Smoothie"
                />
              </div>
              <div>
                <Label htmlFor="serving-size">Serving Size</Label>
                <Input
                  id="serving-size"
                  value={newCustomFood.serving}
                  onChange={(e) => setNewCustomFood((prev) => ({ ...prev, serving: e.target.value }))}
                  placeholder="e.g., 1 cup, 100g, 1 medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newCustomFood.calories || ""}
                    onChange={(e) =>
                      setNewCustomFood((prev) => ({ ...prev, calories: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={newCustomFood.protein || ""}
                    onChange={(e) =>
                      setNewCustomFood((prev) => ({ ...prev, protein: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={newCustomFood.carbs || ""}
                    onChange={(e) =>
                      setNewCustomFood((prev) => ({ ...prev, carbs: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={newCustomFood.fat || ""}
                    onChange={(e) =>
                      setNewCustomFood((prev) => ({ ...prev, fat: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsAddingCustomFood(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={addCustomFood}
                  className="flex-1"
                  disabled={!newCustomFood.name || newCustomFood.calories <= 0}
                >
                  Add Food
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add to Meal Plan Modal */}
      {isAddingToMealPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add to {isAddingToMealPlan}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredFoods.map((food, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-3 justify-between bg-transparent"
                    onClick={() =>
                      addToMealPlan(food, isAddingToMealPlan as "breakfast" | "lunch" | "dinner" | "snacks")
                    }
                  >
                    <div className="text-left">
                      <p className="font-medium">{food.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {food.serving} • {food.calories} cal
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-600 dark:text-gray-400">
                      <p>P: {food.protein}g</p>
                      <p>
                        C: {food.carbs}g • F: {food.fat}g
                      </p>
                    </div>
                  </Button>
                ))}
              </div>

              <Button onClick={() => setIsAddingToMealPlan(null)} variant="outline" className="w-full">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
