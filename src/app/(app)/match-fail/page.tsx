'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MatchFailClient } from '@/components/match-fail-client';
import { HeartCrack, ServerCrash } from 'lucide-react';

function MatchFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const outcome = searchParams.get('outcome');

  const messages = {
    NULL: {
      title: "You matched with: NULL",
      description: "It's not you, it's the void. The void is just not that into you.",
      icon: <ServerCrash className="w-24 h-24 text-destructive" />,
    },
    INCOMPATIBLE: {
      title: "110% Incompatible. Congratulations!",
      description: "You've achieved a level of incompatibility previously thought to be a theoretical limit.",
      icon: <HeartCrack className="w-24 h-24 text-destructive" />,
    },
    DEFAULT: {
      title: "404 Match Not Found",
      description: "The connection you were looking for does not exist. Or maybe it's just hiding from you.",
      icon: <HeartCrack className="w-24 h-24 text-destructive" />,
    }
  };

  const { title, description, icon } = messages[outcome as keyof typeof messages] || messages.DEFAULT;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background relative">
        <MatchFailClient />
        <Card className="p-8 md:p-12 z-10 bg-card/80 backdrop-blur-sm shadow-2xl animate-in fade-in zoom-in-50">
            <CardContent className="flex flex-col items-center justify-center gap-6">
                <div className="animate-bounce">
                    {icon}
                </div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-destructive">{title}</h1>
                <p className="max-w-md text-lg text-muted-foreground">{description}</p>
                <Button onClick={() => router.push('/swipe')} className="mt-8 font-headline text-xl" size="lg">
                    Embrace More Failure
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}

export default function MatchFailPage() {
    return (
        <Suspense fallback={<div>Loading result...</div>}>
            <MatchFailContent />
        </Suspense>
    )
}
