'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

const quotes = [
  "The only bad workout is the one that didn't happen.",
  "Believe you can and you're halfway there.",
  "Strength does not come from physical capacity. It comes from an indomitable will.",
  "The body achieves what the mind believes.",
  "Success is what comes after you stop making excuses.",
  "Train insane or remain the same.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it, work for it.",
  "Push yourself because no one else is going to do it for you.",
]

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="w-full">
      <CardContent className="p-6 text-center">
        <p className="text-lg font-semibold italic">"{currentQuote}"</p>
        <p className="text-sm text-muted-foreground mt-2">- Fitness Motivation</p>
      </CardContent>
    </Card>
  )
}
