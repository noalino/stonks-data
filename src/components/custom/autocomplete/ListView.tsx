import { type AutoCompleteListItem } from './AutoComplete';

type ListViewProps = {
  list: AutoCompleteListItem[];
  onListItemMouseDown: (value: AutoCompleteListItem['value']) => void;
};

function ListView({ list, onListItemMouseDown }: ListViewProps) {
  return (
    <ul
      role="list"
      className="w-full max-h-60 ring-1 ring-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden overflow-y-auto"
    >
      {list.map((item) => {
        return (
          <li
            key={item.value}
            value={item.value}
            onMouseDown={() => onListItemMouseDown(item.value)}
            className="flex items-center justify-between px-4 py-2 hover:bg-slate-300 cursor-default"
          >
            <p className="font-bold">{item.value}</p>
            <p className="text-end">{item.label}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default ListView;
