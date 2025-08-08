
'use client';

import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Ghost } from 'lucide-react';

export default function LikedProfilesPage() {
  const { user, isClient } = useUser();
  const router = useRouter();

  if (!isClient) {
    return null;
  }

  const likedProfiles = user?.likedProfiles || [];

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-4xl -rotate-1">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Your Liked Profiles</CardTitle>
          <CardDescription>A collection of souls you might one day ghost.</CardDescription>
        </CardHeader>
        <CardContent>
          {likedProfiles.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <Ghost className="w-24 h-24 text-muted" />
              <h3 className="font-headline text-2xl">The Void is Empty</h3>
              <p className="text-muted-foreground">You haven't liked anyone yet. Are you even trying?</p>
              <Button onClick={() => router.push('/swipe')}>Go Find Someone to Disappoint</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedProfiles.map((profile, index) => (
                <Card key={index} className="overflow-hidden transition-transform hover:scale-105 hover:rotate-2">
                  <CardHeader className="p-0">
                     <Avatar className="w-full h-48 rounded-none">
                        <AvatarImage src={profile.image} alt={profile.name} className="object-cover" data-ai-hint="glitched face person" />
                        <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h4 className="font-headline text-xl font-bold">{profile.name}, {profile.age}</h4>
                    <p className="text-sm text-muted-foreground italic mt-1">"{profile.bio}"</p>
                     <div className="flex flex-wrap gap-2 mt-3 text-xs">
                        <span className="py-1 px-2 bg-secondary rounded-full">Veg: {profile.spiritVegetable}</span>
                        <span className="py-1 px-2 bg-secondary rounded-full">Lang: {profile.loveLanguage}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
