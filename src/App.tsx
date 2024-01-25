import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import AutoComplete, {
  type AutoCompleteListItem,
  type ForwardInputRef,
} from '@/components/custom/autocomplete/AutoComplete';
import Table from '@/components/custom/table/Table';
import TableSkeleton from '@/components/custom/table/TableSkeleton';
import { monthlyTimeSeries, search, type DataItem } from './api';
import Header from './Header';
import Footer from './Footer';

const formSchema = z.object({
  symbol: z.string().trim().min(1),
});

function App() {
  const searchAbortControllerRef = useRef<AbortController>();
  const timeSeriesAbortControllerRef = useRef<AbortController>();
  const autoCompleteRef = useRef<ForwardInputRef>(null);
  const [searchResults, setSearchResults] = useState<AutoCompleteListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIiSubmitDisabled] = useState(true);
  const [tableData, setTableData] = useState<[string, DataItem][]>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
    },
  });
  const { control, handleSubmit, setValue } = form;

  const handleInputValueChange = useCallback((value: string) => {
    searchAbortControllerRef.current?.abort();

    if (!value?.length || value.trim().length === 0) {
      setSearchResults([]);
      setIsLoading(false);
      setIiSubmitDisabled(true);
      return;
    }
    setIsLoading(true);
    setIiSubmitDisabled(false);
  }, []);

  const handleDebounceValueChange = useCallback(async (value: string) => {
    if (!value?.length) {
      return;
    }

    const newSearchAbortController = new AbortController();
    searchAbortControllerRef.current = newSearchAbortController;

    try {
      const rawResults = await search(value, newSearchAbortController.signal);
      const results = rawResults?.map((item) => ({
        label: item['2. name'],
        value: item['1. symbol'],
      }));
      setSearchResults(results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectChange = useCallback(
    (value: string) => {
      setValue('symbol', value);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async ({ symbol }: z.infer<typeof formSchema>) => {
      autoCompleteRef.current?.blur();
      setErrorMessage(undefined);

      timeSeriesAbortControllerRef.current?.abort();

      const newTimeSeriesAbortController = new AbortController();
      timeSeriesAbortControllerRef.current = newTimeSeriesAbortController;

      try {
        const rawResults = await monthlyTimeSeries(
          symbol,
          newTimeSeriesAbortController.signal
        );
        const results = Object.entries(rawResults ?? []);
        setTableData(results);
      } catch (err) {
        if (typeof err === 'string') {
          setErrorMessage(err);
        } else if (err instanceof Error) {
          setErrorMessage(err.message);
        }
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      // Cleanup
      searchAbortControllerRef.current?.abort();
      timeSeriesAbortControllerRef.current?.abort();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />

      <div className="relative">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex h-12">
            <FormField
              control={control}
              name="symbol"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <AutoComplete
                        ref={autoCompleteRef}
                        list={searchResults}
                        isLoading={isLoading}
                        onInputValueChange={(event) => {
                          handleInputValueChange(event.target.value);
                          field.onChange(event);
                        }}
                        onDebouncedValueChange={handleDebounceValueChange}
                        onSelectChange={handleSelectChange}
                        name={field.name}
                        placeholder="Symbol"
                        emptyMessage="No Results Found."
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-full ml-4"
            >
              GO
            </Button>
          </form>
        </Form>
        {!!errorMessage && (
          <p className="absolute text-red-500">{errorMessage}</p>
        )}
      </div>

      {tableData && tableData.length > 0 ? (
        <Table data={tableData} />
      ) : (
        <TableSkeleton />
      )}

      <Footer />
    </div>
  );
}

export default App;
