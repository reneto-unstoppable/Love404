
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SwipeCard } from '@/components/swipe-card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChaoticPopup } from '@/components/chaotic-popup';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';

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

const dislikeReplies = [
    "And this is why you're single.",
    "They were probably a bot anyway. Probably.",
    "Another one bites the dust. And another one gone, and another one gone...",
    "You have successfully avoided a potentially mediocre conversation.",
    "Good choice. Their favorite font was Comic Sans.",
]

export default function SwipePage() {
  const [profiles, setProfiles] = useState(fakeProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);
  const { addLikedProfile } = useUser();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const timer = setTimeout(() => {
        if(document.visibilityState === 'visible'){
            setShowPopup(true);
        }
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentIndex, isClient]);

  const advanceToNextProfile = () => {
     setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= profiles.length) {
        setProfiles([...profiles].sort(() => Math.random() - 0.5));
        return 0;
      }
      return nextIndex;
    });
  }

  const handleSwipeLeft = () => {
    const reply = dislikeReplies[Math.floor(Math.random() * dislikeReplies.length)];
    toast({
        title: "Rejected!",
        description: reply,
    });
    advanceToNextProfile();
  };
  
  const handleSwipeRight = () => {
    const likedProfile = profiles[currentIndex];
    addLikedProfile(likedProfile);
     toast({
        title: "Liked!",
        description: `You've added ${likedProfile.name} to your collection of potential disappointments.`,
    });
    advanceToNextProfile();
  };

  const unmatchRoulette = () => {
    const reason = unmatchReasons[Math.floor(Math.random() * unmatchReasons.length)];
    toast({
        variant: 'destructive',
        title: "Unmatch Roulette!",
        description: reason
    });
    setProfiles([...profiles].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  }

  if (!isClient) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] gap-8">
        <h1 className="font-headline text-3xl text-center -rotate-2">Swipe Your Dignity Away</h1>
        <div className="relative w-full max-w-sm h-[550px] mx-auto">
            <Skeleton className="w-full h-full rounded-2xl" />
        </div>
         <div className="mt-4">
            <Skeleton className="h-12 w-48" />
        </div>
      </div>
    )
  }
  
  if (!profiles[currentIndex]) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="font-headline text-2xl">You've run out of people to disappoint.</h2>
        <p className="text-muted-foreground">For now.</p>
        <Button onClick={() => {
            setProfiles([...fakeProfiles].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
        }} className="mt-4">
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
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
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
