import {
  Box,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  IconButton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ORDER_STATUSES, PRODUCT_CATEGORIES } from '../constants/sales';
import type { PersistedFilters } from '../hooks/useSalesFilters';
import type { OrderStatus } from '../types/sales';

interface SalesFiltersBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  filters: PersistedFilters;
  onFiltersChange: (patch: Partial<PersistedFilters>) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export function SalesFiltersBar({
  searchInput,
  onSearchChange,
  filters,
  onFiltersChange,
  onReset,
  activeFilterCount,
}: SalesFiltersBarProps) {
  const startDateValue: Dayjs | null = filters.startDate ? dayjs(filters.startDate) : null;
  const endDateValue: Dayjs | null = filters.endDate ? dayjs(filters.endDate) : null;

  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
        <TextField
          size="small"
          placeholder="Search order ID, customer, or product…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ minWidth: 280, flexGrow: 1 }}
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

        <TextField
          size="small"
          select
          label="Status"
          value={filters.status}
          onChange={(e) => onFiltersChange({ status: e.target.value as OrderStatus | '' })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All statuses</MenuItem>
          {ORDER_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          select
          label="Category"
          value={filters.category}
          onChange={(e) => onFiltersChange({ category: e.target.value })}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All categories</MenuItem>
          {PRODUCT_CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="From"
          value={startDateValue}
          onChange={(val) => onFiltersChange({ startDate: val ? val.startOf('day').toISOString() : null })}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
          maxDate={endDateValue ?? undefined}
        />
        <DatePicker
          label="To"
          value={endDateValue}
          onChange={(val) => onFiltersChange({ endDate: val ? val.endOf('day').toISOString() : null })}
          slotProps={{ textField: { size: 'small', sx: { minWidth: 150 } } }}
          minDate={startDateValue ?? undefined}
        />

        <Tooltip title="Reset all filters">
          <span>
            <IconButton onClick={onReset} disabled={activeFilterCount === 0 && !searchInput}>
              <RestartAltRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {activeFilterCount > 0 && (
        <Box>
          <Chip
            size="small"
            variant="outlined"
            label={`${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
            onDelete={onReset}
          />
        </Box>
      )}
    </Stack>
  );
}
