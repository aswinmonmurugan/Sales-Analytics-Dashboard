import axios, { AxiosError } from 'axios';
import type { ApiErrorShape } from '../types/sales';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const normalized: ApiErrorShape = {
      message: 'Something went wrong. Please try again.',
      status: error.response?.status,
    };

    if (error.code === 'ECONNABORTED') {
      normalized.message = 'The request timed out. Please check your connection and try again.';
    } else if (error.response?.data?.message) {
      normalized.message = error.response.data.message;
    } else if (error.response?.status === 404) {
      normalized.message = 'The requested resource was not found.';
    } else if (error.response?.status && error.response.status >= 500) {
      normalized.message = 'The server encountered an error. Please try again shortly.';
    } else if (!error.response) {
      normalized.message = 'Network error. Please check your connection and try again.';
    }

    return Promise.reject(normalized);
  }
);
