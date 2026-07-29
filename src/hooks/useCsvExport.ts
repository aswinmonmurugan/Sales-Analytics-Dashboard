import { useState } from 'react';
import { fetchSalesForExport } from '../services/salesService';
import { downloadCsv, ordersToCsv } from '../utils/csv';
import type { SalesQueryParams } from '../types/sales';

export function useCsvExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  async function exportCsv(params: SalesQueryParams) {
    setIsExporting(true);
    setExportError(null);
    try {
      const orders = await fetchSalesForExport(params);
      const csv = ordersToCsv(orders);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadCsv(`sales-export-${timestamp}.csv`, csv);
    } catch (err) {
      setExportError((err as { message?: string })?.message ?? 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }

  return { exportCsv, isExporting, exportError };
}
