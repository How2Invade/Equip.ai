'use server';

/**
 * @fileOverview Provides personalized career recommendations and skill assessments based on user's recorded career aspirations and concerns.
 *
 * - voiceCareerConsultation - A function that handles the voice-based career consultation process.
 * - VoiceCareerConsultationInput - The input type for the voiceCareerConsultation function.
 * - VoiceCareerConsultationOutput - The return type for the voiceCareerConsultation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VoiceCareerConsultationInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of the user's career aspirations and concerns, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceCareerConsultationInput = z.infer<typeof VoiceCareerConsultationInputSchema>;

const VoiceCareerConsultationOutputSchema = z.object({
  analysis: z.string().describe('A concise AI analysis of the user audio recording.'),
  recommendations: z.string().describe('Personalized and actionable career recommendations.'),
  skillAssessments: z.string().describe('A brief assessment of key skills mentioned or implied.'),
  podcastRecommendations: z.string().describe('A few relevant podcast recommendations for the user.'),
});
export type VoiceCareerConsultationOutput = z.infer<typeof VoiceCareerConsultationOutputSchema>;

export async function voiceCareerConsultation(
  input: VoiceCareerConsultationInput
): Promise<VoiceCareerConsultationOutput> {
  return voiceCareerConsultationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceCareerConsultationPrompt',
  input: {schema: VoiceCareerConsultationInputSchema},
  output: {schema: VoiceCareerConsultationOutputSchema},
  prompt: `You are an AI career advisor. Analyze the user's recording of their career aspirations and concerns.
Provide a concise, personalized, and easy-to-understand analysis.

- Briefly summarize the user's main points.
- Offer 2-3 actionable recommendations.
- Briefly assess their key skills.
- Suggest 1-2 relevant podcasts.

User Recording: {{media url=audioDataUri}}
`,
});

const voiceCareerConsultationFlow = ai.defineFlow(
  {
    name: 'voiceCareerConsultationFlow',
    inputSchema: VoiceCareerConsultationInputSchema,
    outputSchema: VoiceCareerConsultationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
