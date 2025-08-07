'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const quotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState<{ quote: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching a quote
    const fetchQuote = () => {
      setLoading(true);
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setTimeout(() => {
        setCurrentQuote(quotes[randomIndex]);
        setLoading(false);
      }, 500); // Simulate network delay
    };

    fetchQuote();
    const interval = setInterval(fetchQuote, 30000); // Change quote every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Daily Motivation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center h-[120px]">
        {loading ? (
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        ) : (
          <>
            <p className="text-lg font-semibold italic">"{currentQuote?.quote}"</p>
            <p className="text-sm text-muted-foreground">- {currentQuote?.author}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
