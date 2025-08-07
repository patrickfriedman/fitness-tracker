'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function WeeklySummary() {
  // Placeholder data for weekly summary
  const data = [
    { name: 'Mon', workouts: 1, calories: 500 },
    { name: 'Tue', workouts: 2, calories: 800 },
    { name: 'Wed', workouts: 1, calories: 600 },
    { name: 'Thu', workouts: 0, calories: 0 },
    { name: 'Fri', workouts: 2, calories: 900 },
    { name: 'Sat', workouts: 1, calories: 700 },
    { name: 'Sun', workouts: 0, calories: 0 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workouts" fill="#8884d8" name="Workouts" />
              <Bar dataKey="calories" fill="#82ca9d" name="Calories Burned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Overview of your workouts and calories burned this week.
        </p>
      </CardContent>
    </Card>
  )
}
