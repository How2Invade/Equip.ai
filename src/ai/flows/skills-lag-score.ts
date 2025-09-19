'use server';

/**
 * @fileOverview Provides an analysis of how a user's skills compare to the industry average for a desired career.
 *
 * - analyzeSkillsLag - A function that analyzes the skill gap.
 * - SkillsLagInput - The input type for the analyzeSkillsLag function.
 * - SkillsLagOutput - The return type for the analyzeSkillsLag function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsLagInputSchema = z.object({
  userSkills: z
    .string()
    .describe('A list of skills possessed by the user, comma separated.'),
  desiredCareer: z.string().describe('The desired career for the user.'),
});
export type SkillsLagInput = z.infer<typeof SkillsLagInputSchema>;

const SkillsLagOutputSchema = z.object({
  skillGaps: z
    .string()
    .describe(
      'An analysis of the user skills compared to the industry average for the desired career, with specific improvements suggested.'
    ),
});
export type SkillsLagOutput = z.infer<typeof SkillsLagOutputSchema>;

export async function analyzeSkillsLag(input: SkillsLagInput): Promise<SkillsLagOutput> {
  return analyzeSkillsLagFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillsLagPrompt',
  input: {schema: SkillsLagInputSchema},
  output: {schema: SkillsLagOutputSchema},
  prompt: `You are a career advisor who analyzes a user's skills and compares them to the industry average for their desired career.

  User Skills: {{{userSkills}}}
  Desired Career: {{{desiredCareer}}}

  Provide an analysis of how the user's skills compare to the industry average for the desired career, with a breakdown by category and specific improvements suggested.
  `,
});

const analyzeSkillsLagFlow = ai.defineFlow(
  {
    name: 'analyzeSkillsLagFlow',
    inputSchema: SkillsLagInputSchema,
    outputSchema: SkillsLagOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
