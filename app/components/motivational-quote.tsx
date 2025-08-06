"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Quote } from 'lucide-react'

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Napoleon Hill",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Today's actions are tomorrow's results.",
    author: "Unknown",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone else who is not a champion.",
    author: "Arnold Schwarzenegger",
  },
  {
    text: "Your health is an investment, not an expense.",
    author: "Unknown",
  },
  {
    text: "It's not about being better than someone else, it's about being better than you used to be.",
    author: "Unknown",
  },
  {
    text: "The difference between the impossible and the possible lies in a person's determination.",
    author: "Tommy Lasorda",
  },
]

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState({ text: "", author: "" })

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="col-span-1 lg:col-span-3 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <CardContent className="space-y-4">
        <Quote className="h-8 w-8 mx-auto" />
        <p className="text-xl md:text-2xl font-semibold italic">
          "{currentQuote.text}"
        </p>
        <p className="text-sm md:text-base font-light">- {currentQuote.author}</p>
      </CardContent>
    </Card>
  )
}
