'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/contexts/auth-context'
import { getBrowserClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { Loader2, TrendingUp } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

interface WeeklySummaryData {
  name: string; // Day of week
  workouts: number;
  calories: number;
  water: number;
}

export function WeeklySummary() {
  const { user } = useAuth()
  const supabase = getBrowserClient()
  const [summaryData, setSummaryData] = useState<WeeklySummaryData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      if (!user?.id) return

      setIsLoading(true)
      const today = new Date()
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }) // Monday
      const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 }) // Sunday

      const datesInWeek = eachDayOfInterval({
        start: startOfCurrentWeek,
        end: endOfCurrentWeek,
      }).map(date => format(date, 'yyyy-MM-dd'))

      // Fetch all relevant logs for the week
      const [
        { data: workoutLogs, error: workoutError },
        { data: nutritionLogs, error: nutritionError },
        { data: waterLogs, error: waterError },
      ] = await Promise.all([
        supabase.from('workout_logs').select('date').eq('user_id', user.id).gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd')).lte('date', format(endOfCurrentWeek, 'yyyy-MM-dd')),
        supabase.from('nutrition_logs').select('date, total_calories').eq('user_id', user.id).gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd')).lte('date', format(endOfCurrentWeek, 'yyyy-MM-dd')),
        supabase.from('water_logs').select('date, amount_ml').eq('user_id', user.id).gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd')).lte('date', format(endOfCurrentWeek, 'yyyy-MM-dd')),
      ])

      if (workoutError || nutritionError || waterError) {
        console.error('Error fetching weekly summary data:', workoutError?.message || nutritionError?.message || waterError?.message)
        toast({
          title: 'Error',
          description: 'Failed to load weekly summary.',
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }

      const dailyData: { [key: string]: { workouts: number; calories: number; water: number } } = {}
      datesInWeek.forEach(date => {
        dailyData[date] = { workouts: 0, calories: 0, water: 0 }
      })

      workoutLogs.forEach(log => {
        dailyData[log.date].workouts += 1
      })

      nutritionLogs.forEach(log => {
        dailyData[log.date].calories += log.total_calories || 0
      })

      waterLogs.forEach(log => {
        dailyData[log.date].water += log.amount_ml || 0
      })

      const formattedSummary: WeeklySummaryData[] = datesInWeek.map(date => ({
        name: format(new Date(date), 'EEE'), // Mon, Tue, etc.
        workouts: dailyData[date].workouts,
        calories: dailyData[date].calories,
        water: dailyData[date].water / 1000, // Convert ml to Liters
      }))

      setSummaryData(formattedSummary)
      setIsLoading(false)
    }

    fetchWeeklySummary()
  }, [user?.id, supabase])

  if (isLoading) {
    return (
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Weekly Summary</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">Your activity and intake this week</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={summaryData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" axisLine={false} tickLine={false} className="text-xs" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" axisLine={false} tickLine={false} className="text-xs" />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                      <p className="font-bold">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}{entry.name === 'water' ? 'L' : entry.name === 'calories' ? 'kcal' : ''}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar yAxisId="left" dataKey="workouts" fill="#8884d8" name="Workouts" />
            <Bar yAxisId="right" dataKey="calories" fill="#82ca9d" name="Calories" />
            <Bar yAxisId="right" dataKey="water" fill="#00bfff" name="Water" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#8884d8] rounded-full mr-1" /> Workouts
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#82ca9d] rounded-full mr-1" /> Calories
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-[#00bfff] rounded-full mr-1" /> Water
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
