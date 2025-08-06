"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers"
  },
  {
    text: "The groundwork for all happiness is good health.",
    author: "Leigh Hunt"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  }
]

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }

  useEffect(() => {
    getRandomQuote()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Motivation</CardTitle>
        <Quote className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <blockquote className="text-sm italic">
            "{currentQuote.text}"
          </blockquote>
          <p className="text-xs text-muted-foreground text-right">
            — {currentQuote.author}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={getRandomQuote}
            className="w-full"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            New Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
