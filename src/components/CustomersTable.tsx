import {
  Avatar,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import type { CustomerSortField, CustomerSummary, SortOrder } from '../types/sales';

interface CustomersTableProps {
  customers: CustomerSummary[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  sortBy: CustomerSortField;
  sortOrder: SortOrder;
  onSortChange: (field: CustomerSortField) => void;
  pageSize: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

function SkeletonRows({ rows }: { rows: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: 6 }).map((__, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function CustomersTable({
  customers,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  sortBy,
  sortOrder,
  onSortChange,
  pageSize,
}: CustomersTableProps) {
  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (!isLoading && customers.length === 0) {
    return <EmptyState title="No customers found" description="Try adjusting your search to find who you're looking for." />;
  }

  return (
    <TableContainer sx={{ maxHeight: 640 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sortDirection={sortBy === 'customerName' ? sortOrder : false}>
              <TableSortLabel
                active={sortBy === 'customerName'}
                direction={sortBy === 'customerName' ? sortOrder : 'asc'}
                onClick={() => onSortChange('customerName')}
              >
                Customer
              </TableSortLabel>
               {/* <TableSortLabel
                active={sortBy === 'customerName'}
                direction={sortBy === 'customerName' ? sortOrder : 'asc'}
                onClick={() => onSortChange('customerName')}
              >
                name
              </TableSortLabel> */}
            </TableCell>
            <TableCell sortDirection={sortBy === 'totalOrders' ? sortOrder : false}>
              <TableSortLabel
                active={sortBy === 'totalOrders'}
                direction={sortBy === 'totalOrders' ? sortOrder : 'asc'}
                onClick={() => onSortChange('totalOrders')}
              >
                Total Orders
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortBy === 'totalSpent' ? sortOrder : false}>
              <TableSortLabel
                active={sortBy === 'totalSpent'}
                direction={sortBy === 'totalSpent' ? sortOrder : 'asc'}
                onClick={() => onSortChange('totalSpent')}
              >
                Total Spent
              </TableSortLabel>
            </TableCell>
            <TableCell>Avg. Order Value</TableCell>
            <TableCell>Top Category</TableCell>
            <TableCell sortDirection={sortBy === 'lastOrderDate' ? sortOrder : false}>
              <TableSortLabel
                active={sortBy === 'lastOrderDate'}
                direction={sortBy === 'lastOrderDate' ? sortOrder : 'asc'}
                onClick={() => onSortChange('lastOrderDate')}
              >
                Last Order
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <SkeletonRows rows={pageSize} />
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.customerName} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                      {getInitials(customer.customerName)}
                    </Avatar>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {customer.customerName}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{formatNumber(customer.totalOrders)}</TableCell>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(customer.totalSpent)}
                </TableCell>
                <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatCurrency(customer.averageOrderValue)}
                </TableCell>
                <TableCell>
                  <Chip size="small" label={customer.topCategory} variant="outlined" />
                </TableCell>
                <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
