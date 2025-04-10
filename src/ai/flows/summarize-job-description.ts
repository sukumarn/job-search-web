// The files in this folder are server files.
'use server';
/**
 * @fileOverview Summarizes job descriptions to extract key responsibilities and requirements.
 *
 * - summarizeJobDescription - A function that summarizes the job description.
 * - SummarizeJobDescriptionInput - The input type for the summarizeJobDescription function.
 * - SummarizeJobDescriptionOutput - The return type for the summarizeJobDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The full job description to summarize.'),
});
export type SummarizeJobDescriptionInput = z.infer<typeof SummarizeJobDescriptionInputSchema>;

const SummarizeJobDescriptionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the job description.'),
});
export type SummarizeJobDescriptionOutput = z.infer<typeof SummarizeJobDescriptionOutputSchema>;

export async function summarizeJobDescription(input: SummarizeJobDescriptionInput): Promise<SummarizeJobDescriptionOutput> {
  return summarizeJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJobDescriptionPrompt',
  input: {
    schema: z.object({
      jobDescription: z.string().describe('The full job description to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the job description.'),
    }),
  },
  prompt: `Summarize the following job description, extracting the key responsibilities and requirements.\n\nJob Description: {{{jobDescription}}}`,
});

const summarizeJobDescriptionFlow = ai.defineFlow<
  typeof SummarizeJobDescriptionInputSchema,
  typeof SummarizeJobDescriptionOutputSchema
>({
  name: 'summarizeJobDescriptionFlow',
  inputSchema: SummarizeJobDescriptionInputSchema,
  outputSchema: SummarizeJobDescriptionOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
