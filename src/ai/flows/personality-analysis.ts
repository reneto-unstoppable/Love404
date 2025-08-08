// src/ai/flows/personality-analysis.ts
'use server';
/**
 * @fileOverview A personality analysis AI agent that generates a hilariously inaccurate compatibility score based on nonsensical quiz questions.
 *
 * - personalityAnalysis - A function that handles the personality analysis process.
 * - PersonalityAnalysisInput - The input type for the personalityAnalysis function.
 * - PersonalityAnalysisOutput - The return type for the personalityAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalityAnalysisInputSchema = z.object({
  question1: z.string().describe('Answer to the first nonsensical quiz question.'),
  question2: z.string().describe('Answer to the second nonsensical quiz question.'),
  question3: z.string().describe('Answer to the third nonsensical quiz question.'),
});
export type PersonalityAnalysisInput = z.infer<typeof PersonalityAnalysisInputSchema>;

const PersonalityAnalysisOutputSchema = z.object({
  compatibilityScore: z
    .number()
    .describe('A hilariously inaccurate compatibility score (0-100).'),
  analysis: z.string().describe('A nonsensical analysis of the user personality.'),
});
export type PersonalityAnalysisOutput = z.infer<typeof PersonalityAnalysisOutputSchema>;

export async function personalityAnalysis(input: PersonalityAnalysisInput): Promise<PersonalityAnalysisOutput> {
  return personalityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalityAnalysisPrompt',
  input: {schema: PersonalityAnalysisInputSchema},
  output: {schema: PersonalityAnalysisOutputSchema},
  prompt: `You are a highly sophisticated AI personality analyst. You are going to provide personality analysis based on the answers to 3 questions.

Analyze the following quiz answers and generate a nonsensical compatibility score between 0 and 100, and give a equally nonsensical analyses of the user's personality.

Answer 1: {{{question1}}}
Answer 2: {{{question2}}}
Answer 3: {{{question3}}}

Ensure the compatibility score is hilariously inaccurate.

Output the result in JSON format.
`,
});

const personalityAnalysisFlow = ai.defineFlow(
  {
    name: 'personalityAnalysisFlow',
    inputSchema: PersonalityAnalysisInputSchema,
    outputSchema: PersonalityAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
