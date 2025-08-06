'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', workouts: 2, calories: 500 },
  { name: 'Tue', workouts: 1, calories: 300 },
  { name: 'Wed', workouts: 3, calories: 700 },
  { name: 'Thu', workouts: 0, calories: 0 },
  { name: 'Fri', workouts: 2, calories: 600 },
  { name: 'Sat', workouts: 1, calories: 400 },
  { name: 'Sun', workouts: 0, calories: 0 },
]

export default function WeeklySummary() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workouts" fill="#8884d8" name="Workouts" />
              <Bar dataKey="calories" fill="#82ca9d" name="Calories Burned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Total Workouts: {data.reduce((sum, day) => sum + day.workouts, 0)}</p>
          <p>Total Calories Burned: {data.reduce((sum, day) => sum + day.calories, 0)} kcal</p>
        </div>
      </CardContent>
    </Card>
  )
}
