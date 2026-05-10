import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/stores`,
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

const storesAPI = {
  // Get all store locations
  getLocations: async () => {
    const response = await api.get('/locations');
    return response.data;
  },

  // Get product inventory across all stores
  getInventory: async (productId) => {
    const response = await api.get(`/inventory/${productId}`);
    return response.data;
  },

  // Update stock at a specific store
  updateStock: async (productId, store, quantityChange) => {
    const response = await api.post('/stock/update', {
      productId,
      store,
      quantityChange
    });
    return response.data;
  },

  // Transfer stock between stores
  transferStock: async (productId, fromStore, toStore, quantity) => {
    const response = await api.post('/transfer', {
      productId,
      fromStore,
      toStore,
      quantity
    });
    return response.data;
  },

  // Find optimal fulfillment center
  findOptimalFulfillment: async (productId, stores) => {
    const response = await api.post('/fulfillment/find', {
      productId,
      stores
    });
    return response.data;
  },

  // Get low stock alerts
  getLowStockAlerts: async () => {
    const response = await api.get('/alerts/low-stock');
    return response.data;
  },

  // Get store-wise inventory summary
  getInventorySummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  }
};

export default storesAPI;
