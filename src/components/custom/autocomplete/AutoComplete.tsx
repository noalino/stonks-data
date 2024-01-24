import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import useDebounce from '@/hooks/useDebounce';
import EmptyView from './EmptyView';
import LoadingView from './LoadingView';
import ListView from './ListView';

export type AutoCompleteListItem = Record<'label' | 'value', string>;

export type ForwardInputRef = {
  blur: () => void;
};

type AutoCompleteProps = {
  emptyMessage: string;
  isLoading: boolean;
  list: AutoCompleteListItem[];
  name?: string;
  onDebouncedValueChange?: (value: string) => void;
  onInputValueChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelectChange?: (value: string) => void;
  placeholder: string;
};

enum ViewState {
  loading,
  empty,
  success,
}

const AutoComplete = forwardRef<ForwardInputRef, AutoCompleteProps>(
  function AutoComplete(
    {
      emptyMessage,
      isLoading,
      list,
      name,
      onDebouncedValueChange,
      onInputValueChange,
      onSelectChange,
      placeholder,
    },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [selectedItem, setSelectedItem] = useState<AutoCompleteListItem>();
    const [isOpen, setIsOpen] = useState(false);
    const [isInputFocus, setIsInputFocus] = useState<boolean>();
    const [viewState, setViewState] = useState<ViewState>();
    const debouncedValue = useDebounce(inputValue);

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onInputValueChange?.(event);
        setSelectedItem(undefined);
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
      (item: AutoCompleteListItem) => {
        inputRef?.current?.blur();
        setInputValue(item.value);
        setSelectedItem(item);
        onSelectChange?.(item.value);
      },
      [inputRef, onSelectChange]
    );

    const Results = useCallback(() => {
      if (isOpen) {
        switch (viewState) {
          case ViewState.loading:
            return <LoadingView />;
          case ViewState.empty:
            return <EmptyView message={emptyMessage} />;
          case ViewState.success:
            return (
              <ListView
                list={list}
                selectedItem={selectedItem}
                onListItemMouseDown={handleMouseDown}
              />
            );
        }
      }
    }, [isOpen, viewState, emptyMessage, list, selectedItem, handleMouseDown]);

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

    useImperativeHandle(
      ref,
      () => ({
        blur() {
          inputRef.current?.blur();
        },
      }),
      []
    );

    return (
      <div className="relative w-[340px] h-full">
        <div className="flex h-full items-center rounded-md border border-input bg-white pl-3 text-md ring-offset-background focus-within:ring-1 focus-within:ring-ring">
          <MagnifyingGlassIcon className="mr-2 h-6 w-6 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            type="search"
            name={name}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full p-2 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="w-full mt-2 absolute left-1/2 -translate-x-1/2">
          <Results />
        </div>
      </div>
    );
  }
);

export default AutoComplete;
