'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const profileSchema = z.object({
  displayName: z.string().optional(),
  emotionalAge: z.array(z.number()).default([3]),
  conspiracyTheory: z.string().min(5, 'Surely your theory is longer than that.'),
  spiritVegetable: z.string({ required_error: 'You must choose a vegetable soulmate.' }),
  loveLanguage: z.enum(['Sarcasm', 'Ghosting'], { required_error: 'Pick your poison.' }),
  loveAtFirstSite: z.boolean().refine(val => val === true, {
    message: 'Incorrect. The answer is yes. We have standards.',
  }),
});

export default function CreateProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setProfile, getProfile, isClient } = useUser();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [picStyle, setPicStyle] = useState({});

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      emotionalAge: [3],
      conspiracyTheory: '',
      loveAtFirstSite: false,
    },
  });

  useEffect(() => {
    if (isClient) {
      const savedProfile = getProfile();
      if (savedProfile) {
        form.reset(savedProfile);
        if(savedProfile.profilePic) {
            setProfilePic(savedProfile.profilePic);
        }
      }
    }
  }, [isClient, form, getProfile]);


  const generatePic = () => {
    const filters = [
      `sepia(${Math.random().toFixed(2)})`,
      `saturate(${(Math.random() * 2 + 0.5).toFixed(2)})`,
      `contrast(${(Math.random() * 1.5 + 0.75).toFixed(2)})`,
      `hue-rotate(${Math.floor(Math.random() * 360)}deg)`,
      `blur(1px)`,
    ];
    setPicStyle({ filter: filters.join(' ') });
    const newPic = `https://placehold.co/200x200.png?t=${new Date().getTime()}`;
    setProfilePic(newPic);
    toast({ title: 'Behold!', description: 'A face not even a mother could debug.' });
  };
  
  function onSubmit(values: z.infer<typeof profileSchema>) {
    setProfile({ ...values, profilePic });
    toast({
      title: 'Profile "Saved"',
      description: "We've stored your questionable life choices.",
    });
    router.push('/personality-quiz');
  }

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl -rotate-1">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Construct Your Avatar of Chaos</CardTitle>
          <CardDescription>Be honest. Or don't. We don't care.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="space-y-2 text-center">
                    <Label>Profile Picture</Label>
                    <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center overflow-hidden border-4 border-accent">
                        {profilePic ? 
                            <Image src={profilePic} alt="A questionable face" width={200} height={200} style={picStyle} data-ai-hint="glitched face"/> : 
                            <span className="text-muted-foreground text-xs p-4">Click below</span>
                        }
                    </div>
                    <Button type="button" variant="outline" onClick={generatePic} className="mt-2">Generate Unsettling Visage</Button>
                </div>

                <div className="space-y-6 flex-1">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name (defaults to HotSingle_420)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. CerealKiller" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="conspiracyTheory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favorite Conspiracy Theory</FormLabel>
                          <FormControl>
                            <Input placeholder="The earth is a donut" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              </div>


              <FormField
                control={form.control}
                name="emotionalAge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emotional Age: {field.value[0]}</FormLabel>
                    <FormControl>
                        <Slider
                            min={3}
                            max={99}
                            step={1}
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                        />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="spiritVegetable"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Spirit Vegetable</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a profound vegetable" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Sad Potato">Sad Potato</SelectItem>
                            <SelectItem value="Existential Broccoli">Existential Broccoli</SelectItem>
                            <SelectItem value="Screaming Carrot">Screaming Carrot</SelectItem>
                            <SelectItem value="Confused Turnip">Confused Turnip</SelectItem>
                            <SelectItem value="Rotten Tomato">Rotten Tomato</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="loveLanguage"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Primary Love Language</FormLabel>
                        <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex items-center space-x-4 pt-2"
                        >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="Sarcasm" />
                            </FormControl>
                            <FormLabel className="font-normal">Sarcasm</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="Ghosting" />
                            </FormControl>
                            <FormLabel className="font-normal">Ghosting</FormLabel>
                            </FormItem>
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="loveAtFirstSite"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>Do you believe in love at first site?</FormLabel>
                         <FormMessage />
                    </div>
                    </FormItem>
                )}
                />

              <Button type="submit" className="w-full font-headline text-lg">Solidify My Tragic Backstory</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
