'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Quote } from 'lucide-react'
import { useState, useEffect } from "react"

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Today's actions are tomorrow's results.",
    author: "Unknown",
  },
  {
    text: "Your health is an investment, not an expense.",
    author: "Unknown",
  },
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState({ text: "", author: "" })

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Motivation</CardTitle>
        <Quote className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg font-semibold leading-snug">
          &ldquo;{currentQuote.text}&rdquo;
        </blockquote>
        <p className="text-sm text-muted-foreground mt-2">
          — {currentQuote.author}
        </p>
      </CardContent>
    </Card>
  )
}
