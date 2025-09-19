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
      'A detailed career roadmap in Mermaid flowchart syntax.'
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
  prompt: `You are an expert career counselor. Generate a personalized, step-by-step career roadmap for a user to reach their desired job title, based on their skills.

Output the roadmap in Mermaid flowchart syntax (graph TD). Each node should be a clear, actionable step. Keep the steps concise and easy to understand.

Example:
graph TD
    A["Start Here: Foundational Skills"] --> B["Build Portfolio Projects"];
    B --> C["Gain Intermediate Skills"];
    C --> D["Network and Apply for Internships"];
    D --> E["Achieve Goal: Junior Developer"];


User Skills: {{{skills}}}
Desired Job Title: {{{desiredJobTitle}}}

Mermaid Flowchart:`,
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
