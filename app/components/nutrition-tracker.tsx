'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Utensils, PlusCircle, Trash2 } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { NutritionLog, FoodItem } from "@/types/fitness"

export default function NutritionTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [mealType, setMealType] = useState<NutritionLog['meal_type']>('breakfast')
  const [foodItems, setFoodItems] = useState<FoodItem[]>([{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: "serving" }])
  const [isLogging, setIsLogging] = useState(false)
  const [recentNutrition, setRecentNutrition] = useState<NutritionLog[]>([])
  const [loadingNutrition, setLoadingNutrition] = useState(true)

  useState(() => {
    const fetchNutrition = async () => {
      if (!user) return
      setLoadingNutrition(true)
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('created_at', { ascending: false }) // Assuming a created_at column for ordering meals
        .limit(3)

      if (error) {
        console.error("Error fetching nutrition:", error)
        toast({
          title: "Error",
          description: "Failed to load recent nutrition.",
          variant: "destructive",
        })
      } else {
        setRecentNutrition(data as NutritionLog[])
      }
      setLoadingNutrition(false)
    }
    fetchNutrition()
  }, [user])

  const addFoodItem = () => {
    setFoodItems([...foodItems, { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: "serving" }])
  }

  const updateFoodItem = (index: number, field: keyof FoodItem, value: any) => {
    const newFoodItems = [...foodItems]
    if (['calories', 'protein', 'carbs', 'fat', 'quantity'].includes(field as string)) {
      newFoodItems[index] = { ...newFoodItems[index], [field]: parseFloat(value) || 0 }
    } else {
      newFoodItems[index] = { ...newFoodItems[index], [field]: value }
    }
    setFoodItems(newFoodItems)
  }

  const deleteFoodItem = (index: number) => {
    const newFoodItems = foodItems.filter((_, i) => i !== index)
    setFoodItems(newFoodItems)
  }

  const handleLogNutrition = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track nutrition.",
        variant: "destructive",
      })
      return
    }
    if (foodItems.some(item => !item.name || item.calories === 0)) {
      toast({
        title: "Missing Information",
        description: "Please ensure all food items have a name and calories.",
        variant: "destructive",
      })
      return
    }

    setIsLogging(true)
    try {
      const totalCalories = foodItems.reduce((sum, item) => sum + item.calories * item.quantity, 0)
      const totalProtein = foodItems.reduce((sum, item) => sum + item.protein * item.quantity, 0)
      const totalCarbs = foodItems.reduce((sum, item) => sum + item.carbs * item.quantity, 0)
      const totalFat = foodItems.reduce((sum, item) => sum + item.fat * item.quantity, 0)

      const newNutritionLog: Partial<NutritionLog> = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        meal_type: mealType,
        food_items: foodItems,
        total_calories: totalCalories,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
      }

      const { data, error } = await supabase
        .from('nutrition_logs')
        .insert(newNutritionLog)
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Nutrition Logged!",
        description: "Your meal has been successfully recorded.",
      })
      setMealType('breakfast')
      setFoodItems([{ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: "serving" }])
      setIsLogging(false)
      setRecentNutrition((prev) => [data[0] as NutritionLog, ...prev].slice(0, 3))
    } catch (error: any) {
      console.error("Error logging nutrition:", error)
      toast({
        title: "Error",
        description: `Failed to log nutrition: ${error.message}`,
        variant: "destructive",
      })
      setIsLogging(false)
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Nutrition Tracker</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loadingNutrition ? (
          <div className="text-center text-sm text-muted-foreground">Loading recent meals...</div>
        ) : recentNutrition.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">Recent Meals:</h3>
            {recentNutrition.map((meal) => (
              <div key={meal.id} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0">
                <p className="font-medium capitalize">{meal.meal_type} - {meal.total_calories} kcal</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(meal.date).toLocaleDateString()}
                </p>
                <ul className="text-xs text-muted-foreground mt-1">
                  {meal.food_items.slice(0, 2).map((item, idx) => (
                    <li key={idx}>{item.name} ({item.calories} kcal)</li>
                  ))}
                  {meal.food_items.length > 2 && <li>...</li>}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mb-4">No meals logged yet.</div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Log New Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log New Meal</DialogTitle>
              <DialogDescription>
                Record the food items and their nutritional information for your meal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={mealType} onValueChange={(value) => setMealType(value as NutritionLog['meal_type'])} disabled={isLogging}>
                  <SelectTrigger id="meal-type">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <h4 className="text-md font-semibold mt-4">Food Items</h4>
              {foodItems.map((item, itemIndex) => (
                <Card key={itemIndex} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      placeholder="Food Name (e.g., Chicken Breast)"
                      value={item.name}
                      onChange={(e) => updateFoodItem(itemIndex, 'name', e.target.value)}
                      className="flex-grow mr-2"
                      disabled={isLogging}
                    />
                    <Button variant="destructive" size="icon" onClick={() => deleteFoodItem(itemIndex)} disabled={isLogging}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor={`calories-${itemIndex}`}>Calories (kcal)</Label>
                      <Input
                        id={`calories-${itemIndex}`}
                        type="number"
                        value={item.calories === 0 ? '' : item.calories}
                        onChange={(e) => updateFoodItem(itemIndex, 'calories', e.target.value)}
                        disabled={isLogging}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`protein-${itemIndex}`}>Protein (g)</Label>
                      <Input
                        id={`protein-${itemIndex}`}
                        type="number"
                        value={item.protein === 0 ? '' : item.protein}
                        onChange={(e) => updateFoodItem(itemIndex, 'protein', e.target.value)}
                        disabled={isLogging}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`carbs-${itemIndex}`}>Carbs (g)</Label>
                      <Input
                        id={`carbs-${itemIndex}`}
                        type="number"
                        value={item.carbs === 0 ? '' : item.carbs}
                        onChange={(e) => updateFoodItem(itemIndex, 'carbs', e.target.value)}
                        disabled={isLogging}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`fat-${itemIndex}`}>Fat (g)</Label>
                      <Input
                        id={`fat-${itemIndex}`}
                        type="number"
                        value={item.fat === 0 ? '' : item.fat}
                        onChange={(e) => updateFoodItem(itemIndex, 'fat', e.target.value)}
                        disabled={isLogging}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`quantity-${itemIndex}`}>Quantity</Label>
                      <Input
                        id={`quantity-${itemIndex}`}
                        type="number"
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => updateFoodItem(itemIndex, 'quantity', e.target.value)}
                        disabled={isLogging}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`unit-${itemIndex}`}>Unit</Label>
                      <Input
                        id={`unit-${itemIndex}`}
                        value={item.unit}
                        onChange={(e) => updateFoodItem(itemIndex, 'unit', e.target.value)}
                        placeholder="e.g., serving, gram"
                        disabled={isLogging}
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={addFoodItem} disabled={isLogging}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Food Item
              </Button>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleLogNutrition} disabled={isLogging}>
                {isLogging ? "Logging..." : "Save Meal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
