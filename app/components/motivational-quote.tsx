'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
  { text: "Today's actions are tomorrow's results.", author: "Unknown" },
  { text: "Success is what comes after you stop making excuses.", author: "Luis Galarza" },
  { text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone else who is not a champion.", author: "Arnold Schwarzenegger" },
  { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  { text: "The only way to define your limits is by going beyond them.", author: "Arthur C. Clarke" },
  { text: "Train insane or remain the same.", author: "Unknown" },
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching a quote
    setLoading(true);
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setLoading(false);
  }, []);

  return (
    <Card className="widget-card col-span-full md:col-span-1">
      <CardHeader className="widget-header">
        <CardTitle className="widget-title">Daily Motivation</CardTitle>
      </CardHeader>
      <CardContent className="widget-content text-center flex flex-col items-center justify-center h-full min-h-[120px]">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : currentQuote ? (
          <>
            <p className="text-lg italic mb-2">"{currentQuote.text}"</p>
            <p className="text-sm text-muted-foreground">- {currentQuote.author}</p>
          </>
        ) : (
          <p className="text-muted-foreground">No quote available today.</p>
        )}
      </CardContent>
    </Card>
  );
}
