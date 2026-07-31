import { apiClient } from './apiClient';
import type {
  CustomerQueryParams,
  CustomerSummary,
  DashboardSummary,
  PaginatedResponse,
  ReportsData,
  SalesOrder,
  SalesQueryParams,
} from '../types/sales';

function buildParams(params: SalesQueryParams) {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };
  if (params.search) query.search = params.search;
  if (params.status) query.status = params.status;
  if (params.category) query.category = params.category;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;
  return query;
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function fetchSales(params: SalesQueryParams): Promise<PaginatedResponse<SalesOrder>> {
  const { data } = await apiClient.get<PaginatedResponse<SalesOrder>>('/sales', {
    params: buildParams(params),
  });
  return data;
}

export async function fetchSalesForExport(
  params: Omit<SalesQueryParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>
): Promise<SalesOrder[]> {
  const { data } = await apiClient.get<{ data: SalesOrder[] }>('/sales/export', {
    params: buildParams({ ...params, page: 1, limit: 0 }),
  });
  return data.data;
}

export async function fetchCustomers(
  params: CustomerQueryParams
): Promise<PaginatedResponse<CustomerSummary>> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };
  if (params.search) query.search = params.search;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;

  const { data } = await apiClient.get<PaginatedResponse<CustomerSummary>>('/customers', { params: query });
  return data;
}

export async function fetchReports(): Promise<ReportsData> {
  const { data } = await apiClient.get<ReportsData>('/reports');
  return data;
}
