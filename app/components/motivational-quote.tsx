"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from 'lucide-react'

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown"
  },
  {
    text: "Your body can do it. It's your mind you need to convince.",
    author: "Unknown"
  },
  {
    text: "Success is what comes after you stop making excuses.",
    author: "Luis Galarza"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  }
]

export function MotivationalQuote() {
  // Get a consistent quote for today based on date
  const today = new Date().toDateString()
  const quoteIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length
  const todaysQuote = quotes[quoteIndex]

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Quote className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              "{todaysQuote.text}"
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              — {todaysQuote.author}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
