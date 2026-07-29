import { Alert, Grid } from '@mui/material';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { KpiCard } from './KpiCard';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import { formatCurrency, formatNumber } from '../utils/format';

export function DashboardSummary() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary();

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <button onClick={() => refetch()} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600 }}>
            Retry
          </button>
        }
        sx={{ mb: 1 }}
      >
        {(error as { message?: string })?.message ?? 'Failed to load dashboard summary.'}
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label="Total Sales"
          value={data ? formatCurrency(data.totalSales) : '—'}
          icon={<PaidRoundedIcon />}
          loading={isLoading}
          accentColor="#0E6B5C"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label="Total Orders"
          value={data ? formatNumber(data.totalOrders) : '—'}
          icon={<ReceiptLongRoundedIcon />}
          loading={isLoading}
          accentColor="#2C6E8F"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label="Total Customers"
          value={data ? formatNumber(data.totalCustomers) : '—'}
          icon={<GroupRoundedIcon />}
          loading={isLoading}
          accentColor="#C97A2B"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <KpiCard
          label="Average Order Value"
          value={data ? formatCurrency(data.averageOrderValue) : '—'}
          icon={<TrendingUpRoundedIcon />}
          loading={isLoading}
          accentColor="#B3432B"
        />
      </Grid>
    </Grid>
  );
}
