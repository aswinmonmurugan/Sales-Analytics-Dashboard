
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/AppLayout';
import { DashboardSummary } from '../components/DashboardSummary';
import { OrdersExplorer } from '../components/OrdersExplorer';

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Sales Overview" subtitle="Track orders, revenue, and customer activity in real time">
      <Stack spacing={3}>
        <DashboardSummary />
        <OrdersExplorer variant="glance" glanceLimit={5} onViewAll={() => navigate('/orders')} />
      </Stack>
    </AppLayout>
  );
}
