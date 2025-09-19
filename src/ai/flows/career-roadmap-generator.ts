'use server';

/**
 * @fileOverview Generates a personalized career roadmap based on user skills and market data.
 *
 * - generateCareerRoadmap - A function that generates the career roadmap.
 * - CareerRoadmapInput - The input type for the generateCareerRoadmap function.
 * - CareerRoadmapOutput - The return type for the generateCareerRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerRoadmapInputSchema = z.object({
  skills: z
    .string()
    .describe("A comma separated list of the user's skills and experiences."),
  desiredJobTitle: z
    .string()
    .describe('The job title the user is aspiring towards.'),
});
export type CareerRoadmapInput = z.infer<typeof CareerRoadmapInputSchema>;

const CareerRoadmapOutputSchema = z.object({
  roadmap: z
    .string()
    .describe(
      'A detailed career roadmap, outlining steps, skills to acquire, and potential roles to pursue to reach the desired job title.'
    ),
});
export type CareerRoadmapOutput = z.infer<typeof CareerRoadmapOutputSchema>;

export async function generateCareerRoadmap(
  input: CareerRoadmapInput
): Promise<CareerRoadmapOutput> {
  return generateCareerRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerRoadmapPrompt',
  input: {schema: CareerRoadmapInputSchema},
  output: {schema: CareerRoadmapOutputSchema},
  prompt: `You are an expert career counselor. Generate a detailed career roadmap for a student, outlining the necessary steps, skills to acquire, and potential roles to pursue, to reach their desired job title.

Skills: {{{skills}}}
Desired Job Title: {{{desiredJobTitle}}}

Roadmap:`,
});

const generateCareerRoadmapFlow = ai.defineFlow(
  {
    name: 'generateCareerRoadmapFlow',
    inputSchema: CareerRoadmapInputSchema,
    outputSchema: CareerRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
