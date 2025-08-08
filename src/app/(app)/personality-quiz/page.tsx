'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import { personalityAnalysis, type PersonalityAnalysisOutput } from '@/ai/flows/personality-analysis';
import { useToast } from '@/hooks/use-toast';

const quizSchema = z.object({
  question1: z.string({ required_error: "Indecision is not a valid answer." }),
  question2: z.string({ required_error: "Your dating history is not *that* complex." }),
  question3: z.string({ required_error: "Just pick one. It doesn't matter." }),
});

export default function PersonalityQuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [progress, setProgress] = useState(13);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PersonalityAnalysisOutput | null>(null);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
  });

  useEffect(() => {
    if (isAnalyzing) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 97) {
            clearInterval(timer);
            return prev;
          }
          return prev + Math.floor(Math.random() * 5);
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [isAnalyzing]);

  async function onSubmit(values: z.infer<typeof quizSchema>) {
    setIsAnalyzing(true);
    try {
      const result = await personalityAnalysis(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Our AI had an existential crisis trying to understand you. Please try again.",
      });
      setIsAnalyzing(false);
      setProgress(13);
    }
  }

  return (
    <>
      <div className="flex justify-center items-start py-8">
        <Card className="w-full max-w-2xl rotate-1">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">The Inevitable Inquisition</CardTitle>
            <CardDescription>Let's quantify your unique brand of chaos.</CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="text-center space-y-4 p-8">
                <p className="font-headline text-xl animate-pulse">Analyzing your life choices...</p>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">This may take an eternity. Or not.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="question1"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="font-bold text-lg">If you see a pigeon, do you:</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="Run" /></FormControl>
                              <FormLabel className="font-normal">A) Run</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="Salute" /></FormControl>
                              <FormLabel className="font-normal">B) Salute</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="Whisper classified info" /></FormControl>
                              <FormLabel className="font-normal">C) Whisper classified info</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="question2"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="font-bold text-lg">Which potato shape best represents your dating history?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="Perfectly round" /></FormControl>
                              <FormLabel className="font-normal">A) Perfectly round, but bruised</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="Lumpy and confusing" /></FormControl>
                              <FormLabel className="font-normal">B) Lumpy and confusing</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="A single french fry" /></FormControl>
                              <FormLabel className="font-normal">C) A single, lonely french fry</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="question3"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="font-bold text-lg">Pick your ideal first date location:</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="The DMV" /></FormControl>
                              <FormLabel className="font-normal">A) The DMV</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="IKEA's rug aisle" /></FormControl>
                              <FormLabel className="font-normal">B) IKEA’s rug aisle</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="Your ex's wedding" /></FormControl>
                              <FormLabel className="font-normal">C) Your ex’s wedding</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full font-headline text-lg">Reveal My Deeply Flawed Personality</Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={!!analysisResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline text-2xl text-primary">Analysis Complete!</AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-4">
              <p className="text-lg text-foreground">You are</p>
              <p className="text-7xl font-bold text-destructive my-2">{analysisResult?.compatibilityScore}%</p>
              <p className="text-lg text-foreground">compatible with happiness.</p>
              <p className="text-muted-foreground mt-6 text-base">{analysisResult?.analysis}</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push('/swipe')} className="font-headline w-full">Proceed to Disappointment</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
