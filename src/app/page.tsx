'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';
import {getSearchResults} from '@/services/tavily';
import {summarizeJobDescription} from '@/ai/flows/summarize-job-description';
import {cn} from '@/lib/utils';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import { Icons } from '@/components/icons';

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [jobs, setJobs] = useState<
    {title: string; url: string; summary: string}[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResults = await getSearchResults(keywords);
      const processedJobs = await Promise.all(
        searchResults.map(async (result) => {
          try {
            const summaryResult = await summarizeJobDescription({
              jobDescription: result.content,
            });
            return {
              title: result.title,
              url: result.url,
              summary: summaryResult.summary,
            };
          } catch (aiError: any) {
            console.error('Error summarizing job description:', aiError);
            return {
              title: result.title,
              url: result.url,
              summary: 'Failed to summarize job description.',
            };
          }
        })
      );
      setJobs(processedJobs);
    } catch (searchError: any) {
      console.error('Error during job search:', searchError);
      setError('Failed to fetch job postings. Please try again.');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <h1 className="text-2xl font-semibold mb-4">JobScout</h1>
      <div className="flex w-full max-w-md space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter job keywords (e.g., Java, Python)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Search'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <Icons.close className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 w-full max-w-4xl">
        {jobs.map((job, index) => (
          <Card
            key={index}
            className="bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                {job.summary}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => window.open(job.url, '_blank')}
              >
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
