import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function CustomTable() {
  return (
    <div className="grow self-stretch my-8 px-4 pointer-events-none">
      <div className="max-w-screen-md mx-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="opacity-25">
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="text-right">Open</TableHead>
              <TableHead className="text-right">High</TableHead>
              <TableHead className="text-right">Low</TableHead>
              <TableHead className="text-right">Close</TableHead>
              <TableHead className="text-right">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center text-base">
                <div className="font-semibold my-4">
                  To get the table with data, you need to:
                </div>
                <ol className="list-decimal list-inside font-light mb-4">
                  <li className="mb-1">
                    Find a valid symbol from the search bar
                  </li>
                  <li>
                    Click on the{' '}
                    <span className="text-sm text-white bg-primary px-2 py-2 border rounded-md">
                      GO
                    </span>{' '}
                    button or press <code>Enter</code>
                  </li>
                </ol>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CustomTable;
