import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import AutoComplete, {
  type AutoCompleteListItem,
} from '@/components/custom/autocomplete/AutoComplete';
import { search } from './api';

const formSchema = z.object({
  symbol: z.string().trim().min(1),
});

function App() {
  const [searchResults, setSearchResults] = useState<AutoCompleteListItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitDisabled, setIiSubmitDisabled] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: '',
    },
  });
  const { control, handleSubmit, setValue } = form;

  const handleInputValueChange = useCallback((value: string) => {
    if (!value?.length) {
      setSearchResults([]);
      setIsLoading(false);
      setIiSubmitDisabled(true);
      return;
    }
    setIsLoading(true);
    setIiSubmitDisabled(false);
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

  const handleSelectChange = useCallback(
    (value: string) => {
      setValue('symbol', value);
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async ({ symbol }: z.infer<typeof formSchema>) => {
      // Get historical data
    },
    []
  );

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
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
    </div>
  );
}

export default App;
