# 🚀 Complete Setup Guide - Urban Crust POS System

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Docker Setup](#docker-setup)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Real-Time Features](#real-time-features)
6. [Analytics Dashboard](#analytics-dashboard)
7. [Multi-Store Setup](#multi-store-setup)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose (for containerized setup)
- MongoDB Atlas account (for production) or local MongoDB
- Redis (optional, auto-configured in Docker)

### 1. Clone and Install
```bash
cd /path/to/infotact
npm install              # Install frontend dependencies
cd server
npm install              # Install backend dependencies
```

### 2. Configure Environment
```bash
# Backend
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cd ..
cp .env.example .env.local
# Edit with your API base URL
```

### 3. Start Development
```bash
# Terminal 1: Start Backend
cd server
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

---

## 🐳 Docker Setup (Recommended for Full Stack)

### Prerequisites
- Docker and Docker Compose installed
- 4GB+ available memory

### Start All Services
```bash
# From project root
docker-compose up -d

# Verify all services
docker-compose ps
```

### Access Services
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **MongoDB Admin**: http://localhost:8081 (user: root, pass: password)
- **Redis Admin**: http://localhost:8082

### Stop All Services
```bash
docker-compose down

# Remove volumes too (warning: deletes data)
docker-compose down -v
```

---

## 💻 Local Development Setup

### 1. Install MongoDB Locally
```bash
# Windows (using chocolatey)
choco install mongodb

# macOS
brew tap mongodb/brew
brew install mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb
```

### 2. Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community

# Or manually
mongod --dbpath /path/to/data
```

### 3. Install Redis (Optional but Recommended)
```bash
# macOS
brew install redis
brew services start redis

# Windows (using WSL or Docker)
docker run -d -p 6379:6379 redis:7-alpine

# Linux
sudo apt-get install redis-server
redis-server
```

### 4. Configure Environment Variables
```bash
# server/.env (Development)
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/urbancrust
JWT_SECRET=dev_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 5. Start Services
```bash
# Backend
cd server
npm run dev

# Frontend (new terminal)
npm run dev
```

---

## 🌍 Production Deployment

### Deployment Targets
- **Frontend**: Vercel (configured)
- **Backend**: Railway (configured)
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud

### Setup Production Environment Variables

**Backend (.env on Railway)**
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/urbancrust
JWT_SECRET=your_production_secret_key_here
REDIS_HOST=redis.cloud.host
REDIS_PORT=6379
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

**Frontend (.env.production on Vercel)**
```
VITE_API_BASE_URL=https://your-railway-backend.railway.app
VITE_BASE_PATH=/
```

### Deploy Steps

#### Frontend (Vercel)
```bash
# Push to GitHub main branch triggers auto-deploy
git push origin main

# Or manual deploy
npm run build
vercel deploy --prod
```

#### Backend (Railway)
```bash
# Push to GitHub triggers auto-deploy
# Or connect Railway to GitHub repository
# Railway will automatically:
# 1. Install dependencies
# 2. Build Docker image
# 3. Deploy to production
```

---

## 🔌 Real-Time Features

### WebSocket Connection
The system uses Socket.IO for real-time updates:

```javascript
// Frontend
import realtimeService from './services/realtimeService';

realtimeService.connect();
realtimeService.subscribeToInventory();
realtimeService.on('inventory:updated', (data) => {
  console.log('Inventory changed:', data);
});
```

### Real-Time Events
- **inventory:updated** - Stock levels changed
- **order:created** - New order placed
- **stock:transferred** - Stock moved between stores
- **store_stock:updated** - Store-specific stock update

### Test Real-Time Updates
```bash
# Terminal 1: Backend server running
# Terminal 2: Frontend running
# Terminal 3: Test WebSocket

curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"sku": "COF-ESP-001", "qty": 2}],
    "subtotal": 240,
    "tax": 20,
    "paymentMethod": "Cash",
    "customerName": "Test",
    "customerPhone": "9876543210"
  }'
```

---

## 📊 Analytics Dashboard

### Available Analytics Endpoints

#### Sales Analytics
```bash
GET /api/analytics/sales?period=monthly
# Returns: Daily sales, order count, average order value
```

#### Product Performance
```bash
GET /api/analytics/products-performance
# Returns: Top 10 sellers, slow movers
```

#### Inventory Forecasting
```bash
GET /api/analytics/forecasting
# Returns: Reorder recommendations, economic order quantity
```

#### Financial Reports
```bash
GET /api/analytics/financial
# Returns: Revenue, tax, payment breakdown
```

#### Customer Analytics
```bash
GET /api/analytics/customer-analytics
# Returns: Repeat customers, spending patterns
```

---

## 🏪 Multi-Store Setup

### Add New Store
```javascript
// server/routes/stores.js - Update STORE_LOCATIONS
const STORE_LOCATIONS = [
  { store: 'Main Store', city: 'Central', lat: 19.0760, lng: 72.8777 },
  { store: 'Downtown Store', city: 'South', lat: 19.0176, lng: 72.8194 },
  { store: 'Mall Store', city: 'West', lat: 19.1136, lng: 72.8697 },
  { store: 'Airport Store', city: 'North', lat: 19.0960, lng: 72.8672 }  // New store
];
```

### Transfer Stock Between Stores
```bash
POST /api/stores/transfer
{
  "productId": "xxx",
  "fromStore": "Main Store",
  "toStore": "Downtown Store",
  "quantity": 10
}
```

### Find Optimal Fulfillment
```bash
POST /api/stores/fulfillment/find
{
  "productId": "xxx",
  "stores": ["Main Store", "Downtown Store", "Mall Store"]
}
# Returns: Optimal store based on stock availability
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
Automatically triggered on push to main:
1. **Lint & Test** - Check code quality
2. **Security** - npm audit, sensitive data check
3. **Build** - Create Docker image
4. **Deploy** - Push to production

### Manual Deploy
```bash
# Backend to Railway
git push origin main

# Frontend to Vercel
git push origin main
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify MONGO_URI in .env
- For Docker: Ensure mongodb service is healthy: `docker-compose ps`

### Redis Connection Error
```
Error: Redis connection failed
```
**Solution:**
- Check if Redis is running: `redis-cli ping`
- Verify REDIS_HOST and REDIS_PORT
- For Docker: `docker-compose logs redis`

### Socket.IO Connection Issues
```
WebSocket is closed
```
**Solution:**
- Check backend is running: `curl http://localhost:5000`
- Verify CORS in server.js includes your frontend URL
- Check browser console for errors

### High Database Load
**Optimization:**
- Enable Redis caching (already configured)
- Use database indexes (created automatically)
- Check slow query logs

### Memory Issues
**Solutions:**
- Increase Docker memory limit: `docker-compose -f docker-compose.yml up --memory=2g`
- Review large aggregation queries
- Monitor with: `docker stats urbancrust-backend`

---

## 📈 Performance Metrics

### Target SLOs (Service Level Objectives)
- API Response Time: < 200ms (95th percentile)
- Inventory Sync Latency: < 1.5 seconds across nodes
- System Uptime: 99.9%
- Cache Hit Rate: > 60% for product queries

### Monitor Performance
```bash
# Backend logs
docker logs -f urbancrust-backend

# Database performance
# MongoDB Atlas -> Monitoring
# Redis -> redis-commander at http://localhost:8082

# Frontend performance
# Check browser DevTools -> Network tab
```

---

## 📞 Support & Documentation

- **API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Backend Guide**: [server/BACKEND_GUIDE.md](./server/BACKEND_GUIDE.md)
- **Frontend README**: [README.md](./README.md)

---

## ✅ Completion Checklist

- [x] Core POS Functionality
- [x] Redis Caching Layer
- [x] Real-Time WebSocket Sync
- [x] Multi-Store Support
- [x] Product Variants/PIM
- [x] Inventory Forecasting
- [x] Advanced Analytics
- [x] Docker Containerization
- [x] CI/CD Pipeline (GitHub Actions)
- [x] API Documentation
- [x] Development Setup Guide

**Status: 100% COMPLETE** ✅
