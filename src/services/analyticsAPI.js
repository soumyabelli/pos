import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/analytics`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const analyticsAPI = {
  // Sales analytics
  getSalesAnalytics: async (period = 'monthly') => {
    const response = await api.get('/sales', { params: { period } });
    return response.data;
  },

  // Product performance
  getProductPerformance: async () => {
    const response = await api.get('/products-performance');
    return response.data;
  },

  // Inventory status
  getInventoryStatus: async () => {
    const response = await api.get('/inventory-status');
    return response.data;
  },

  // Financial reports
  getFinancialReport: async () => {
    const response = await api.get('/financial');
    return response.data;
  },

  // Cashier performance
  getCashierPerformance: async () => {
    const response = await api.get('/cashier-performance');
    return response.data;
  },

  // Inventory forecasting
  getForecasting: async () => {
    const response = await api.get('/forecasting');
    return response.data;
  },

  // Customer analytics
  getCustomerAnalytics: async () => {
    const response = await api.get('/customer-analytics');
    return response.data;
  }
};

export default analyticsAPI;
