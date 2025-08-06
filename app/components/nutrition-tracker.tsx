"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { NutritionLog } from "@/types/fitness"
import { toast } from "@/components/ui/use-toast"
import { Utensils, Plus, Minus, Loader2, Save, Pencil, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export function NutritionTracker() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">('breakfast')
  const [foodItems, setFoodItems] = useState<{ name: string; quantity: number; unit?: string; calories: number; protein: number; carbs: number; fat: number }[]>([])
  const [currentNutritionLog, setCurrentNutritionLog] = useState<NutritionLog | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const today = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    const fetchNutritionLog = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .eq('meal_type', mealType)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching nutrition log:', error.message)
        toast({
          title: 'Error',
          description: `Failed to load ${mealType} log.`,
          variant: 'destructive',
        })
      } else if (data) {
        setCurrentNutritionLog(data as NutritionLog)
        setFoodItems(data.food_items || [])
        setIsEditing(false) // If data exists, show as not editing initially
      } else {
        resetForm()
        setIsEditing(true) // If no data, prompt to edit
      }
      setIsLoading(false)
    }

    fetchNutritionLog()
  }, [user?.id, supabase, today, mealType])

  const resetForm = () => {
    setFoodItems([])
    setCurrentNutritionLog(null)
  }

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { name: '', quantity: 0, unit: '', calories: 0, protein: 0, carbs: 0, fat: 0 }])
  }

  const handleRemoveFoodItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index))
  }

  const handleFoodItemChange = (index: number, field: string, value: any) => {
    const newFoodItems = [...foodItems]
    newFoodItems[index] = { ...newFoodItems[index], [field]: value }
    setFoodItems(newFoodItems)
  }

  const calculateTotals = () => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    foodItems.forEach(item => {
      totalCalories += item.calories * item.quantity
      totalProtein += item.protein * item.quantity
      totalCarbs += item.carbs * item.quantity
      totalFat += item.fat * item.quantity
    })
    return { totalCalories, totalProtein, totalCarbs, totalFat }
  }

  const handleSaveNutrition = async () => {
    if (!user?.id) return

    setIsSaving(true)
    const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals()

    const newNutritionLog = {
      user_id: user.id,
      date: today,
      meal_type: mealType,
      food_items: foodItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit || null,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
      })),
      total_calories: totalCalories,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat,
    }

    let error = null
    let data = null

    if (currentNutritionLog?.id) {
      // Update existing
      const { data: updateData, error: updateError } = await supabase
        .from('nutrition_logs')
        .update(newNutritionLog)
        .eq('id', currentNutritionLog.id)
        .select()
        .single()
      data = updateData
      error = updateError
    } else {
      // Insert new
      const { data: insertData, error: insertError } = await supabase
        .from('nutrition_logs')
        .insert(newNutritionLog)
        .select()
        .single()
      data = insertData
      error = insertError
    }

    if (error) {
      console.error('Error saving nutrition log:', error.message)
      toast({
        title: 'Error',
        description: `Failed to save ${mealType} log.`,
        variant: 'destructive',
      })
    } else if (data) {
      setCurrentNutritionLog(data as NutritionLog)
      toast({
        title: 'Success',
        description: `${mealType} log saved!`,
      })
      setIsEditing(false)
    }
    setIsSaving(false)
  }

  const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals()

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Nutrition Tracker</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Nutrition Tracker</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          <span className="sr-only">{isEditing ? 'Save' : 'Edit'}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Today: {format(new Date(), 'PPP')}</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mealType">Meal Type</Label>
            <Select value={mealType} onValueChange={(value: typeof mealType) => setMealType(value)} disabled={isSaving}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a meal type" />
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
            <Label>Food Items</Label>
            {foodItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 items-center mb-2 border p-2 rounded-md">
                <Input
                  placeholder="Food Name"
                  value={item.name}
                  onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                  disabled={!isEditing || isSaving}
                  className="col-span-full sm:col-span-1"
                />
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity || ''}
                  onChange={(e) => handleFoodItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  placeholder="Unit"
                  value={item.unit || ''}
                  onChange={(e) => handleFoodItemChange(index, 'unit', e.target.value)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Cal"
                  value={item.calories || ''}
                  onChange={(e) => handleFoodItemChange(index, 'calories', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Prot"
                  value={item.protein || ''}
                  onChange={(e) => handleFoodItemChange(index, 'protein', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Carbs"
                  value={item.carbs || ''}
                  onChange={(e) => handleFoodItemChange(index, 'carbs', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Fat"
                  value={item.fat || ''}
                  onChange={(e) => handleFoodItemChange(index, 'fat', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing || isSaving}
                  className="w-20"
                />
                {isEditing && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveFoodItem(index)} disabled={isSaving}>
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Remove food item</span>
                  </Button>
                )}
              </div>
            ))}
            {isEditing && (
              <Button variant="outline" onClick={handleAddFoodItem} className="w-full" disabled={isSaving}>
                <Plus className="h-4 w-4 mr-2" /> Add Food Item
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm font-medium">
            <div>Total Calories: <span className="font-bold">{totalCalories.toFixed(0)}</span></div>
            <div>Total Protein: <span className="font-bold">{totalProtein.toFixed(1)}g</span></div>
            <div>Total Carbs: <span className="font-bold">{totalCarbs.toFixed(1)}g</span></div>
            <div>Total Fat: <span className="font-bold">{totalFat.toFixed(1)}g</span></div>
          </div>
        </div>
        {isEditing && (
          <Button onClick={handleSaveNutrition} className="w-full mt-4" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Save ${mealType} Log`}
          </Button>
        )}
        {!isEditing && !currentNutritionLog && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            No {mealType} logged for today. Click edit to log your meal.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
