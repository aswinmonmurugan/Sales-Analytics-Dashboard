
import { AppLayout } from '../components/AppLayout';
import { OrdersExplorer } from '../components/OrdersExplorer';

export function OrdersPage() {
  return (
    <AppLayout title="Orders" subtitle="Search, filter, and manage every order in one place">
      <OrdersExplorer variant="workbench" />
    </AppLayout>
  );
}
