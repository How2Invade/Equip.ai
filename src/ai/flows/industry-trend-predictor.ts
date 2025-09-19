'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting industry trends.
 *
 * - predictIndustryTrends - Predicts emerging and declining competencies in a specified field over the next 2 years.
 * - PredictIndustryTrendsInput - The input type for the predictIndustryTrends function.
 * - PredictIndustryTrendsOutput - The return type for the predictIndustryTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictIndustryTrendsInputSchema = z.object({
  field: z
    .string()
    .describe('The specific industry or field for which to predict trends (e.g., software engineering, marketing, healthcare).'),
});
export type PredictIndustryTrendsInput = z.infer<typeof PredictIndustryTrendsInputSchema>;

const PredictIndustryTrendsOutputSchema = z.object({
  emergingCompetencies: z.array(z.string()).describe('A list of emerging competencies expected to be important in the next 2 years.'),
  decliningCompetencies: z.array(z.string()).describe('A list of declining competencies expected to be less important in the next 2 years.'),
});
export type PredictIndustryTrendsOutput = z.infer<typeof PredictIndustryTrendsOutputSchema>;

export async function predictIndustryTrends(input: PredictIndustryTrendsInput): Promise<PredictIndustryTrendsOutput> {
  return predictIndustryTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'industryTrendPrompt',
  input: {schema: PredictIndustryTrendsInputSchema},
  output: {schema: PredictIndustryTrendsOutputSchema},
  prompt: `You are an expert in analyzing industry trends. For the given field, provide a concise, 2-year projection of the top 3-5 emerging and declining competencies. The output should be easy to understand for a student.

  Field: {{{field}}}

  Provide only the most important trends.
  `,
});

const predictIndustryTrendsFlow = ai.defineFlow(
  {
    name: 'predictIndustryTrendsFlow',
    inputSchema: PredictIndustryTrendsInputSchema,
    outputSchema: PredictIndustryTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
