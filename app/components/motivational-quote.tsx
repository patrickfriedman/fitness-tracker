'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'
import { useState, useEffect } from 'react'

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Believe you can and you're halfway there.",
  "Strength does not come from physical capacity. It comes from an indomitable will.",
  "The body achieves what the mind believes.",
  "Success is what comes after you stop making excuses.",
  "Train insane or remain the same.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Push yourself because no one else is going to do it for you.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it, work for it.",
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Motivational Quote</CardTitle>
        <Quote className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <blockquote className="text-lg font-semibold leading-snug">
          &ldquo;{currentQuote}&rdquo;
        </blockquote>
        <p className="text-sm text-muted-foreground mt-2">
          &mdash; Fitness Inspiration
        </p>
      </CardContent>
    </Card>
  )
}
