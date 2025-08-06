'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Droplet, Plus, Minus } from 'lucide-react'
import { WaterLog } from '@/types/fitness'
import { getBrowserClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

interface WaterTrackerProps {
  logs: WaterLog[]
}

export default function WaterTracker({ logs: initialLogs }: WaterTrackerProps) {
  const { session } = useAuth()
  const [logs, setLogs] = useState<WaterLog[]>(initialLogs)
  const [currentWater, setCurrentWater] = useState(0)
  const supabase = getBrowserClient()
  const { toast } = useToast()

  const addWater = async (amount: number) => {
    if (!session?.user) {
      toast({
        title: 'Error',
        description: 'Please log in to track water.',
        variant: 'destructive',
      })
      return
    }

    const newAmount = currentWater + amount
    setCurrentWater(newAmount)

    try {
      // For simplicity, we'll upsert based on today's date.
      // In a real app, you might have a more complex logging strategy.
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

      const { data, error } = await supabase
        .from('water_logs')
        .upsert(
          {
            user_id: session.user.id,
            date: today,
            amount: newAmount,
          },
          { onConflict: 'user_id,date' } // Update if user_id and date already exist
        )
        .select()
        .single()

      if (error) throw error

      setLogs((prevLogs) => {
        const existingLogIndex = prevLogs.findIndex(log => log.date === today)
        if (existingLogIndex > -1) {
          const updatedLogs = [...prevLogs]
          updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], amount: newAmount }
          return updatedLogs
        }
        return [...prevLogs, { date: today, amount: newAmount }]
      })

      toast({
        title: 'Water Updated',
        description: `You've logged ${newAmount} ml of water today!`,
      })
    } catch (error: any) {
      console.error('Error updating water log:', error)
      toast({
        title: 'Error',
        description: `Failed to update water: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      })
    }
  }

  const subtractWater = (amount: number) => {
    setCurrentWater(Math.max(0, currentWater - amount))
    // In a real app, you'd also update this in Supabase
  }

  // Initialize current water from logs for today
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayLog = logs.find(log => log.date === today)
    if (todayLog) {
      setCurrentWater(todayLog.amount)
    } else {
      setCurrentWater(0)
    }
  }, [logs])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
        <Droplet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-center gap-2 text-4xl font-bold">
          {currentWater} ml
        </div>
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon" onClick={() => subtractWater(250)}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button onClick={() => addWater(250)}>
            <Plus className="h-4 w-4 mr-2" /> Add 250ml
          </Button>
          <Button variant="outline" size="icon" onClick={() => addWater(500)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Goal: 3000 ml
        </div>
      </CardContent>
    </Card>
  )
}
