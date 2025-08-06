'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import type { NutritionLog } from '@/types/fitness'

export default function NutritionTracker() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const [mealType, setMealType] = useState('breakfast')
  const [foodItems, setFoodItems] = useState([{ name: '', quantity: '', calories: '' }])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog | null>(null)

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  useEffect(() => {
    const fetchTodayNutrition = async () => {
      if (!user?.id || user.id === 'demo-user-123') {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching nutrition log:', error)
        toast({
          title: 'Error',
          description: 'Failed to load today\'s nutrition.',
          variant: 'destructive',
        })
      } else if (data) {
        setTodayNutrition(data as NutritionLog)
        setMealType(data.meal_type || 'breakfast')
        setFoodItems(
          data.food_items?.map((item: any) => ({
            name: item.name || '',
            quantity: item.quantity?.toString() || '',
            calories: item.calories?.toString() || '',
          })) || [{ name: '', quantity: '', calories: '' }]
        )
      }
      setIsLoading(false)
    }

    fetchTodayNutrition()
  }, [user, supabase, today, toast])

  const handleFoodItemChange = (index: number, field: string, value: string) => {
    const newFoodItems = [...foodItems]
    newFoodItems[index] = { ...newFoodItems[index], [field]: value }
    setFoodItems(newFoodItems)
  }

  const addFoodItem = () => {
    setFoodItems([...foodItems, { name: '', quantity: '', calories: '' }])
  }

  const removeFoodItem = (index: number) => {
    const newFoodItems = foodItems.filter((_, i) => i !== index)
    setFoodItems(newFoodItems)
  }

  const calculateTotals = () => {
    let totalCals = 0
    // For simplicity, protein, carbs, fat are not tracked per item, but can be added
    foodItems.forEach((item) => {
      totalCals += parseFloat(item.calories) || 0
    })
    return { totalCals, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  }

  const handleSaveNutrition = async () => {
    if (!user?.id || user.id === 'demo-user-123') {
      toast({
        title: 'Demo Mode',
        description: 'Nutrition cannot be saved in demo mode.',
      })
      return
    }

    setIsSaving(true)
    const { totalCals, totalProtein, totalCarbs, totalFat } = calculateTotals()
    const parsedFoodItems = foodItems.map((item) => ({
      name: item.name,
      quantity: parseFloat(item.quantity) || 0,
      calories: parseFloat(item.calories) || 0,
    }))

    const nutritionData = {
      user_id: user.id,
      date: today,
      meal_type: mealType,
      food_items: parsedFoodItems,
      total_calories: totalCals,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat,
    }

    const { error } = await supabase
      .from('nutrition_logs')
      .upsert(nutritionData, { onConflict: 'user_id,date' })

    if (error) {
      console.error('Error saving nutrition:', error)
      toast({
        title: 'Error',
        description: 'Failed to save nutrition.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Nutrition saved!',
      })
      // Refresh the state to show the saved data
      setTodayNutrition({
        id: todayNutrition?.id || 'new',
        userId: user.id,
        date: today,
        mealType: mealType,
        foodItems: parsedFoodItems as any, // Cast for simplicity
        totalCalories: totalCals,
        totalProtein: totalProtein,
        totalCarbs: totalCarbs,
        totalFat: totalFat,
      })
    }
    setIsSaving(false)
  }

  const { totalCals } = calculateTotals()

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Nutrition Tracker</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Nutrition Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
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
          <div className="space-y-2">
            <Label>Total Calories</Label>
            <Input value={totalCals.toFixed(0)} readOnly className="font-bold" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Food Items</h3>
          {foodItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
              <div className="sm:col-span-2 space-y-1">
                <Label htmlFor={`food-name-${index}`}>Food Name</Label>
                <Input
                  id={`food-name-${index}`}
                  placeholder="e.g., Chicken Breast"
                  value={item.name}
                  onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  placeholder="100"
                  value={item.quantity}
                  onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`calories-${index}`}>Calories</Label>
                <Input
                  id={`calories-${index}`}
                  type="number"
                  placeholder="165"
                  value={item.calories}
                  onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)}
                />
              </div>
              {foodItems.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFoodItem(index)}
                  className="mt-auto"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addFoodItem} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Food Item
          </Button>
        </div>

        <Button onClick={handleSaveNutrition} className="w-full" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Nutrition
        </Button>
      </CardContent>
    </Card>
  )
}
