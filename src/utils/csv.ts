import type { SalesOrder } from '../types/sales';

const CSV_COLUMNS: { key: keyof SalesOrder; header: string }[] = [
  { key: 'orderId', header: 'Order ID' },
  { key: 'customerName', header: 'Customer Name' },
  { key: 'productName', header: 'Product Name' },
  { key: 'category', header: 'Category' },
  { key: 'quantity', header: 'Quantity' },
  { key: 'amount', header: 'Amount' },
  { key: 'orderDate', header: 'Order Date' },
  { key: 'status', header: 'Order Status' },
];

function escapeCsvValue(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ordersToCsv(orders: SalesOrder[]): string {
  const header = CSV_COLUMNS.map((c) => c.header).join(',');
  const rows = orders.map((order) =>
    CSV_COLUMNS.map((c) => escapeCsvValue(order[c.key])).join(',')
  );
  return [header, ...rows].join('\n');
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
