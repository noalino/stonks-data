import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { search } from './api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import type { SearchMatch } from './api';

const formSchema = z.object({
  searchValue: z.string().trim().min(1),
});

function App() {
  const [disabled, setDisabled] = useState(true);
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchValue: '',
    },
  });
  const { control, handleSubmit, watch } = form;

  async function onSubmit({ searchValue }: z.infer<typeof formSchema>) {
    try {
      const assets = await search(searchValue);
      setSearchMatches(assets);
    } catch (err) {
      console.log(err);
      setSearchMatches([]);
    }
  }

  useEffect(() => {
    const subscription = watch((value) => {
      setDisabled(!value.searchValue?.trim().length);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Popover>
        <Form {...form}>
          <PopoverTrigger asChild>
            <form onSubmit={handleSubmit(onSubmit)} className="flex">
              <FormField
                control={control}
                name="searchValue"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter a product name or ISIN"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={disabled} className="ml-4">
                Search
              </Button>
            </form>
          </PopoverTrigger>
        </Form>

        {searchMatches.length > 0 && (
          <PopoverContent className="w-96 max-h-60 px-0 overflow-x-auto">
            <ul role="list" className="divide-y divide-gray-100">
              {searchMatches.map((value) => (
                <button
                  key={value['1. symbol']}
                  className="flex w-full justify-between gap-x-6 px-4 py-2 hover:bg-slate-300"
                >
                  <p className="font-bold">{value['1. symbol']}</p>
                  <p>{value['2. name']}</p>
                </button>
              ))}
            </ul>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default App;
