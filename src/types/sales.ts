
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface SalesOrder {
  orderId: string;
  customerName: string;
  productName: string;
  category: string;
  quantity: number;
  amount: number;
  orderDate: string; // ISO date string
  status: OrderStatus;
}

export interface DashboardSummary {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export type SortField = 'orderDate' | 'amount' | 'quantity';
export type SortOrder = 'asc' | 'desc';

export interface SalesQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: OrderStatus | '';
  category?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiErrorShape {
  message: string;
  status?: number;
}

// --- Customers -------------------------------------------------------

export interface CustomerSummary {
  customerName: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: string; // ISO date string
  topCategory: string;
}

export type CustomerSortField = 'totalSpent' | 'totalOrders' | 'lastOrderDate' | 'customerName';

export interface CustomerQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: CustomerSortField;
  sortOrder?: SortOrder;
}

// --- Reports -----------------------------------------------------------

export interface CategoryBreakdown {
  category: string;
  totalSales: number;
  totalOrders: number;
}

export interface MonthlyRevenue {
  month: string; // e.g. "2026-01"
  label: string; // e.g. "Jan 2026"
  totalSales: number;
  totalOrders: number;
}

export interface StatusBreakdown {
  status: OrderStatus;
  count: number;
  totalSales: number;
}

export interface TopCustomer {
  customerName: string;
  totalSpent: number;
  totalOrders: number;
}

export interface ReportsData {
  revenueByCategory: CategoryBreakdown[];
  revenueByMonth: MonthlyRevenue[];
  statusBreakdown: StatusBreakdown[];
  topCustomers: TopCustomer[];
}

// --- Settings ------------------------------------------------------------

export interface UserSettings {
  displayName: string;
  email: string;
  role: string;
  defaultPageSize: number;
  defaultSortField: SortField;
  defaultSortOrder: SortOrder;
  emailNotifications: boolean;
  weeklySummaryEmail: boolean;
  lowStockAlerts: boolean;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
}