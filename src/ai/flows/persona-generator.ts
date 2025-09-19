'use server';

/**
 * @fileOverview Generates a personalized career persona.
 *
 * - generatePersona - A function that generates a career persona.
 * - PersonaGeneratorInput - The input type for the generatePersona function.
 * - PersonaGeneratorOutput - The return type for the generatePersona function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaGeneratorInputSchema = z.object({
  skills: z.string().describe("A comma-separated list of the user's skills."),
  desiredJob: z.string().describe('The job title the user is aspiring to.'),
});
export type PersonaGeneratorInput = z.infer<typeof PersonaGeneratorInputSchema>;

const PersonaGeneratorOutputSchema = z.object({
  name: z.string().describe('A relatable name for the persona.'),
  gender: z.enum(['boy', 'girl']).describe('The gender of the persona.'),
  strengths: z
    .array(z.string())
    .describe('A list of 3-4 key strengths based on the user skills.'),
  weaknesses: z
    .array(z.string())
    .describe(
      'A list of 2-3 potential weaknesses or areas for improvement.'
    ),
  summary: z.string().describe('A brief, encouraging summary of the persona.'),
});
export type PersonaGeneratorOutput = z.infer<typeof PersonaGeneratorOutputSchema>;

export async function generatePersona(
  input: PersonaGeneratorInput
): Promise<PersonaGeneratorOutput> {
  return generatePersonaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personaGeneratorPrompt',
  input: {schema: PersonaGeneratorInputSchema},
  output: {schema: PersonaGeneratorOutputSchema},
  prompt: `You are a helpful and encouraging career advisor. Based on the user's skills and desired job, create a relatable student persona (a boy or a girl).

Generate a name for the persona.
Based on the provided skills and job title, identify 3-4 key strengths and 2-3 potential weaknesses.
Provide a brief, positive summary of the persona's outlook.

Keep the language simple, positive, and encouraging.

User Skills: {{{skills}}}
Desired Job: {{{desiredJob}}}`,
});

const generatePersonaFlow = ai.defineFlow(
  {
    name: 'generatePersonaFlow',
    inputSchema: PersonaGeneratorInputSchema,
    outputSchema: PersonaGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
