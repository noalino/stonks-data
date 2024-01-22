import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { type AutoCompleteListItem } from './AutoComplete';

type ListViewProps = {
  list: AutoCompleteListItem[];
  onListItemMouseDown: (value: AutoCompleteListItem) => void;
  selectedItem?: AutoCompleteListItem;
};

function ListView({ list, onListItemMouseDown, selectedItem }: ListViewProps) {
  return (
    <ul
      role="list"
      className="w-full max-h-60 ring-1 ring-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden overflow-y-auto"
    >
      {list.map((item) => {
        const isSelected = selectedItem?.value === item.value;
        return (
          <li
            key={item.value}
            value={item.value}
            onMouseDown={() => onListItemMouseDown(item)}
            className="flex items-center justify-between px-4 py-2 hover:bg-slate-300 cursor-default"
          >
            <div className="flex items-center">
              {isSelected ? <CheckIcon className="h-6 w-6 mr-2" /> : null}
              <p className={cn('pr-4 font-bold', isSelected ? null : 'pl-8')}>
                {item.value}
              </p>
            </div>
            <p className="text-end">{item.label}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default ListView;
