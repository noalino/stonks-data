import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import useDebounce from '@/hooks/useDebounce';

export type AutoCompleteListItem = Record<'label' | 'value', string>;

type AutoCompleteProps = {
  emptyMessage: string;
  isLoading: boolean;
  list: AutoCompleteListItem[];
  onDebouncedValueChange?: (value: string) => void;
  onInputValueChange?: (value: string) => void;
  placeholder: string;
};

function AutoComplete({
  emptyMessage,
  isLoading,
  list,
  onDebouncedValueChange,
  onInputValueChange,
  placeholder,
}: AutoCompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [showList, setShowList] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const debouncedValue = useDebounce(inputValue);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInputValue(value);
      onInputValueChange?.(value);
    },
    [onInputValueChange]
  );

  const LoadingView = () => (
    <div className="ring-1 ring-slate-200 rounded-lg p-1">
      <Skeleton className="h-8 w-full" />
    </div>
  );

  const NoResultsView = () => (
    <p className="ring-1 ring-slate-200 rounded-lg px-2 py-3 text-sm text-center">
      {emptyMessage}
    </p>
  );

  const ListView = () => (
    <ul
      role="list"
      className="w-full max-h-60 ring-1 ring-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden overflow-y-auto"
    >
      {list.map((item) => {
        return (
          <li
            key={item.value}
            value={item.value}
            className="flex items-center justify-between px-4 py-2 hover:bg-slate-300 cursor-default"
          >
            <p className="font-bold">{item.value}</p>
            <p className="text-end">{item.label}</p>
          </li>
        );
      })}
    </ul>
  );

  const Results = () => {
    if (isLoading) {
      return <LoadingView />;
    }
    if (showList) {
      return <ListView />;
    }
    if (showNoResults) {
      return <NoResultsView />;
    }
  };

  useEffect(() => {
    onDebouncedValueChange?.(debouncedValue);
  }, [debouncedValue, onDebouncedValueChange]);

  useEffect(() => {
    setShowList(list.length > 0 && !isLoading);
  }, [list, isLoading]);

  useEffect(() => {
    setShowList(list.length > 0 && !isLoading);
    setShowNoResults(inputValue.length > 0 && list.length === 0 && !isLoading);
  }, [inputValue, isLoading, list]);

  return (
    <div className="relative">
      <div className="flex h-12 items-center rounded-md border border-input bg-white pl-3 text-md ring-offset-background focus-within:ring-1 focus-within:ring-ring">
        <MagnifyingGlassIcon className="mr-2 h-6 w-6 shrink-0 opacity-50" />
        <input
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full p-2 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="w-[320px] absolute left-1/2 -translate-x-1/2 mt-2">
        <Results />
      </div>
    </div>
  );
}

export default AutoComplete;
