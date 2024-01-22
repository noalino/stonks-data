import { useCallback, useState } from 'react';

import { search } from './api';
import AutoComplete, {
  type AutoCompleteListItem,
} from '@/components/custom/autocomplete/AutoComplete';

function App() {
  const [searchResults, setSearchResults] = useState<AutoCompleteListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleInputValueChange = useCallback((value: string) => {
    if (!value?.length) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
  }, []);

  const handleDebounceValueChange = useCallback((value: string) => {
    if (!value?.length) {
      return;
    }

    const searchSymbols = async () => {
      try {
        const rawResults = await search(value);
        const results = rawResults.map((item) => ({
          label: item['2. name'],
          value: item['1. symbol'],
        }));
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchSymbols();
  }, []);


  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <AutoComplete
        list={searchResults}
        isLoading={isLoading}
        onInputValueChange={handleInputValueChange}
        onDebouncedValueChange={handleDebounceValueChange}
        placeholder="Symbol"
        emptyMessage="No Results Found."
      />
    </div>
  );
}

export default App;
