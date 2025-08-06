"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Meh, Frown, Heart, Zap } from 'lucide-react'

interface MoodEntry {
  mood: string
  date: string
}

export function MoodTracker() {
  const [todayMood, setTodayMood] = useState<string | null>(null)
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("fitness-mood")
    if (stored) {
      const history = JSON.parse(stored)
      setMoodHistory(history)
      
      const today = new Date().toDateString()
      const todayEntry = history.find((entry: MoodEntry) => 
        new Date(entry.date).toDateString() === today
      )
      if (todayEntry) {
        setTodayMood(todayEntry.mood)
      }
    }
  }, [])

  const moods = [
    { id: "great", label: "Great", icon: Heart, color: "text-green-500" },
    { id: "good", label: "Good", icon: Smile, color: "text-blue-500" },
    { id: "okay", label: "Okay", icon: Meh, color: "text-yellow-500" },
    { id: "tired", label: "Tired", icon: Frown, color: "text-orange-500" },
    { id: "stressed", label: "Stressed", icon: Zap, color: "text-red-500" }
  ]

  const handleMoodSelect = (moodId: string) => {
    const today = new Date().toDateString()
    const newEntry: MoodEntry = {
      mood: moodId,
      date: new Date().toISOString()
    }

    // Remove any existing entry for today
    const filteredHistory = moodHistory.filter(entry => 
      new Date(entry.date).toDateString() !== today
    )
    
    const updatedHistory = [newEntry, ...filteredHistory].slice(0, 30) // Keep last 30 days
    
    setMoodHistory(updatedHistory)
    setTodayMood(moodId)
    localStorage.setItem("fitness-mood", JSON.stringify(updatedHistory))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">How are you feeling?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => {
            const Icon = mood.icon
            const isSelected = todayMood === mood.id
            
            return (
              <Button
                key={mood.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`flex flex-col items-center p-2 h-auto ${
                  isSelected ? "" : "hover:bg-gray-50"
                }`}
                onClick={() => handleMoodSelect(mood.id)}
              >
                <Icon className={`h-5 w-5 ${isSelected ? "text-white" : mood.color}`} />
                <span className={`text-xs mt-1 ${isSelected ? "text-white" : "text-gray-600"}`}>
                  {mood.label}
                </span>
              </Button>
            )
          })}
        </div>
        
        {todayMood && (
          <div className="mt-3 text-center text-sm text-gray-600">
            Mood logged for today
          </div>
        )}
      </CardContent>
    </Card>
  )
}
