'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Ghost, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

const memeAdjectives = ["Screaming", "Crying", "Dank", "Spicy", "Clueless", "Chaotic", "Forgotten", "Cursed"];
const memeNouns = ["Pickle", "Wojak", "Doggo", "Cat", "Goblin", "Bean", "Moth", "Void"];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAnonymousLogin = () => {
    const adj = memeAdjectives[Math.floor(Math.random() * memeAdjectives.length)];
    const noun = memeNouns[Math.floor(Math.random() * memeNouns.length)];
    const num = Math.floor(Math.random() * 100);
    const anonUser = `${adj}${noun}_${num}`;
    login(anonUser);
    toast({
      title: "Welcome to the Void",
      description: `You are now haunting as: ${anonUser}`,
    });
    router.push('/create-profile');
  };

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      variant: "destructive",
      title: "Error: Sanity Detected",
      description: "Meaningful connections are not supported. Please lower your expectations.",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2390ee90%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-7xl font-headline font-bold text-primary animate-pulse -rotate-3">
          404 Haunting
        </h1>
        <p className="font-body text-muted-foreground mt-2 rotate-1">Where soulmates are server errors.</p>
      </div>
      <Card className="w-full max-w-sm z-10 shadow-2xl bg-card/80 backdrop-blur-sm rotate-1 hover:-rotate-1 transition-transform duration-500">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Abandon All Hope</CardTitle>
          <CardDescription>...ye who enter here. Or just, you know, log in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username (pointless)</Label>
              <Input id="username" type="text" placeholder="Your_Future_Ex" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (ignored)</Label>
              <Input id="password" type="password" placeholder="password123" />
            </div>
            <Button type="submit" className="w-full font-headline" disabled>
              <LogIn className="mr-2" /> Sign In (Doesn't Work)
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or embrace chaos</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full font-headline" onClick={handleAnonymousLogin} disabled={!isClient}>
            <Ghost className="mr-2 animate-bounce" /> Go Anonymous
          </Button>
        </CardContent>
      </Card>
       <footer className="absolute bottom-4 text-center text-muted-foreground text-xs z-10 font-body">
        <p>&copy; {isClient ? new Date().getFullYear() : ''} 404 Haunting Inc. All rights reversed.</p>
        <p>We are not liable for any emotional damage or accidental happiness.</p>
      </footer>
    </main>
  );
}
