import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { search } from './api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  searchValue: z.string().trim().min(1),
});

function App() {
  const [disabled, setDisabled] = useState(true);
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
      console.log(assets);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const subscription = watch((value) => {
      setDisabled(value.searchValue?.length === 0 ?? true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex">
          <FormField
            control={control}
            name="searchValue"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter a product name or ISIN"
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
      </Form>
    </div>
  );
}

export default App;
