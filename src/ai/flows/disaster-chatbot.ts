// use server'

/**
 * @fileOverview AI-powered chatbot that gives the worst dating advice imaginable and sends bizarre messages.
 *
 * - disasterChatbot - A function that handles the chatbot interaction.
 * - DisasterChatbotInput - The input type for the disasterChatbot function.
 * - DisasterChatbotOutput - The return type for the disasterChatbot function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisasterChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type DisasterChatbotInput = z.infer<typeof DisasterChatbotInputSchema>;

const DisasterChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type DisasterChatbotOutput = z.infer<typeof DisasterChatbotOutputSchema>;

export async function disasterChatbot(input: DisasterChatbotInput): Promise<DisasterChatbotOutput> {
  return disasterChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disasterChatbotPrompt',
  input: {schema: DisasterChatbotInputSchema},
  output: {schema: DisasterChatbotOutputSchema},
  prompt: `You are a dating chatbot designed to give the worst dating advice imaginable. Your responses should be bizarre, nonsensical, and unhelpful.

User message: {{{message}}}

Chatbot response:`,
});

const disasterChatbotFlow = ai.defineFlow(
  {
    name: 'disasterChatbotFlow',
    inputSchema: DisasterChatbotInputSchema,
    outputSchema: DisasterChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
