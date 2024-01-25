import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { type DataItem } from '@/api';
import { formatCellValue } from '@/lib/utils';
import TablePagination from './TablePagination';

type TableProps = {
  data: [string, DataItem][];
  numberOfRows?: number;
};

const CAPTION = 'Monthly Prices (open, high, low, close) and Volumes';

function CustomTable({ data, numberOfRows = 25 }: TableProps) {
  const [rows, setRows] = useState<[string, DataItem][]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setRows(
      data.filter(
        (_, index) =>
          index >= numberOfRows * (page - 1) && index < numberOfRows * page
      )
    );
  }, [data, numberOfRows, page]);

  return (
    <div className="self-stretch my-8">
      <div className="max-w-screen-md mx-auto rounded-md border">
        <Table>
          <TableCaption className="mb-2">{CAPTION}</TableCaption>
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
            {rows.map(([date, value]) => (
              <TableRow key={date}>
                <TableCell className="font-medium">{date}</TableCell>
                <TableCell className="text-right">
                  {formatCellValue(value['1. open'])}
                </TableCell>
                <TableCell className="text-right">
                  {formatCellValue(value['2. high'])}
                </TableCell>
                <TableCell className="text-right">
                  {formatCellValue(value['3. low'])}
                </TableCell>
                <TableCell className="text-right">
                  {formatCellValue(value['4. close'])}
                </TableCell>
                <TableCell className="text-right">
                  {formatCellValue(value['5. volume'], 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.length > numberOfRows && (
        <TablePagination
          page={page}
          setPage={setPage}
          rowsCount={data.length}
          offset={numberOfRows}
        />
      )}
    </div>
  );
}

export default CustomTable;
