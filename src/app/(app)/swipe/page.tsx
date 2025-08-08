'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeCard } from '@/components/swipe-card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChaoticPopup } from '@/components/chaotic-popup';

const fakeProfiles = [
  { name: 'Glarth', age: 420, bio: 'Just a consciousness trapped in a meat-suit, looking for another to buffer with.', image: 'https://placehold.co/400x600.png', spiritVegetable: 'Confused Turnip', loveLanguage: 'Sarcasm' },
  { name: 'Brenda?', age: 28, bio: 'My hobbies include staring into the void and collecting expired coupons.', image: 'https://placehold.co/400x601.png', spiritVegetable: 'Sad Potato', loveLanguage: 'Ghosting' },
  { name: 'C H A D', age: 19, bio: 'I only speak in memes and disappointment. Fluent in both.', image: 'https://placehold.co/400x602.png', spiritVegetable: 'Screaming Carrot', loveLanguage: 'Sarcasm' },
  { name: 'Entity_7', age: 777, bio: 'Seeking a carbon-based lifeform to disappoint. Must be okay with my 17 ferrets.', image: 'https://placehold.co/400x603.png', spiritVegetable: 'Existential Broccoli', loveLanguage: 'Ghosting' },
];

const unmatchReasons = [
    "You were unmatched because Mercury is in retrograde.",
    "The spirit vegetable council has deemed you 'too leafy'.",
    "Your aura clashes with their favorite brand of mayonnaise.",
    "A pigeon advised against this connection.",
    "Unmatched. Reason: Tuesday.",
];

export default function SwipePage() {
  const [profiles, setProfiles] = useState(fakeProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const chaosTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10000); // Popup appears after 10 seconds
    return () => clearTimeout(chaosTimer);
  }, [currentIndex]);


  const handleSwipe = () => {
    const nextIndex = (currentIndex + 1);
    if (nextIndex >= profiles.length) {
        // Reshuffle and start over
        setProfiles([...profiles].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
    } else {
        setCurrentIndex(nextIndex);
    }
    const outcome = Math.random() > 0.5 ? 'NULL' : 'INCOMPATIBLE';
    router.push(`/match-fail?outcome=${outcome}`);
  };

  const unmatchRoulette = () => {
    const reason = unmatchReasons[Math.floor(Math.random() * unmatchReasons.length)];
    toast({
        variant: 'destructive',
        title: "Unmatch Roulette!",
        description: reason
    });
    // reshuffle all profiles
    setProfiles([...profiles].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  }

  if (!profiles[currentIndex]) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="font-headline text-2xl">You've run out of people to disappoint.</h2>
        <p className="text-muted-foreground">For now.</p>
        <Button onClick={() => setCurrentIndex(0)} className="mt-4">
          <RotateCcw className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] gap-8">
      <ChaoticPopup isOpen={showPopup} onOpenChange={setShowPopup} />
      <h1 className="font-headline text-3xl text-center -rotate-2">Swipe Your Dignity Away</h1>
      <SwipeCard
        key={currentIndex}
        profile={profiles[currentIndex]}
        onSwipeLeft={handleSwipe}
        onSwipeRight={handleSwipe}
      />
      <div className="mt-4">
        <Button variant="outline" onClick={unmatchRoulette} className="font-headline rotate-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dices mr-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M8 8h.01"/><path d="M16 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/></svg>
            Unmatch Roulette
        </Button>
      </div>
    </div>
  );
}
