import {
  Box,
  Card,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { AppLayout } from '../components/AppLayout';
import { CustomersTable } from '../components/CustomersTable';
import { useCustomers } from '../hooks/useCustomers';
import { useCustomerFilters } from '../hooks/useCustomerFilters';

export function CustomersPage() {
  const { searchInput, setSearch, sortBy, sortOrder, handleSortChange, page, setPage, queryParams } =
    useCustomerFilters();
  const { data, isLoading, isFetching, isError, error, refetch } = useCustomers(queryParams);

  return (
    <AppLayout title="Customers" subtitle="Understand who's buying, how often, and how much">
      <Card sx={{ borderRadius: 3 }}>
        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'center' }}
            spacing={1.5}
            sx={{ mb: 2.5 }}
          >
            <TextField
              size="small"
              placeholder="Search customer name…"
              value={searchInput}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 280 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {data ? `${data.total} customer${data.total === 1 ? '' : 's'} found` : ' '}
            </Typography>
          </Stack>

          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <CustomersTable
              customers={data?.data ?? []}
              isLoading={isLoading || (isFetching && !data)}
              isError={isError}
              errorMessage={(error as { message?: string })?.message}
              onRetry={refetch}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              pageSize={queryParams.limit}
            />
          </Box>

          {data && data.totalPages > 1 && (
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
              />
            </Stack>
          )}
        </Box>
      </Card>
    </AppLayout>
  );
}
