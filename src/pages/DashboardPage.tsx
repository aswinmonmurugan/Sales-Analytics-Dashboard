import { useState } from 'react';
import { Alert, Box, Button, Card, Pagination, Snackbar, Stack, Typography } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { AppLayout } from '../components/AppLayout';
import { DashboardSummary } from '../components/DashboardSummary';
import { SalesFiltersBar } from '../components/SalesFiltersBar';
import { SalesTable, DEFAULT_COLUMN_VISIBILITY } from '../components/SalesTable';
import { ColumnVisibilityMenu } from '../components/ColumnVisibilityMenu';
import { useSalesFilters } from '../hooks/useSalesFilters';
import { useSales } from '../hooks/useSales';
import { useCsvExport } from '../hooks/useCsvExport';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { LOCAL_STORAGE_COLUMNS_KEY, PAGE_SIZE_OPTIONS } from '../constants/sales';
import type { ColumnVisibility } from '../components/SalesTable';
import type { SortField } from '../types/sales';

export function DashboardPage() {
  const { filters, updateFilters, resetFilters, searchInput, setSearch, page, setPage, queryParams } =
    useSalesFilters();
  const { data, isLoading, isFetching, isError, error, refetch } = useSales(queryParams);
  const { exportCsv, isExporting, exportError } = useCsvExport();
  const [columnVisibility, setColumnVisibility] = useLocalStorageState<ColumnVisibility>(
    LOCAL_STORAGE_COLUMNS_KEY,
    DEFAULT_COLUMN_VISIBILITY
  );
  const [exportSnackbarOpen, setExportSnackbarOpen] = useState(false);

  const activeFilterCount = [filters.status, filters.category, filters.startDate, filters.endDate].filter(
    Boolean
  ).length;

  const handleSortChange = (field: SortField) => {
    if (filters.sortBy === field) {
      updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      updateFilters({ sortBy: field, sortOrder: 'desc' });
    }
  };

  const handleExport = async () => {
    await exportCsv(queryParams);
    setExportSnackbarOpen(true);
  };

  return (
    <AppLayout title="Sales Overview" subtitle="Track orders, revenue, and customer activity in real time">
      <Stack spacing={3}>
        <DashboardSummary />

        <Card sx={{ borderRadius: 3 }}>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ md: 'center' }}
              spacing={1.5}
              sx={{ mb: 2.5 }}
            >
              <SalesFiltersBar
                searchInput={searchInput}
                onSearchChange={setSearch}
                filters={filters}
                onFiltersChange={updateFilters}
                onReset={resetFilters}
                activeFilterCount={activeFilterCount}
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                {data ? `${data.total} order${data.total === 1 ? '' : 's'} found` : ' '}
              </Typography>
              <Stack direction="row" spacing={1}>
                <ColumnVisibilityMenu value={columnVisibility} onChange={setColumnVisibility} />
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FileDownloadRoundedIcon />}
                  onClick={handleExport}
                  disabled={isExporting || !data || data.total === 0}
                >
                  {isExporting ? 'Exporting…' : 'Export CSV'}
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              <SalesTable
                orders={data?.data ?? []}
                isLoading={isLoading || (isFetching && !data)}
                isError={isError}
                errorMessage={(error as { message?: string })?.message}
                onRetry={refetch}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
                visibleColumns={columnVisibility}
                pageSize={filters.limit}
              />
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={1.5}
              sx={{ mt: 2 }}
            >
              <Typography
                component="label"
                variant="caption"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                Rows per page
                <select
                  value={filters.limit}
                  onChange={(e) => updateFilters({ limit: Number(e.target.value) })}
                  style={{ fontFamily: 'inherit', fontSize: '0.8rem', padding: '2px 4px' }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </Typography>

              {data && data.totalPages > 1 && (
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  size="small"
                />
              )}
            </Stack>
          </Box>
        </Card>
      </Stack>

      <Snackbar
        open={exportSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setExportSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={exportError ? 'error' : 'success'}
          onClose={() => setExportSnackbarOpen(false)}
          variant="filled"
        >
          {exportError ?? 'CSV exported successfully.'}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
