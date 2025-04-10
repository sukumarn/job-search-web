/**
 * Represents the search results from Tavily.
 */
export interface TavilySearchResult {
  /**
   * The title of the search result.
   */
title: string;
  /**
   * The URL of the search result.
   */
url: string;
  /**
   * The content of the search result.
   */
content: string;
}

/**
 * Asynchronously retrieves search results from Tavily for a given query.
 *
 * @param query The search query.
 * @returns A promise that resolves to an array of TavilySearchResult objects.
 */
export async function getSearchResults(query: string): Promise<TavilySearchResult[]> {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY environment variable not set.');
    }

    const url = `https://api.tavily.com/search?q=${encodeURIComponent(query)}&api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Tavily API request failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from Tavily API.');
    }

    return data.results.map((result: any) => ({
      title: result.title || '',
      url: result.url || '',
      content: result.content || ''
    }));

  } catch (error) {
    console.error('Error fetching search results from Tavily API:', error);
    return [];
  }
}
