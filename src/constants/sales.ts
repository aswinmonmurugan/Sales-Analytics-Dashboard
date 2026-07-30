import type { OrderStatus } from '../types/sales';

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Books',
  'Beauty',
  'Toys',
] as const;

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export const DEBOUNCE_DELAY_MS = 400;

export const STATUS_COLOR_MAP: Record<OrderStatus, 'default' | 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  Pending: 'warning',
  Processing: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'error',
};

export const LOCAL_STORAGE_FILTERS_KEY = 'sales-dashboard:filters:v1';
export const LOCAL_STORAGE_COLUMNS_KEY = 'sales-dashboard:columns:v1';
