import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type DataItem } from '@/api';

type TableProps = {
  data: [string, DataItem][];
};

function CustomTable({ data }: TableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead className="text-right">Open</TableHead>
          <TableHead className="text-right">High</TableHead>
          <TableHead className="text-right">Low</TableHead>
          <TableHead className="text-right">Close</TableHead>
          <TableHead className="text-right">Volume</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(([date, value]) => (
          <TableRow>
            <TableCell className="font-medium">{date}</TableCell>
            <TableCell className="text-right">{value['1. open']}</TableCell>
            <TableCell className="text-right">{value['2. high']}</TableCell>
            <TableCell className="text-right">{value['3. low']}</TableCell>
            <TableCell className="text-right">{value['4. close']}</TableCell>
            <TableCell className="text-right">{value['5. volume']}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default CustomTable;
