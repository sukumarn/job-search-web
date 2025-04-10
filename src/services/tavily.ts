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
  // TODO: Implement this by calling the Tavily API.

  return [
    {
      title: 'Software Engineer - Java',
      url: 'https://example.com/java-engineer',
      content: 'This is a Java engineering position at Example Corp.'
    },
    {
      title: 'Software Engineer - Python',
      url: 'https://example.com/python-engineer',
      content: 'This is a Python engineering position at Example Corp.'
    }
  ];
}
