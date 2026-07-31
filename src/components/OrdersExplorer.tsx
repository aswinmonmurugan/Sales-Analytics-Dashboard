import { useState } from 'react';
import { Alert, Box, Button, Card, Chip, Pagination, Snackbar, Stack, Typography } from '@mui/material';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { SalesFiltersBar } from './SalesFiltersBar';
import { SalesTable, DEFAULT_COLUMN_VISIBILITY } from './SalesTable';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { useSalesFilters } from '../hooks/useSalesFilters';
import { useSales } from '../hooks/useSales';
import { useCsvExport } from '../hooks/useCsvExport';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { LOCAL_STORAGE_COLUMNS_KEY, PAGE_SIZE_OPTIONS } from '../constants/sales';
import type { ColumnVisibility } from './SalesTable';
import type { SortField } from '../types/sales';

interface OrdersExplorerProps {
  /**
   * 'workbench' — the full search/filter/sort/export experience (Orders page).
   * 'glance'    — a quiet, read-only preview of the most recent orders (Dashboard page).
   */
  variant?: 'workbench' | 'glance';
  /** Rows to show when variant="glance". Defaults to 5. */
  glanceLimit?: number;
  /** Called when the "View all orders" link is clicked in glance mode. */
  onViewAll?: () => void;
}

/**
 * Self-contained order search, filter, sort, and export experience.
 * Used on the Dashboard (as a compact "glance" preview alongside the KPI
 * summary) and on the dedicated Orders page (as the full "workbench"), so
 * the filtering/table logic only lives in one place while the two contexts
 * can still look and feel distinct.
 */
export function OrdersExplorer({ variant = 'workbench', glanceLimit = 5, onViewAll }: OrdersExplorerProps) {
  const isGlance = variant === 'glance';
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

  // Glance mode trims to the latest N rows client-side rather than touching
  // the shared filter/pagination state, so the widget stays read-only.
  const rowsToShow = isGlance ? (data?.data ?? []).slice(0, glanceLimit) : data?.data ?? [];

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: isGlance ? 'none' : '0 1px 3px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Box sx={{ p: { xs: 2, md: isGlance ? 2 : 2.5 } }}>
          {isGlance ? (
            // ---- Glance header: quiet, editorial, oriented around "what just happened" ----
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="subtitle1" fontWeight={700}>
                  Sales History
                </Typography>
                {!isLoading && data && (
                  <Typography variant="caption" color="text.secondary">
                    {data.total} total
                  </Typography>
                )}
              </Stack>
              {onViewAll && (
                <Button
                  onClick={onViewAll}
                  size="small"
                  endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  View all orders
                </Button>
              )}
            </Stack>
          ) : (
            // ---- Workbench header: a distinct "control panel" band that houses the filters ----
            <Box
              sx={{
                mx: { xs: -2, md: -2.5 },
                mt: { xs: -2, md: -2.5 },
                mb: 2.5,
                px: { xs: 2, md: 2.5 },
                py: 2,
                bgcolor: 'rgba(15, 23, 42, 0.025)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ md: 'center' }}
                spacing={1.5}
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
            </Box>
          )}

          {!isGlance && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {data ? `${data.total} order${data.total === 1 ? '' : 's'} found` : ' '}
                </Typography>
                {activeFilterCount > 0 && (
                  <Chip
                    label={`${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} applied`}
                    size="small"
                    onDelete={resetFilters}
                    sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                  />
                )}
              </Stack>
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
          )}

          <Box
            sx={{
              border: isGlance ? 'none' : '1px solid',
              borderColor: 'divider',
              borderRadius: isGlance ? 0 : 2,
              overflow: 'hidden',
            }}
          >
            <SalesTable
              orders={rowsToShow}
              isLoading={isLoading || (isFetching && !data)}
              isError={isError}
              errorMessage={(error as { message?: string })?.message}
              onRetry={refetch}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={handleSortChange}
              visibleColumns={columnVisibility}
              pageSize={isGlance ? glanceLimit : filters.limit}
            />
          </Box>

          {!isGlance && (
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
          )}

          {isGlance && !isLoading && data && data.total === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
              No orders yet — new orders will show up here as they come in.
            </Typography>
          )}
        </Box>
      </Card>

      {!isGlance && (
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
      )}
    </>
  );
}