# Urban Crust POS API Documentation

## Base URL
```
Production: https://independent-perception-production-1caf.up.railway.app/api
Development: http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📊 Analytics Endpoints

### GET /analytics/sales
Get sales data for specified period.
- **Query Params**: `period` (daily, weekly, monthly)
- **Returns**: Array of daily sales with totalSales, ordersCount, avgOrderValue

### GET /analytics/products-performance
Get top sellers and slow movers.
- **Returns**: `topSellers` (top 10 products), `slowMovers` (bottom 10)

### GET /analytics/inventory-status
Get low stock and overstock alerts.
- **Returns**: `lowStock` count and items, `overstock` count and items

### GET /analytics/financial
Get financial reports with payment breakdown.
- **Returns**: Total revenue, tax, subtotal, order count, and payment method breakdown

### GET /analytics/cashier-performance
Get cashier statistics.
- **Returns**: Orders processed and revenue per cashier

### GET /analytics/forecasting
Get inventory forecasting and reorder recommendations.
- **Returns**: Items to reorder with economic order quantity

### GET /analytics/customer-analytics
Get customer insights and repeat customer analysis.
- **Returns**: Total customers, repeat customers, top customers, spending patterns

---

## 🏪 Multi-Store Endpoints

### GET /stores/locations
Get all store locations.
- **Returns**: Array of stores with city and coordinates

### GET /stores/inventory/:productId
Get product inventory across all stores.
- **Returns**: Total stock and breakdown by store

### POST /stores/stock/update
Update stock at specific store.
- **Body**: `{ productId, store, quantityChange }`
- **Returns**: Updated product with new inventory

### POST /stores/transfer
Transfer stock between stores.
- **Body**: `{ productId, fromStore, toStore, quantity }`
- **Returns**: Success status

### POST /stores/fulfillment/find
Find optimal fulfillment center.
- **Body**: `{ productId, stores: [] }`
- **Returns**: `optimalStore`

### GET /stores/alerts/low-stock
Get low stock alerts across stores.
- **Returns**: Count and list of low stock items

### GET /stores/summary
Get store-wise inventory summary.
- **Returns**: Summary by store (totalItems, totalQuantity, lowStockCount)

---

## 📦 Product Endpoints

### GET /products
Get active products with caching.
- **Query Params**: `category` (filter by category)
- **Returns**: Array of products

### GET /products/:id
Get single product details.
- **Returns**: Product object with variants and store stock

### POST /products
Create new product.
- **Body**: Product details with variants
- **Returns**: Created product

### PUT /products/:id
Update product.
- **Body**: Updated product fields
- **Returns**: Updated product

### DELETE /products/:id
Delete/deactivate product.
- **Returns**: Success message

---

## 🛒 Order Endpoints

### POST /orders
Create new order (real-time enabled).
- **Body**: `{ items[], subtotal, tax, paymentMethod, customerName, customerPhone, store }`
- **Broadcasts**: `inventory:updated`, `order:created` via Socket.IO
- **Returns**: Created order with orderId

### GET /orders
Get all orders (paginated).
- **Returns**: Array of orders with populated cashier and product data

### GET /orders/:id
Get order details.
- **Returns**: Order object with full details

### GET /orders/stats/daily
Get daily statistics.
- **Returns**: Total orders, revenue, items for today

---

## 👥 User Endpoints

### POST /auth/login
User login.
- **Body**: `{ username, password }`
- **Returns**: JWT token and user info

### POST /auth/register
Register new user.
- **Body**: `{ name, email, username, password, role, store }`
- **Returns**: Created user

### GET /users
Get all users (admin/manager only).
- **Returns**: Array of users

### PUT /users/:id
Update user details.
- **Body**: Updated user fields
- **Returns**: Updated user

---

## 🔌 Real-Time Events (Socket.IO)

### Client Events
- `subscribe_inventory` - Subscribe to inventory updates
- `subscribe_orders` - Subscribe to order updates

### Server Events
- `inventory:updated` - New inventory data available
- `order:created` - New order placed
- `stock:transferred` - Stock transferred between stores
- `store_stock:updated` - Store stock updated

---

## 🚀 Performance Features

### Caching
- Product and category endpoints cache responses for 600 seconds
- Cache invalidates on POST/PUT/DELETE operations
- Reduces database queries significantly

### Real-Time Sync
- WebSocket enabled for sub-second updates
- Inventory changes broadcast immediately to connected clients
- Multi-channel subscription (inventory, orders)

### Database Optimization
- Indexes on frequently queried fields (category, sku, barcode)
- Aggregation pipelines for analytics
- Virtual fields for computed values

---

## 📊 Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message",
  "timestamp": "2026-05-10T10:00:00Z"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2026-05-10T10:00:00Z"
}
```

---

## 🔐 Rate Limiting
Currently not implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## 📝 Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable
