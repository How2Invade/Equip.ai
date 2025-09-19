'use server';
/**
 * @fileOverview An AI career counselor flow.
 *
 * - aiCareerCounselor - A function that provides career guidance based on user questions.
 * - AICareerCounselorInput - The input type for the aiCareerCounselor function.
 * - AICareerCounselorOutput - The return type for the aiCareerCounselor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICareerCounselorInputSchema = z.object({
  question: z.string().describe('The user\u0027s question about career guidance.'),
});
export type AICareerCounselorInput = z.infer<typeof AICareerCounselorInputSchema>;

const AICareerCounselorOutputSchema = z.object({
  answer: z.string().describe('The AI career counselor\u0027s response to the user\u0027s question.'),
});
export type AICareerCounselorOutput = z.infer<typeof AICareerCounselorOutputSchema>;

export async function aiCareerCounselor(input: AICareerCounselorInput): Promise<AICareerCounselorOutput> {
  return aiCareerCounselorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCareerCounselorPrompt',
  input: {schema: AICareerCounselorInputSchema},
  output: {schema: AICareerCounselorOutputSchema},
  prompt: `You are an AI career counselor. A student will ask you a question about career guidance, and you should provide a helpful and informative answer.

Question: {{{question}}}`,
});

const aiCareerCounselorFlow = ai.defineFlow(
  {
    name: 'aiCareerCounselorFlow',
    inputSchema: AICareerCounselorInputSchema,
    outputSchema: AICareerCounselorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
