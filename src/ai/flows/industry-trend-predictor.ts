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
  prompt: `You are an expert in analyzing industry trends and predicting future skills requirements.

  Based on your knowledge and the latest market data, provide a 2-year projection of emerging and declining competencies for the following field:

  Field: {{{field}}}

  Consider technological advancements, economic factors, and evolving business needs.

  Format your response as a JSON object with two keys:
  - emergingCompetencies: An array of strings representing emerging competencies.
  - decliningCompetencies: An array of strings representing declining competencies.

  Example:
  {
    "emergingCompetencies": ["AI", "Machine Learning", "Data Science"],
    "decliningCompetencies": ["Legacy Systems", "Manual Data Entry", "Outdated Software"]
  }
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
