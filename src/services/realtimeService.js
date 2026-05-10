import { io } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

class RealtimeService {
  socket = null;
  listeners = {};

  constructor() {
    // Initialization done with class fields
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Real-time connection established');
      this.emit('connection:established');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Real-time connection lost');
      this.emit('connection:lost');
    });

    // Listen for inventory updates
    this.socket.on('inventory:updated', (data) => {
      console.log('📦 Inventory updated:', data);
      this.emit('inventory:updated', data);
    });

    // Listen for order creation
    this.socket.on('order:created', (data) => {
      console.log('✅ Order created in real-time:', data);
      this.emit('order:created', data);
    });

    // Listen for stock transfers
    this.socket.on('stock:transferred', (data) => {
      console.log('🔄 Stock transferred:', data);
      this.emit('stock:transferred', data);
    });

    // Listen for store stock updates
    this.socket.on('store_stock:updated', (data) => {
      console.log('🏪 Store stock updated:', data);
      this.emit('store_stock:updated', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket disconnected');
    }
  }

  subscribeToInventory() {
    if (this.socket) {
      this.socket.emit('subscribe_inventory');
    }
  }

  subscribeToOrders() {
    if (this.socket) {
      this.socket.emit('subscribe_orders');
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export default new RealtimeService();
