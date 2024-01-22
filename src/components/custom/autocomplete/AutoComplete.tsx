import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import useDebounce from '@/hooks/useDebounce';
import EmptyView from './EmptyView';
import LoadingView from './LoadingView';
import ListView from './ListView';

export type AutoCompleteListItem = Record<'label' | 'value', string>;

type AutoCompleteProps = {
  emptyMessage: string;
  isLoading: boolean;
  list: AutoCompleteListItem[];
  onDebouncedValueChange?: (value: string) => void;
  onInputValueChange?: (value: string) => void;
  placeholder: string;
};

enum ViewState {
  loading,
  empty,
  success,
}

function AutoComplete({
  emptyMessage,
  isLoading,
  list,
  onDebouncedValueChange,
  onInputValueChange,
  placeholder,
}: AutoCompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isInputFocus, setIsInputFocus] = useState<boolean>();
  const [viewState, setViewState] = useState<ViewState>();
  const debouncedValue = useDebounce(inputValue);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInputValue(value);
      onInputValueChange?.(value);
    },
    [onInputValueChange]
  );

  const handleInputFocus = useCallback(() => {
    setIsOpen(inputValue.length > 0);
    setIsInputFocus(true);
  }, [inputValue]);

  const handleInputBlur = useCallback(() => {
    setIsOpen(false);
    setIsInputFocus(false);
  }, []);

  const handleMouseDown = useCallback(
    (value: AutoCompleteListItem['value']) => {
      inputRef.current?.blur();
      setInputValue(value);
    },
    []
  );

  const Results = useCallback(() => {
    if (isOpen) {
      switch (viewState) {
        case ViewState.loading:
          return <LoadingView />;
        case ViewState.empty:
          return <EmptyView message={emptyMessage} />;
        case ViewState.success:
          return <ListView list={list} onListItemMouseDown={handleMouseDown} />;
      }
    }
  }, [isOpen, viewState, emptyMessage, list, handleMouseDown]);

  useEffect(() => {
    onDebouncedValueChange?.(debouncedValue);
  }, [debouncedValue, onDebouncedValueChange]);

  useEffect(() => {
    setIsOpen(!!isInputFocus && inputValue.length > 0);

    if (isLoading) {
      setViewState(ViewState.loading);
    } else if (list.length > 0) {
      setViewState(ViewState.success);
    } else if (inputValue.length > 0) {
      setViewState(ViewState.empty);
    }
  }, [inputValue, isInputFocus, isLoading, list]);

  return (
    <div className="relative">
      <div className="flex h-12 items-center rounded-md border border-input bg-white pl-3 text-md ring-offset-background focus-within:ring-1 focus-within:ring-ring">
        <MagnifyingGlassIcon className="mr-2 h-6 w-6 shrink-0 opacity-50" />
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
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
