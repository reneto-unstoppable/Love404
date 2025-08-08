'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartCrack, ThumbsDown, ThumbsUp } from 'lucide-react';

interface Profile {
  name: string;
  age: number;
  bio: string;
  image: string;
  spiritVegetable: string;
  loveLanguage: 'Sarcasm' | 'Ghosting';
}

interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeCard({ profile, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  return (
    <div className="relative w-full max-w-sm h-[550px] mx-auto">
      <Card className="w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-card border-4 border-card-foreground/20 flex flex-col transition-all duration-300 hover:transform hover:scale-105 hover:-rotate-2">
        <div className="relative w-full h-3/5">
          <Image
            src={profile.image}
            alt={`A glitched visage of ${profile.name}`}
            layout="fill"
            objectFit="cover"
            className="saturate-150 contrast-125"
            data-ai-hint="glitched face person"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="font-headline text-3xl font-bold text-primary-foreground drop-shadow-lg">
              {profile.name}, <span className="font-body">{profile.age}</span>
            </h2>
          </div>
        </div>
        <CardContent className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <p className="font-body text-foreground italic">"{profile.bio}"</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary">Spirit Veg: {profile.spiritVegetable}</Badge>
              <Badge variant="secondary">Love Language: {profile.loveLanguage}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 z-10">
        <button
          onClick={onSwipeLeft}
          className="w-20 h-20 rounded-full bg-destructive/80 text-destructive-foreground backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform hover:scale-110 hover:-rotate-12"
          aria-label="Swipe Left"
        >
          <ThumbsDown className="w-10 h-10" />
        </button>
        <button
          onClick={onSwipeRight}
          className="w-20 h-20 rounded-full bg-primary/80 text-primary-foreground backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform hover:scale-110 hover:rotate-12"
          aria-label="Swipe Right"
        >
          <ThumbsUp className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}
