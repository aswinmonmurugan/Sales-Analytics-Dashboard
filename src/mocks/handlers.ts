import { http, HttpResponse, delay } from 'msw';
import { MOCK_ORDERS } from './data';
import type { DashboardSummary, OrderStatus, PaginatedResponse, SalesOrder } from '../types/sales';

const API_BASE = '/api';

// Simulate occasional network flakiness for realistic error-handling demo.
// Set to 0 to disable.
const FAILURE_RATE = 0.03;

function maybeFail() {
  if (Math.random() < FAILURE_RATE) {
    throw new Error('SIMULATED_FAILURE');
  }
}

export const handlers = [
  http.get(`${API_BASE}/dashboard/summary`, async () => {
    await delay(500);
    try {
      maybeFail();
    } catch {
      return HttpResponse.json({ message: 'Failed to load dashboard summary. Please try again.' }, { status: 500 });
    }

    const totalSales = MOCK_ORDERS.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = MOCK_ORDERS.length;
    const totalCustomers = new Set(MOCK_ORDERS.map((o) => o.customerName)).size;
    const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

    const summary: DashboardSummary = {
      totalSales,
      totalOrders,
      totalCustomers,
      averageOrderValue,
    };

    return HttpResponse.json(summary);
  }),

  http.get(`${API_BASE}/sales`, async ({ request }) => {
    await delay(500);
    try {
      maybeFail();
    } catch {
      return HttpResponse.json({ message: 'Failed to fetch sales data. Please try again.' }, { status: 500 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const status = url.searchParams.get('status') as OrderStatus | '' | null;
    const category = url.searchParams.get('category');
    const sortBy = url.searchParams.get('sortBy');
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let results: SalesOrder[] = [...MOCK_ORDERS];

    if (search) {
      results = results.filter(
        (o) =>
          o.orderId.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.productName.toLowerCase().includes(search)
      );
    }

    if (status) {
      results = results.filter((o) => o.status === status);
    }

    if (category) {
      results = results.filter((o) => o.category === category);
    }

    if (startDate) {
      const start = new Date(startDate).getTime();
      results = results.filter((o) => new Date(o.orderDate).getTime() >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      results = results.filter((o) => new Date(o.orderDate).getTime() <= end);
    }

    if (sortBy === 'orderDate' || sortBy === 'amount' || sortBy === 'quantity') {
      results.sort((a, b) => {
        let aVal: number;
        let bVal: number;
        if (sortBy === 'orderDate') {
          aVal = new Date(a.orderDate).getTime();
          bVal = new Date(b.orderDate).getTime();
        } else {
          aVal = a[sortBy];
          bVal = b[sortBy];
        }
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    const total = results.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;
    const pageData = results.slice(startIdx, startIdx + limit);

    const response: PaginatedResponse<SalesOrder> = {
      data: pageData,
      total,
      page,
      limit,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  // Export endpoint returns the full filtered set (no pagination) as JSON;
  // the client converts to CSV. Mirrors a common real-world API pattern.
  http.get(`${API_BASE}/sales/export`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const status = url.searchParams.get('status') as OrderStatus | '' | null;
    const category = url.searchParams.get('category');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    let results: SalesOrder[] = [...MOCK_ORDERS];
    if (search) {
      results = results.filter(
        (o) =>
          o.orderId.toLowerCase().includes(search) ||
          o.customerName.toLowerCase().includes(search) ||
          o.productName.toLowerCase().includes(search)
      );
    }
    if (status) results = results.filter((o) => o.status === status);
    if (category) results = results.filter((o) => o.category === category);
    if (startDate) {
      const start = new Date(startDate).getTime();
      results = results.filter((o) => new Date(o.orderDate).getTime() >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      results = results.filter((o) => new Date(o.orderDate).getTime() <= end);
    }

    return HttpResponse.json({ data: results });
  }),
];
