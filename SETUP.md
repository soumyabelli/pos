# 🎯 Complete POS System Setup Guide

## 📦 Technology Stack

```
Frontend: React.js + Vite + Tailwind CSS
Backend: Node.js + Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Password Hashing: bcryptjs
```

## 🚀 Quick Start (5 minutes)

### Step 1: Set Up MongoDB

**Option A: Local MongoDB (Recommended for Development)**

1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Install and run MongoDB
3. Default connection string: `mongodb://localhost:27017/urbancrust`

**Option B: MongoDB Atlas (Cloud - Recommended for Production)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` in server folder:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/urbancrust
   ```

### Step 2: Install Backend Dependencies

```bash
cd e:\infotact\pos\server
npm install
```

### Step 3: Run Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Expected output:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:5000
```

### Step 4: Frontend is Already Running

The frontend should already be running on `http://localhost:5173`

## 📝 Default Test Users

Register new users or use these test credentials:

### Admin User
```
Email: admin@urbancrust.com
Password: password123
```

### Manager User
```
Email: manager@urbancrust.com
Password: password123
```

### Cashier User
```
Email: cashier@urbancrust.com
Password: password123
```

## 📚 API Documentation

### Authentication

#### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "cashier",
  "store": "Main Store"
}
```

#### Login User
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "cashier"
  }
}
```

### Products

#### Get All Products
```bash
GET http://localhost:5000/api/products
```

#### Create Product (Manager/Admin only)
```bash
POST http://localhost:5000/api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "sku": "COFF-ESP-01",
  "product": "Espresso",
  "category": "Coffee",
  "price": 3.50,
  "stock": 100,
  "image": "☕",
  "description": "Hot espresso shot"
}
```

### Orders

#### Create Order
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "productId",
      "qty": 2,
      "price": 3.50,
      "total": 7.00
    }
  ],
  "subtotal": 7.00,
  "tax": 0.56,
  "paymentMethod": "Cash"
}
```

#### Get All Orders
```bash
GET http://localhost:5000/api/orders
Authorization: Bearer <token>
```

#### Get Daily Statistics
```bash
GET http://localhost:5000/api/orders/stats/daily
Authorization: Bearer <token>
```

## 🔐 How Authentication Works

1. **User registers/logs in** → Sends email & password to `/api/auth/login`
2. **Backend verifies** → Checks password hash using bcryptjs
3. **Token generated** → JWT token created (7 days expiry)
4. **Token stored** → Frontend saves token in localStorage
5. **Subsequent requests** → Token sent in `Authorization: Bearer <token>` header
6. **Middleware validates** → Every protected route verifies JWT token

## 📁 Directory Structure

```
e:/infotact/pos/
├── server/                    # Backend (Node.js/Express)
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/               # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js           # JWT validation
│   ├── server.js             # Main server file
│   ├── .env                  # Environment variables
│   └── package.json
│
└── src/                       # Frontend (React)
    ├── pages/
    │   ├── Login.jsx         # Now uses real API
    │   ├── POS.jsx
    │   └── ...
    ├── components/
    │   ├── pos/
    │   │   ├── ProductGrid.jsx
    │   │   ├── CartSidebar.jsx
    │   │   └── CheckoutOverlay.jsx
    │   └── ...
    └── index.css             # Styles
```

## 🔧 Environment Variables

**Backend (.env)**
```
PORT=5000                                          # Server port
MONGO_URI=mongodb://localhost:27017/urbancrust    # Database URL
JWT_SECRET=your_secret_key_here                   # JWT secret
NODE_ENV=development                              # Environment
```

## 🛡️ Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT authentication tokens
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Role-based access control (RBAC)
- ✅ Input validation

## 🚨 Troubleshooting

### "MongoDB Connection Error"
- Make sure MongoDB is running
- Check MONGO_URI in .env
- Verify database name is correct

### "CORS Error"
- Backend is configured for http://localhost:5173
- If using different port, update server.js cors config

### "Invalid Token Error"
- Token may have expired
- User needs to log in again
- Clear localStorage and try again

### "Port 5000 Already in Use"
```bash
# Windows - Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT in .env to 5001, 5002, etc.
```

## 📊 Sample Data Setup

To add sample products, use the POST /api/products endpoint or Postman.

Sample products to create:
```json
[
  {"sku": "COFF-ESP-01", "product": "Espresso", "category": "Coffee", "price": 3.50, "stock": 100, "image": "☕"},
  {"sku": "COFF-LAT-02", "product": "Latte", "category": "Coffee", "price": 4.50, "stock": 80, "image": "☕"},
  {"sku": "FOOD-BAKE-01", "product": "Croissant", "category": "Food", "price": 5.99, "stock": 50, "image": "🥐"},
  {"sku": "DESS-CAKE-01", "product": "Chocolate Cake", "category": "Dessert", "price": 7.99, "stock": 30, "image": "🍰"}
]
```

## 🧪 Testing with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import API collection
3. Set base URL: `http://localhost:5000/api`
4. Test endpoints

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- JWT: https://jwt.io/
- React: https://react.dev/

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Can navigate to http://localhost:5173
- [ ] Can log in with test credentials
- [ ] Backend API is responding
- [ ] CORS is configured correctly

## 🆘 Need Help?

Check the following:
1. Server console for error messages
2. Browser DevTools → Network tab (for API calls)
3. MongoDB connection string in .env
4. JWT_SECRET is set in .env
5. All dependencies are installed

---

**Your POS System is now ready! 🎉**

Start with: http://localhost:5173
