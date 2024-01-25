import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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

type TableProps = {
  data: [string, DataItem][];
  numberOfRows?: number;
};

const CAPTION = 'Monthly Prices (open, high, low, close) and Volumes';

function CustomTable({ data, numberOfRows = 25 }: TableProps) {
  const pageCount = Math.ceil(data.length / numberOfRows);
  const [rows, setRows] = useState<[string, DataItem][]>([]);
  const [page, setPage] = useState(1);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(false);

  useEffect(() => {
    setRows(
      data.filter(
        (_, index) =>
          index >= numberOfRows * (page - 1) && index < numberOfRows * page
      )
    );
    setCanPreviousPage(page > 1);
    setCanNextPage(data.length - page * numberOfRows > 0);
  }, [data, numberOfRows, page]);

  return (
    <>
      <div className="rounded-md border">
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
              <TableRow>
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {page} / {pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => setPage(pageCount)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}

export default CustomTable;
