"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Utensils, PlusCircle, Edit, XCircle } from 'lucide-react'
import { supabase } from "@/lib/supabase"
import type { NutritionLog, FoodItem } from "@/types/fitness"
import { format } from "date-fns"

export function NutritionTracker() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [nutritionLog, setNutritionLog] = useState<NutritionLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [totalCalories, setTotalCalories] = useState<string>("")
  const [totalProtein, setTotalProtein] = useState<string>("")
  const [totalCarbs, setTotalCarbs] = useState<string>("")
  const [totalFat, setTotalFat] = useState<string>("")

  useEffect(() => {
    if (user?.id) {
      fetchNutritionLog()
    }
  }, [user?.id])

  const fetchNutritionLog = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        throw error
      }

      if (data) {
        setNutritionLog(data as NutritionLog)
        setMealType(data.meal_type)
        setFoodItems(data.food_items || [])
        setTotalCalories(data.total_calories?.toString() || "")
        setTotalProtein(data.total_protein?.toString() || "")
        setTotalCarbs(data.total_carbs?.toString() || "")
        setTotalFat(data.total_fat?.toString() || "")
      } else {
        setNutritionLog(null)
        resetForm()
      }
    } catch (error: any) {
      console.error("Error fetching nutrition log:", error.message)
      toast({
        title: "Error",
        description: "Failed to load nutrition log.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setMealType("breakfast")
    setFoodItems([])
    setTotalCalories("")
    setTotalProtein("")
    setTotalCarbs("")
    setTotalFat("")
  }

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { name: "", calories: 0, protein: 0, carbs: 0, fat: 0, quantity: 0, unit: "g" }])
  }

  const handleRemoveFoodItem = (index: number) => {
    const newFoodItems = foodItems.filter((_, i) => i !== index)
    setFoodItems(newFoodItems)
  }

  const handleFoodItemChange = (index: number, field: keyof FoodItem, value: string) => {
    const newFoodItems = [...foodItems]
    // @ts-ignore
    newFoodItems[index][field] = ['calories', 'protein', 'carbs', 'fat', 'quantity'].includes(field) ? parseFloat(value) || 0 : value
    setFoodItems(newFoodItems)
  }

  const calculateTotals = (items: FoodItem[]) => {
    let cal = 0, prot = 0, carb = 0, fat = 0
    items.forEach(item => {
      cal += item.calories || 0
      prot += item.protein || 0
      carb += item.carbs || 0
      fat += item.fat || 0
    })
    setTotalCalories(cal.toString())
    setTotalProtein(prot.toString())
    setTotalCarbs(carb.toString())
    setTotalFat(fat.toString())
  }

  useEffect(() => {
    calculateTotals(foodItems)
  }, [foodItems])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const nutritionData = {
        user_id: user.id,
        date: today,
        meal_type: mealType,
        food_items: foodItems,
        total_calories: parseFloat(totalCalories) || 0,
        total_protein: parseFloat(totalProtein) || 0,
        total_carbs: parseFloat(totalCarbs) || 0,
        total_fat: parseFloat(totalFat) || 0,
      }

      let error = null
      if (nutritionLog) {
        const { error: updateError } = await supabase
          .from('nutrition_logs')
          .update(nutritionData)
          .eq('id', nutritionLog.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('nutrition_logs')
          .insert(nutritionData)
        error = insertError
      }

      if (error) throw error

      toast({
        title: "Success",
        description: "Nutrition logged successfully!",
      })
      setIsDialogOpen(false)
      fetchNutritionLog() // Re-fetch to update the display
    } catch (error: any) {
      console.error("Error saving nutrition log:", error.message)
      toast({
        title: "Error",
        description: "Failed to save nutrition log.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Nutrition</CardTitle>
        <Utensils className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : nutritionLog ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold capitalize">{nutritionLog.mealType}</h3>
            <p className="text-sm text-muted-foreground">
              {nutritionLog.totalCalories} kcal • {nutritionLog.totalProtein}g P • {nutritionLog.totalCarbs}g C • {nutritionLog.totalFat}g F
            </p>
            <div className="space-y-2">
              {nutritionLog.foodItems.map((item, index) => (
                <div key={index} className="border rounded-md p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} {item.unit} • {item.calories} kcal</p>
                  </div>
                </div>
              ))}
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 w-full">
                  <Edit className="mr-2 h-4 w-4" /> Edit Nutrition
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Nutrition Log</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">Meal Type</Label>
                    <Select value={mealType} onValueChange={(value: typeof mealType) => setMealType(value)}>
                      <SelectTrigger>
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

                  <h4 className="font-semibold text-lg mt-4">Food Items</h4>
                  {foodItems.map((item, index) => (
                    <Card key={index} className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`food-name-${index}`}>Food Name</Label>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFoodItem(index)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <Input
                        id={`food-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                        placeholder="e.g., Chicken Breast"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`calories-${index}`}>Calories</Label>
                          <Input type="number" id={`calories-${index}`} value={item.calories === 0 ? '' : item.calories} onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`protein-${index}`}>Protein (g)</Label>
                          <Input type="number" id={`protein-${index}`} value={item.protein === 0 ? '' : item.protein} onChange={(e) => handleFoodItemChange(index, 'protein', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`carbs-${index}`}>Carbs (g)</Label>
                          <Input type="number" id={`carbs-${index}`} value={item.carbs === 0 ? '' : item.carbs} onChange={(e) => handleFoodItemChange(index, 'carbs', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`fat-${index}`}>Fat (g)</Label>
                          <Input type="number" id={`fat-${index}`} value={item.fat === 0 ? '' : item.fat} onChange={(e) => handleFoodItemChange(index, 'fat', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                          <Input type="number" id={`quantity-${index}`} value={item.quantity === 0 ? '' : item.quantity} onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`unit-${index}`}>Unit</Label>
                          <Input id={`unit-${index}`} value={item.unit} onChange={(e) => handleFoodItemChange(index, 'unit', e.target.value)} placeholder="e.g., g, oz, piece" />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddFoodItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Food Item
                  </Button>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Total Calories</Label>
                      <Input value={totalCalories} readOnly className="font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Protein (g)</Label>
                      <Input value={totalProtein} readOnly className="font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Carbs (g)</Label>
                      <Input value={totalCarbs} readOnly className="font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Fat (g)</Label>
                      <Input value={totalFat} readOnly className="font-bold" />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No nutrition logged for today.</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Log Today's Nutrition
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Log New Nutrition</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-type">Meal Type</Label>
                    <Select value={mealType} onValueChange={(value: typeof mealType) => setMealType(value)}>
                      <SelectTrigger>
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

                  <h4 className="font-semibold text-lg mt-4">Food Items</h4>
                  {foodItems.map((item, index) => (
                    <Card key={index} className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={`food-name-${index}`}>Food Name</Label>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFoodItem(index)}>
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <Input
                        id={`food-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleFoodItemChange(index, 'name', e.target.value)}
                        placeholder="e.g., Chicken Breast"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`calories-${index}`}>Calories</Label>
                          <Input type="number" id={`calories-${index}`} value={item.calories === 0 ? '' : item.calories} onChange={(e) => handleFoodItemChange(index, 'calories', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`protein-${index}`}>Protein (g)</Label>
                          <Input type="number" id={`protein-${index}`} value={item.protein === 0 ? '' : item.protein} onChange={(e) => handleFoodItemChange(index, 'protein', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`carbs-${index}`}>Carbs (g)</Label>
                          <Input type="number" id={`carbs-${index}`} value={item.carbs === 0 ? '' : item.carbs} onChange={(e) => handleFoodItemChange(index, 'carbs', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`fat-${index}`}>Fat (g)</Label>
                          <Input type="number" id={`fat-${index}`} value={item.fat === 0 ? '' : item.fat} onChange={(e) => handleFoodItemChange(index, 'fat', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                          <Input type="number" id={`quantity-${index}`} value={item.quantity === 0 ? '' : item.quantity} onChange={(e) => handleFoodItemChange(index, 'quantity', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`unit-${index}`}>Unit</Label>
                          <Input id={`unit-${index}`} value={item.unit} onChange={(e) => handleFoodItemChange(index, 'unit', e.target.value)} placeholder="e.g., g, oz, piece" />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={handleAddFoodItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Food Item
                  </Button>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Total Calories</Label>
                      <Input value={totalCalories} readOnly className="font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Protein (g)</Label>
                      <Input value={totalProtein} readOnly className="font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Carbs (g)</Label>
                      <Input value={totalCarbs} readOnly className="font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Fat (g)</Label>
                      <Input value={totalFat} readOnly className="font-bold" />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Logging..." : "Log Nutrition"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
