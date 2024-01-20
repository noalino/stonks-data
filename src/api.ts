export type SearchMatch = {
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

export type MonthlyTimeSeries = {
  string: {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  };
};

type SearchResponse = {
  bestMatches: SearchMatch[];
};

type MonthlyTimeSeriesResponse = {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Time Zone': string;
  };
  'Monthly Time Series': MonthlyTimeSeries;
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
    console.log(err);
    return [];
  }
}

export async function monthlyTimeSeries(
  symbol: string
): Promise<MonthlyTimeSeriesResponse['Monthly Time Series'] | undefined> {
  const FUNCTION = 'TIME_SERIES_MONTHLY';
  const url = `${API_URL}function=${FUNCTION}&symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`;

  try {
    const data = await fetch(url);
    const results = await data.json();
    return results['Monthly Time Series'];
  } catch (err) {
    console.log(err);
    return;
  }
}
