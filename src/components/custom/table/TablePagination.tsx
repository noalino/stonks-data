import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { useEffect, useState, type Dispatch } from 'react';
import { Button } from '@/components/ui/button';

type TablePaginationProps = {
  offset: number;
  page: number;
  rowsCount: number;
  setPage: Dispatch<React.SetStateAction<number>>;
};

function TablePagination({
  offset,
  page,
  rowsCount,
  setPage,
}: TablePaginationProps) {
  const pageCount = Math.ceil(rowsCount / offset);
  const [canPreviousPage, setCanPreviousPage] = useState(false);
  const [canNextPage, setCanNextPage] = useState(false);

  useEffect(() => {
    setCanPreviousPage(page > 1);
    setCanNextPage(rowsCount - page * offset > 0);
  }, [rowsCount, offset, page]);

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
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
  );
}

export default TablePagination;
