import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { CustomersPage } from './pages/CustomersPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/Settingspage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default App;