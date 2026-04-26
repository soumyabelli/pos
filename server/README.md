# 🚀 Urban Crust POS Backend

Backend API for the Urban Crust POS System built with Node.js, Express, and MongoDB.

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

## 🔧 Installation

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urbancrust
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Start MongoDB
```bash
# Windows (if MongoDB is installed)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI with your Atlas connection string
```

### 4. Run the Backend Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will be running on: **http://localhost:5000**

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (manager/admin only)
- `PUT /api/products/:id` - Update product (manager/admin only)
- `DELETE /api/products/:id` - Delete product (manager/admin only)
- `PATCH /api/products/:id/stock` - Update product stock

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/stats/daily` - Get daily statistics

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/change-password` - Change password
- `DELETE /api/users/:id` - Delete user (admin only)

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 👤 Default Test Users

After setup, you can create test users via registration:

```json
// Admin
{
  "name": "Admin User",
  "email": "admin@urbancrust.com",
  "password": "password123",
  "role": "admin",
  "store": "Main Store"
}

// Manager
{
  "name": "Manager User",
  "email": "manager@urbancrust.com",
  "password": "password123",
  "role": "manager",
  "store": "Main Store"
}

// Cashier
{
  "name": "Cashier User",
  "email": "cashier@urbancrust.com",
  "password": "password123",
  "role": "cashier",
  "store": "Main Store"
}
```

## 📊 Database Models

### User
- name, email, password, role, store, isActive, timestamps

### Product
- sku, product, category, price, stock, image, description, isActive, timestamps

### Order
- orderId, items, subtotal, tax, totalAmount, paymentMethod, cashier, store, status, timestamps

## 🛠️ Technologies

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

## 📝 Notes

- Passwords are hashed using bcryptjs before storing
- JWT tokens expire in 7 days
- All timestamps are in UTC
- Role-based access control (RBAC) is implemented

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running on localhost:27017
- Or update MONGO_URI in .env file

**CORS Error:**
- Frontend must be on http://localhost:5173
- Backend must have cors enabled

**Token Expired:**
- Get a new token by logging in again

---

Made with ☕ for Urban Crust POS System
