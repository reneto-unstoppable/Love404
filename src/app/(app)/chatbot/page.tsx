'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { disasterChatbot } from '@/ai/flows/disaster-chatbot';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, Bot } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

const chatSchema = z.object({
  message: z.string().min(1, 'Cannot send empty void screams.'),
});

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const PigeonMascot = () => (
    <div className='w-10 h-10 flex items-center justify-center bg-muted rounded-full'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bird -scale-x-100 rotate-12 text-foreground/50"><path d="M16 7.062c0-4.04-3.45-7.02-7.52-7.02C4.54.04 2 3.02 2 7.062c0 3.53 2.16 6.44 5 6.938v.5c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-.5c2.84-.5 5-3.408 5-6.938z"/><path d="M16.5 22c5.5-1.5 5.5-8.5 0-10"/><path d="M22 17.5c-2-1-4.5-2.5-6-4.5"/><path d="m3.5 12.5 5 2.5"/><path d="m20 12-5.5 2.5"/></svg>
    </div>
);


export default function DisasterChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Ask me for advice. I dare you." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { username } = useUser();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: '' },
  });
  
  const getInitials = (name?: string | null) => {
    if (!name) return '??';
    return name.substring(0, 2).toUpperCase();
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof chatSchema>) {
    const userMessage: Message = { sender: 'user', text: values.message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    form.reset();

    try {
      const response = await disasterChatbot({ message: values.message });
      const botMessage: Message = { sender: 'bot', text: response.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'bot', text: "My circuits are fried trying to compute that. Try something less... you." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-2xl h-[70vh] flex flex-col -rotate-1 shadow-2xl">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Disaster Chatbot</CardTitle>
            <CardDescription>The worst dating advice imaginable, guaranteed.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
                {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'bot' && <PigeonMascot />}
                    <div className={`max-w-xs md:max-w-md rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                    <p className="text-sm">{msg.text}</p>
                    </div>
                     {msg.sender === 'user' && <Avatar><AvatarFallback>{getInitials(username)}</AvatarFallback></Avatar>}
                </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                       <PigeonMascot />
                        <div className="max-w-sm rounded-2xl p-3 bg-muted rounded-bl-none animate-pulse">
                            <div className="h-4 w-32 bg-foreground/20 rounded-md"></div>
                        </div>
                    </div>
                )}
            </div>
            </ScrollArea>
        </CardContent>
        <CardFooter>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full items-center space-x-2">
                <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                    <FormItem className="flex-grow">
                    <FormControl>
                        <Input placeholder="Tell me your problems..." {...field} disabled={isLoading} />
                    </FormControl>
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading}>
                    <SendHorizonal className="h-4 w-4" />
                </Button>
            </form>
            </Form>
        </CardFooter>
        </Card>
    </div>
  );
}
