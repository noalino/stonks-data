import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { search } from './api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import './App.css';

const formSchema = z.object({
  searchValue: z.string().trim().min(1),
});

function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchValue: '',
    },
  });

  async function onSubmit({ searchValue }: z.infer<typeof formSchema>) {
    try {
      const assets = await search(searchValue);
      console.log(assets);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center"
      >
        <FormField
          control={form.control}
          name="searchValue"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter a product name or ISIN" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.getFieldState('searchValue').invalid}
          className="mx-4"
        >
          Search
        </Button>
      </form>
    </Form>
  );
}

export default App;
