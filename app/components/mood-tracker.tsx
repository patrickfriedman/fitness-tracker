"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Smile, Meh, Frown, Angry } from "lucide-react"
import type { MoodLog } from "../../types/fitness"

interface MoodTrackerProps {
  userId: string
  onMoodUpdate?: (mood: MoodLog) => void
}

const moodOptions = [
  { value: 5, icon: Heart, label: "Excellent", color: "text-green-600" },
  { value: 4, icon: Smile, label: "Good", color: "text-blue-600" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-600" },
  { value: 2, icon: Frown, label: "Poor", color: "text-orange-600" },
  { value: 1, icon: Angry, label: "Terrible", color: "text-red-600" },
]

export function MoodTrackerWidget({ userId, onMoodUpdate }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue)
    setIsExpanded(true)
  }

  const handleSave = () => {
    if (selectedMood) {
      const moodLog: MoodLog = {
        userId,
        date: new Date().toISOString().split("T")[0],
        mood: selectedMood,
        notes,
        timestamp: new Date().toISOString(),
      }

      onMoodUpdate?.(moodLog)
      setIsExpanded(false)
      setNotes("")
    }
  }

  const selectedMoodOption = moodOptions.find((option) => option.value === selectedMood)

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-400">
          <Heart className="h-5 w-5" />
          <span>Mood Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isExpanded ? (
          <div className="space-y-3">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">How are you feeling today?</p>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((mood) => {
                const IconComponent = mood.icon
                return (
                  <Button
                    key={mood.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoodSelect(mood.value)}
                    className={`h-12 flex-col space-y-1 bg-transparent ${
                      selectedMood === mood.value ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30" : ""
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 ${mood.color}`} />
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              {selectedMoodOption && (
                <div className="flex items-center justify-center space-x-2">
                  <selectedMoodOption.icon className={`h-6 w-6 ${selectedMoodOption.color}`} />
                  <span className="font-medium">{selectedMoodOption.label}</span>
                </div>
              )}
            </div>

            <div>
              <Textarea
                placeholder="Add a note about your mood (optional)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex-1">
                Save Mood
              </Button>
              <Button
                onClick={() => {
                  setIsExpanded(false)
                  setSelectedMood(null)
                  setNotes("")
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {selectedMood && !isExpanded && (
          <div className="text-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
              Today's mood: {selectedMoodOption?.label}
            </p>
            {notes && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">"{notes}"</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
