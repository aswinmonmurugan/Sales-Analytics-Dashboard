import {
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { STATUS_COLOR_MAP } from '../constants/sales';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import type { SalesOrder, SortField, SortOrder } from '../types/sales';

export interface ColumnVisibility {
  category: boolean;
  quantity: boolean;
  orderDate: boolean;
}

interface SalesTableProps {
  orders: SalesOrder[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  visibleColumns: ColumnVisibility;
  pageSize: number;
}

const SORTABLE_FIELDS: { field: SortField; label: string }[] = [
  { field: 'orderDate', label: 'Order Date' },
  { field: 'amount', label: 'Amount' },
  { field: 'quantity', label: 'Quantity' },
];

function SkeletonRows({ rows, visibleColumns }: { rows: number; visibleColumns: ColumnVisibility }) {
  const columnCount = 5 + (visibleColumns.category ? 1 : 0) + (visibleColumns.quantity ? 1 : 0) + (visibleColumns.orderDate ? 1 : 0);
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columnCount }).map((__, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function SalesTable({
  orders,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  sortBy,
  sortOrder,
  onSortChange,
  visibleColumns,
  pageSize,
}: SalesTableProps) {
  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (!isLoading && orders.length === 0) {
    return <EmptyState />;
  }

  return (
    <TableContainer sx={{ maxHeight: 640 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Product Name</TableCell>
            {visibleColumns.category && <TableCell>Category</TableCell>}
            {visibleColumns.quantity && (
              <TableCell sortDirection={sortBy === 'quantity' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'quantity'}
                  direction={sortBy === 'quantity' ? sortOrder : 'asc'}
                  onClick={() => onSortChange('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell sortDirection={sortBy === 'amount' ? sortOrder : false}>
              <TableSortLabel
                active={sortBy === 'amount'}
                direction={sortBy === 'amount' ? sortOrder : 'asc'}
                onClick={() => onSortChange('amount')}
              >
                Amount
              </TableSortLabel>
            </TableCell>
            {visibleColumns.orderDate && (
              <TableCell sortDirection={sortBy === 'orderDate' ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === 'orderDate'}
                  direction={sortBy === 'orderDate' ? sortOrder : 'asc'}
                  onClick={() => onSortChange('orderDate')}
                >
                  Order Date
                </TableSortLabel>
              </TableCell>
            )}
            <TableCell>Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <SkeletonRows rows={pageSize} visibleColumns={visibleColumns} />
          ) : (
            orders.map((order) => (
              <TableRow key={order.orderId} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order.orderId}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.productName}</TableCell>
                {visibleColumns.category && <TableCell>{order.category}</TableCell>}
                {visibleColumns.quantity && <TableCell>{formatNumber(order.quantity)}</TableCell>}
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(order.amount)}</TableCell>
                {visibleColumns.orderDate && <TableCell>{formatDate(order.orderDate)}</TableCell>}
                <TableCell>
                  <Chip size="small" label={order.status} color={STATUS_COLOR_MAP[order.status]} variant="outlined" />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { SORTABLE_FIELDS };
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  category: true,
  quantity: true,
  orderDate: true,
};
