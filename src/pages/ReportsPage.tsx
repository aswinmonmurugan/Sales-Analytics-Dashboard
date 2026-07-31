import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import { AppLayout } from '../components/AppLayout';
// import { RevenueTrendChart } from '../components/RevenueTrendChart';
import { useReports } from '../hooks/useReports';
import { formatCurrency, formatNumber } from '../utils/format';
import { STATUS_COLOR_MAP } from '../constants/sales';

const STATUS_SX_COLOR: Record<string, string> = {
  default: 'text.secondary',
  warning: 'warning.main',
  info: 'info.main',
  primary: 'primary.main',
  success: 'success.main',
  error: 'error.main',
};

const RING_COLORS = ['warning.main', 'primary.main', 'success.main', 'info.main'];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}

/** Circular "ring" stat, mirroring the Statistics card (Back End 25% / Front End 50% / …)
 *  from the reference dashboard — here used to show each status's share of total orders. */
function StatusRing({
  label,
  percent,
  count,
  color,
}: {
  label: string;
  percent: number;
  count: number;
  color: string;
}) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 96 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={72}
          thickness={4}
          sx={{ color: 'action.hover', position: 'absolute' }}
        />
        <CircularProgress
          variant="determinate"
          value={percent}
          size={72}
          thickness={4}
          sx={{ color, '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight={700}>
            {Math.round(percent)}%
          </Typography>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" fontWeight={600} noWrap sx={{ textTransform: 'capitalize' }}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatNumber(count)} orders
        </Typography>
      </Box>
    </Stack>
  );
}

export function ReportsPage() {
  const { data, isLoading, isError, error, refetch } = useReports();

  if (isError) {
    return (
      <AppLayout title="Reports" subtitle="Sales performance at a glance">
        <Alert
          severity="error"
          action={
            <button onClick={() => refetch()} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600 }}>
              Retry
            </button>
          }
        >
          {(error as { message?: string })?.message ?? 'Failed to load reports.'}
        </Alert>
      </AppLayout>
    );
  }

  const totalOrders = data?.statusBreakdown.reduce((sum, s) => sum + s.count, 0) ?? 0;

  const statusRings =
    data?.statusBreakdown
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((s, i) => ({
        key: s.status,
        label: s.status,
        percent: totalOrders ? (s.count / totalOrders) * 100 : 0,
        count: s.count,
        color: STATUS_SX_COLOR[STATUS_COLOR_MAP[s.status]] ?? RING_COLORS[i % RING_COLORS.length],
      })) ?? [];

  const categoryItems =
    data?.revenueByCategory.map((c) => ({
      key: c.category,
      label: c.category,
      value: c.totalSales,
      displayValue: formatCurrency(c.totalSales),
      secondaryLabel: `${formatNumber(c.totalOrders)} orders`,
    })) ?? [];
  const maxCategoryValue = Math.max(1, ...categoryItems.map((c) => c.value));

  const topCustomerItems = data?.topCustomers.slice(0, 5) ?? [];

  const revenueByMonth = data?.revenueByMonth ?? [];
  const latestMonth = revenueByMonth[revenueByMonth.length - 1];
  const previousMonth = revenueByMonth[revenueByMonth.length - 2];
  const currentRevenue = latestMonth?.totalSales ?? 0;
  const growthPercent =
    previousMonth && previousMonth.totalSales
      ? ((currentRevenue - previousMonth.totalSales) / previousMonth.totalSales) * 100
      : 0;
  const isGrowthPositive = growthPercent >= 0;

  return (
    <AppLayout title="Reports" subtitle="Sales performance at a glance">
      <Grid container spacing={2.5}>
        {/* Order status rings — mirrors the "Statistics" card in the reference dashboard */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 24px rgba(17, 24, 39, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Orders
              </Typography>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
                Status Breakdown
              </Typography>
              {isLoading ? (
                <LinearProgress sx={{ borderRadius: 1 }} />
              ) : (
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {statusRings.map((s) => (
                    <StatusRing key={s.key} label={s.label} percent={s.percent} count={s.count} color={s.color} />
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue snapshot + growth — mirrors "Monthly Goal" + "Projection" pair */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <Card
              sx={{
                borderRadius: 4,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 0.5 }}>
                      REVENUE THIS MONTH
                    </Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
                      {formatCurrency(currentRevenue)}
                    </Typography>
                  </Box>
                  <Chip
                    label={latestMonth?.month ?? '—'}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: 'inherit', fontWeight: 600 }}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 4, flex: 1, boxShadow: '0 4px 24px rgba(17, 24, 39, 0.05)' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight={700} color="text.secondary">
                    Month-over-month
                  </Typography>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isGrowthPositive ? 'success.light' : 'error.light',
                      color: isGrowthPositive ? 'success.dark' : 'error.dark',
                    }}
                  >
                    {isGrowthPositive ? (
                      <ArrowUpwardRoundedIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardRoundedIcon fontSize="small" />
                    )}
                  </Box>
                </Stack>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mt: 1.5 }}
                  color={isGrowthPositive ? 'success.main' : 'error.main'}
                >
                  {isGrowthPositive ? '+' : ''}
                  {growthPercent.toFixed(1)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  vs {previousMonth?.month ?? 'previous month'}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Revenue trend chart, restyled to match the rounded/soft-shadow card language */}
        {/* <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px rgba(17, 24, 39, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <RevenueTrendChart data={data?.revenueByMonth ?? []} isLoading={isLoading} />
            </CardContent>
          </Card>
        </Grid> */}

        {/* Revenue by category — mirrors the "Deadlines" progress-bar list */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 24px rgba(17, 24, 39, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Revenue by Category
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Which product categories drive the most sales
              </Typography>

              {isLoading ? (
                <LinearProgress sx={{ borderRadius: 1 }} />
              ) : (
                <Stack spacing={2}>
                  {categoryItems.map((c) => (
                    <Box key={c.key}>
                      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600}>
                          {c.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {c.displayValue}
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(c.value / maxCategoryValue) * 100}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {c.secondaryLabel}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top customers — mirrors the "Chat" list with avatar + pill badge */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 4, height: '100%', boxShadow: '0 4px 24px rgba(17, 24, 39, 0.05)' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Top Customers
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Highest spending customers by total revenue
              </Typography>

              {isLoading ? (
                <LinearProgress sx={{ borderRadius: 1 }} />
              ) : (
                <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />} spacing={0}>
                  {topCustomerItems.map((c) => (
                    <Stack
                      key={c.customerName}
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ py: 1.5 }}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '0.85rem' }}>
                        {getInitials(c.customerName)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {c.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(c.totalOrders)} orders
                        </Typography>
                      </Box>
                      <Chip
                        label={formatCurrency(c.totalSpent)}
                        size="small"
                        sx={{
                          // bgcolor: 'success.light',
                          // color: 'success.dark',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}