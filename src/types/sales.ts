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
