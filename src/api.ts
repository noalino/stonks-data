type SearchMatch = {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
};

type SearchResponse = {
  bestMatches: SearchMatch[];
};

const API_URL = 'https://www.alphavantage.co/query?';

export async function search(
  value: string
): Promise<SearchResponse['bestMatches']> {
  const FUNCTION = 'SYMBOL_SEARCH';
  const url = `${API_URL}function=${FUNCTION}&keywords=${value}&apikey=${import.meta.env.VITE_API_KEY}`;

  try {
    const data = await fetch(url);
    const results = await data.json();
    return results['bestMatches'];
  } catch (err) {
    return [];
  }
}
