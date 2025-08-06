"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Quote } from 'lucide-react'

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
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Fitness is not about being better than someone else. It's about being better than you used to be.",
    author: "Khloe Kardashian"
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown"
  },
  {
    text: "Don't wish for it, work for it.",
    author: "Unknown"
  }
]

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  useEffect(() => {
    // Set a random quote on component mount
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  const getNewQuote = () => {
    let newQuote
    do {
      const randomIndex = Math.floor(Math.random() * quotes.length)
      newQuote = quotes[randomIndex]
    } while (newQuote === currentQuote && quotes.length > 1)
    
    setCurrentQuote(newQuote)
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Quote className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <blockquote className="text-gray-700 dark:text-gray-300 italic mb-2">
              "{currentQuote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <cite className="text-sm text-gray-500 dark:text-gray-400 not-italic">
                — {currentQuote.author}
              </cite>
              <Button
                size="sm"
                variant="ghost"
                onClick={getNewQuote}
                className="text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
