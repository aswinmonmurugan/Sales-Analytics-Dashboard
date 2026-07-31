import { http, HttpResponse, delay } from 'msw';
import { MOCK_ORDERS } from './data';
import type {
  CustomerSortField,
  CustomerSummary,
  DashboardSummary,
  MonthlyRevenue,
  OrderStatus,
  PaginatedResponse,
  ReportsData,
  SalesOrder,
} from '../types/sales';

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

  http.get(`${API_BASE}/customers`, async ({ request }) => {
    await delay(500);
    try {
      maybeFail();
    } catch {
      return HttpResponse.json({ message: 'Failed to fetch customers. Please try again.' }, { status: 500 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '10');
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
    const sortBy = (url.searchParams.get('sortBy') ?? 'totalSpent') as CustomerSortField;
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc';

    const byCustomer = new Map<string, SalesOrder[]>();
    for (const order of MOCK_ORDERS) {
      const existing = byCustomer.get(order.customerName);
      if (existing) {
        existing.push(order);
      } else {
        byCustomer.set(order.customerName, [order]);
      }
    }

    let customers: CustomerSummary[] = Array.from(byCustomer.entries()).map(([customerName, orders]) => {
      const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
      const totalOrders = orders.length;
      const lastOrderDate = orders.reduce(
        (latest, o) => (new Date(o.orderDate).getTime() > new Date(latest).getTime() ? o.orderDate : latest),
        orders[0].orderDate
      );
      const categoryCounts = new Map<string, number>();
      for (const o of orders) {
        categoryCounts.set(o.category, (categoryCounts.get(o.category) ?? 0) + 1);
      }
      const topCategory = Array.from(categoryCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];

      return {
        customerName,
        totalOrders,
        totalSpent,
        averageOrderValue: totalSpent / totalOrders,
        lastOrderDate,
        topCategory,
      };
    });

    if (search) {
      customers = customers.filter((c) => c.customerName.toLowerCase().includes(search));
    }

    customers.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;
      if (sortBy === 'lastOrderDate') {
        aVal = new Date(a.lastOrderDate).getTime();
        bVal = new Date(b.lastOrderDate).getTime();
      } else if (sortBy === 'customerName') {
        aVal = a.customerName;
        bVal = b.customerName;
      } else {
        aVal = a[sortBy];
        bVal = b[sortBy];
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    const total = customers.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;
    const pageData = customers.slice(startIdx, startIdx + limit);

    const response: PaginatedResponse<CustomerSummary> = {
      data: pageData,
      total,
      page,
      limit,
      totalPages,
    };

    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE}/reports`, async () => {
    await delay(500);
    try {
      maybeFail();
    } catch {
      return HttpResponse.json({ message: 'Failed to load reports. Please try again.' }, { status: 500 });
    }

    // Revenue by category
    const categoryMap = new Map<string, { totalSales: number; totalOrders: number }>();
    for (const order of MOCK_ORDERS) {
      const entry = categoryMap.get(order.category) ?? { totalSales: 0, totalOrders: 0 };
      entry.totalSales += order.amount;
      entry.totalOrders += 1;
      categoryMap.set(order.category, entry);
    }
    const revenueByCategory = Array.from(categoryMap.entries())
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.totalSales - a.totalSales);

    // Revenue by month, last 12 months of order data
    const monthMap = new Map<string, { totalSales: number; totalOrders: number }>();
    for (const order of MOCK_ORDERS) {
      const date = new Date(order.orderDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const entry = monthMap.get(key) ?? { totalSales: 0, totalOrders: 0 };
      entry.totalSales += order.amount;
      entry.totalOrders += 1;
      monthMap.set(key, entry);
    }
    const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' });
    const revenueByMonth: MonthlyRevenue[] = Array.from(monthMap.entries())
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .slice(-12)
      .map(([month, v]) => {
        const [year, monthNum] = month.split('-').map(Number);
        return {
          month,
          label: monthFormatter.format(new Date(year, monthNum - 1, 1)),
          ...v,
        };
      });

    // Order status breakdown
    const statusMap = new Map<OrderStatus, { count: number; totalSales: number }>();
    for (const order of MOCK_ORDERS) {
      const entry = statusMap.get(order.status) ?? { count: 0, totalSales: 0 };
      entry.count += 1;
      entry.totalSales += order.amount;
      statusMap.set(order.status, entry);
    }
    const statusBreakdown = Array.from(statusMap.entries()).map(([status, v]) => ({ status, ...v }));

    // Top customers by revenue
    const customerMap = new Map<string, { totalSpent: number; totalOrders: number }>();
    for (const order of MOCK_ORDERS) {
      const entry = customerMap.get(order.customerName) ?? { totalSpent: 0, totalOrders: 0 };
      entry.totalSpent += order.amount;
      entry.totalOrders += 1;
      customerMap.set(order.customerName, entry);
    }
    const topCustomers = Array.from(customerMap.entries())
      .map(([customerName, v]) => ({ customerName, ...v }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const response: ReportsData = {
      revenueByCategory,
      revenueByMonth,
      statusBreakdown,
      topCustomers,
    };

    return HttpResponse.json(response);
  }),
];
