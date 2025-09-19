'use server';
/**
 * @fileOverview Analyzes user profiles (LinkedIn, Github) or questionnaires to extract and map skills.
 *
 * - analyzeProfile - A function that handles the profile analysis process.
 * - AnalyzeProfileInput - The input type for the analyzeProfile function.
 * - AnalyzeProfileOutput - The return type for the analyzeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProfileInputSchema = z.object({
  profileData: z.string().describe('User profile data from LinkedIn, Github, or a questionnaire.'),
});
export type AnalyzeProfileInput = z.infer<typeof AnalyzeProfileInputSchema>;

const AnalyzeProfileOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of extracted skills from the user profile.'),
  experienceSummary: z.string().describe('A summary of the user\u2019s experience.'),
});
export type AnalyzeProfileOutput = z.infer<typeof AnalyzeProfileOutputSchema>;

export async function analyzeProfile(input: AnalyzeProfileInput): Promise<AnalyzeProfileOutput> {
  return analyzeProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProfilePrompt',
  input: {schema: AnalyzeProfileInputSchema},
  output: {schema: AnalyzeProfileOutputSchema},
  prompt: `You are an AI career advisor. Analyze the following user profile data and extract the user's skills and experience.\n\nProfile Data: {{{profileData}}}\n\nSkills: (List the skills here)\nExperience Summary: (Summarize the user's experience here)`,
});

const analyzeProfileFlow = ai.defineFlow(
  {
    name: 'analyzeProfileFlow',
    inputSchema: AnalyzeProfileInputSchema,
    outputSchema: AnalyzeProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
