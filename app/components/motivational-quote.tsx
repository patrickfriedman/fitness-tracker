"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from 'lucide-react'

export function MotivationalQuote() {
  const quotes = [
    "The only bad workout is the one that didn't happen.",
    "Your body can do it. It's your mind you need to convince.",
    "Success is what comes after you stop making excuses.",
    "The groundwork for all happiness is good health.",
    "Take care of your body. It's the only place you have to live."
  ]
  
  const todayQuote = quotes[new Date().getDate() % quotes.length]

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Quote className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic">
            {todayQuote}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
