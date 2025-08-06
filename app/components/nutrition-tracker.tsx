'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-context'
import { NutritionLog, FoodItem } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase'
import { Loader2, PlusCircle, Trash2, Utensils } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function NutritionTracker() {
  const { user } = useAuth()
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newMealType, setNewMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [newFoodItems, setNewFoodItems] = useState<FoodItem[]>([{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: 'g' }])
  const supabase = getBrowserClient()

  const fetchNutritionLogs = async () => {
    if (!user?.id) return
    setLoading(true)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const { data, error } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching nutrition logs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load nutrition logs.',
        variant: 'destructive',
      })
    } else {
      const mappedLogs: NutritionLog[] = data.map(log => ({
        id: log.id,
        userId: log.user_id,
        date: log.date,
        mealType: log.meal_type as NutritionLog['mealType'],
        foodItems: (log.food_items || []) as FoodItem[],
        totalCalories: log.total_calories || 0,
        totalProtein: log.total_protein || 0,
        totalCarbs: log.total_carbs || 0,
        totalFat: log.total_fat || 0,
        createdAt: log.created_at,
      }));
      setNutritionLogs(mappedLogs)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNutritionLogs()
  }, [user])

  const handleAddFoodItem = () => {
    setNewFoodItems([...newFoodItems, { name: '', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: 'g' }])
  }

  const handleRemoveFoodItem = (index: number) => {
    const updatedFoodItems = newFoodItems.filter((_, i) => i !== index)
    setNewFoodItems(updatedFoodItems)
  }

  const handleFoodItemChange = (index: number, field: keyof FoodItem, value: any) => {
    const updatedFoodItems = [...newFoodItems]
    updatedFoodItems[index] = { ...updatedFoodItems[index], [field]: value }
    setNewFoodItems(updatedFoodItems)
  }

  const calculateTotals = (items: FoodItem[]) => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    items.forEach(item => {
      totalCalories += item.calories * item.quantity
      totalProtein += item.protein * item.quantity
      totalCarbs += item.carbs * item.quantity
      totalFat += item.fat * item.quantity
    })
    return { totalCalories, totalProtein, totalCarbs, totalFat }
  }

  const handleAddNutritionLog = async () => {
    if (!user?.id || newFoodItems.some(item => !item.name)) {
      toast({
        title: 'Input Error',
        description: 'Please ensure all food items have a name.',
        variant: 'destructive',
      })
      return
    }
    setIsAdding(true)

    const { totalCalories, totalProtein, totalCarbs, totalFat } = calculateTotals(newFoodItems)

    const { error } = await supabase.from('nutrition_logs').insert({
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
      meal_type: newMealType,
      food_items: newFoodItems as any, // Cast to any for JSONB
      total_calories: totalCalories,
      total_protein: totalProtein,
      total_carbs: totalCarbs,
      total_fat: totalFat,
    })

    if (error) {
      console.error('Error adding nutrition log:', error)
      toast({
        title: 'Error',
        description: 'Failed to add nutrition log.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Meal logged successfully!',
      })
      setNewMealType('breakfast')
      setNewFoodItems([{ name: '', calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 1, unit: 'g' }])
      fetchNutritionLogs() // Refresh data
    }
    setIsAdding(false)
  }

  const todayTotals = calculateTotals(nutritionLogs.flatMap(log => log.foodItems || []));

  return (
    <Card className="widget-card col-span-full md:col-span-2">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Nutrition Tracker</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log New Meal</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="mealType">Meal Type</Label>
                <Select value={newMealType} onValueChange={(value: any) => setNewMealType(value)}>
                  <SelectTrigger id="mealType">
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
              {newFoodItems.map((item, itemIndex) => (
                <Card key={itemIndex} className="p-4 space-y-3 border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`foodName-${itemIndex}`}>Food Name</Label>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFoodItem(itemIndex)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    id={`foodName-${itemIndex}`}
                    value={item.name}
                    onChange={(e) => handleFoodItemChange(itemIndex, 'name', e.target.value)}
                    placeholder="e.g., Chicken Breast"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor={`calories-${itemIndex}`}>Calories</Label>
                      <Input
                        id={`calories-${itemIndex}`}
                        type="number"
                        step="1"
                        value={item.calories}
                        onChange={(e) => handleFoodItemChange(itemIndex, 'calories', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`protein-${itemIndex}`}>Protein (g)</Label>
                      <Input
                        id={`protein-${itemIndex}`}
                        type="number"
                        step="0.1"
                        value={item.protein}
                        onChange={(e) => handleFoodItemChange(itemIndex, 'protein', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`carbs-${itemIndex}`}>Carbs (g)</Label>
                      <Input
                        id={`carbs-${itemIndex}`}
                        type="number"
                        step="0.1"
                        value={item.carbs}
                        onChange={(e) => handleFoodItemChange(itemIndex, 'carbs', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`fat-${itemIndex}`}>Fat (g)</Label>
                      <Input
                        id={`fat-${itemIndex}`}
                        type="number"
                        step="0.1"
                        value={item.fat}
                        onChange={(e) => handleFoodItemChange(itemIndex, 'fat', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor={`quantity-${itemIndex}`}>Quantity</Label>
                      <Input
                        id={`quantity-${itemIndex}`}
                        type="number"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => handleFoodItemChange(itemIndex, 'quantity', parseFloat(e.target.value) || 1)}
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label htmlFor={`unit-${itemIndex}`}>Unit</Label>
                      <Input
                        id={`unit-${itemIndex}`}
                        value={item.unit}
                        onChange={(e) => handleFoodItemChange(itemIndex, 'unit', e.target.value)}
                        placeholder="e.g., g, ml, piece"
                      />
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" onClick={handleAddFoodItem} className="w-full mt-4">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Food Item
              </Button>
            </div>
            <DialogFooter>
              <Button onClick={handleAddNutritionLog} disabled={isAdding}>
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Log Meal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="widget-content">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center font-semibold">
              <div>Calories: {todayTotals.totalCalories.toFixed(0)}</div>
              <div>Protein: {todayTotals.totalProtein.toFixed(1)}g</div>
              <div>Carbs: {todayTotals.totalCarbs.toFixed(1)}g</div>
              <div>Fat: {todayTotals.totalFat.toFixed(1)}g</div>
            </div>
            {nutritionLogs.length > 0 ? (
              <div className="space-y-3 mt-4">
                {nutritionLogs.map((log) => (
                  <Card key={log.id} className="p-3">
                    <h3 className="font-semibold text-md flex items-center gap-2 capitalize">
                      <Utensils className="h-4 w-4" /> {log.mealType}
                    </h3>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-0.5">
                      {log.foodItems?.map((item, foodIdx) => (
                        <li key={foodIdx}>
                          {item.name} ({item.quantity} {item.unit}) - {item.calories * item.quantity} kcal
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Total: {log.totalCalories} kcal, {log.totalProtein}g P, {log.totalCarbs}g C, {log.totalFat}g F
                    </p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center mt-4">No meals logged today. Start tracking your nutrition!</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
