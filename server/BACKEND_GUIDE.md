# 🏢 Urban Crust POS - Complete Backend Setup

## 🎯 System Overview

A complete Point-of-Sale system with **3-tier role-based access** and **task management**:

```
┌─────────────────────────────────────────────────────────┐
│                    URBAN CRUST POS                      │
├─────────────────────────────────────────────────────────┤
│  👨‍💼 ADMIN        | 📋 MANAGER       | 👷 WORKER         │
│  Full control     | Assign tasks    | Complete tasks    │
│  Manage all users | Monitor orders  | Process orders    │
│  View reports     | Manage staff    | Handle payments   │
└─────────────────────────────────────────────────────────┘
```

## 📁 Backend Structure

```
e:\infotact\pos\server\
├── models/                    # MongoDB Data Models
│   ├── User.js               # Users with roles (admin, manager, worker)
│   ├── Product.js            # Products/menu items
│   ├── Order.js              # Customer orders
│   └── Task.js               # Tasks assigned to workers
│
├── routes/                    # API Endpoints
│   ├── auth.js               # Login, Register, Authentication
│   ├── products.js           # Product CRUD
│   ├── orders.js             # Order Management
│   ├── users.js              # User Management
│   └── tasks.js              # Task Assignment & Management
│
├── middleware/
│   └── auth.js               # JWT Verification, Role Checking
│
├── server.js                 # Main Express Server
├── .env                      # Environment Variables
├── package.json              # Dependencies
└── README.md                 # API Documentation
```

## 👥 The 3 User Roles

### 👨‍💼 **ADMIN**
- **Full system control**
- Manage all users (create, edit, delete)
- Create products
- View all orders and tasks
- Assign/create tasks
- View analytics & reports
- Manage store settings

**Test Login:**
```
Email: admin@urbancrust.com
Password: password123
```

### 📋 **MANAGER**
- **Operational oversight**
- Create/manage products
- View all orders
- Assign tasks to workers
- Monitor worker progress
- Create and update tasks
- View store analytics
- Cannot delete users or system configurations

**Test Login:**
```
Email: manager@urbancrust.com
Password: password123
```

### 👷 **WORKER**
- **On-the-ground execution**
- Process customer orders
- Follow assigned tasks
- Update task status (Pending → In Progress → Completed)
- View their own tasks only
- Complete POS operations
- Cannot see other workers' tasks

**Test Login:**
```
Email: worker@urbancrust.com
Password: password123
```

## 🔐 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  role: 'admin' | 'manager' | 'worker',
  store: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  assignedTo: ObjectId (User reference),
  assignedBy: ObjectId (User reference),
  priority: 'Low' | 'Medium' | 'High' | 'Urgent',
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
  dueDate: Date,
  category: 'Orders' | 'Inventory' | 'Cleaning' | 'Delivery' | 'Report' | 'Other',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  sku: String (unique),
  product: String,
  category: 'Coffee' | 'Drinks' | 'Food' | 'Dessert',
  price: Number,
  stock: Number,
  image: String (emoji),
  description: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  orderId: String (unique),
  items: Array,
  subtotal: Number,
  tax: Number,
  totalAmount: Number,
  paymentMethod: 'Cash' | 'Card' | 'UPI',
  cashier: ObjectId (User reference),
  store: String,
  status: 'Completed' | 'Pending' | 'Cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Worker",
  "email": "john@urbancrust.com",
  "password": "password123",
  "role": "worker",
  "store": "Main Store"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "worker@urbancrust.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Worker",
    "email": "worker@urbancrust.com",
    "role": "worker"
  }
}
```

### Tasks

#### Create Task (Admin/Manager only)
```bash
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Process Order #123",
  "description": "Prepare order for table 5",
  "assignedTo": "userId",
  "priority": "High",
  "dueDate": "2026-04-26T18:00:00Z",
  "category": "Orders",
  "notes": "Customer special order - no onions"
}
```

#### Get My Tasks (Workers only see their own)
```bash
GET /api/tasks
Authorization: Bearer <token>

Response: [
  {
    "_id": "...",
    "title": "Process Order #123",
    "assignedTo": {...},
    "assignedBy": {...},
    "status": "Pending",
    "priority": "High",
    "dueDate": "2026-04-26T18:00:00Z",
    "category": "Orders"
  }
]
```

#### Update Task Status (Worker)
```bash
PATCH /api/tasks/:taskId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress"
}
```

#### Get Task Statistics
```bash
GET /api/tasks/stats/summary
Authorization: Bearer <token>

Response:
{
  "pending": 5,
  "inProgress": 3,
  "completed": 12,
  "cancelled": 0,
  "total": 20
}
```

### Products

#### Get All Products
```bash
GET /api/products
```

#### Create Product (Manager/Admin only)
```bash
POST /api/products
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
POST /api/orders
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

### Users

#### Get All Users (Admin only)
```bash
GET /api/users
Authorization: Bearer <token>
```

#### Update My Profile (All users)
```bash
PUT /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@urbancrust.com",
  "store": "New Store"
}
```

## 🚀 Complete Setup Instructions

### Step 1: MongoDB Setup

**Option A: Local MongoDB (Development)**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and ensure mongod is running
3. Default: `mongodb://localhost:27017/urbancrust`

**Option B: MongoDB Atlas (Cloud)**
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update in .env: `MONGO_URI=mongodb+srv://...`

### Step 2: Backend Installation

```bash
# Navigate to server folder
cd e:\infotact\pos\server

# Install dependencies
npm install

# Start server in development mode
npm run dev

# Or production
npm start
```

Expected output:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:5000
📱 Frontend connected to http://localhost:5173
```

### Step 3: Create Test Users

Use Postman or the login registration. Create these users:

**ADMIN**
```json
{
  "name": "Admin User",
  "email": "admin@urbancrust.com",
  "password": "password123",
  "role": "admin"
}
```

**MANAGER**
```json
{
  "name": "Manager User",
  "email": "manager@urbancrust.com",
  "password": "password123",
  "role": "manager"
}
```

**WORKER**
```json
{
  "name": "Worker User",
  "email": "worker@urbancrust.com",
  "password": "password123",
  "role": "worker"
}
```

### Step 4: Frontend Setup

Frontend is already running on http://localhost:5173

Login with test credentials above.

## 📊 Task Workflow Example

```
Manager creates task:
  CREATE: "Prepare Coffee Order"
         → Assigned to: Worker
         → Status: Pending
         → Priority: High
         → Due: 2:00 PM

Worker receives task:
  VIEW: See task in "My Tasks"
        Status: Pending
        Priority: High ⚠️

Worker starts task:
  UPDATE: Status → "In Progress"

Worker completes task:
  UPDATE: Status → "Completed"

Manager monitors:
  VIEW: Task completion statistics
        5 Pending, 3 In Progress, 12 Completed
```

## 🔐 Security Features

✅ Passwords hashed with bcryptjs (10 rounds)
✅ JWT tokens (7-day expiration)
✅ Role-based access control (RBAC)
✅ CORS protection
✅ Helmet security headers
✅ Input validation & sanitization

## 🧪 Testing with Postman

1. Download: https://www.postman.com/downloads/
2. Import the backend
3. Base URL: `http://localhost:5000/api`
4. Set Authorization header: `Authorization: Bearer <token>`

## ⚙️ Environment Configuration

Create `.env` in server folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urbancrust
JWT_SECRET=your_super_secret_key_change_in_production
NODE_ENV=development
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB Connection Error | Ensure MongoDB is running / Check MONGO_URI |
| Port 5000 in use | Change PORT in .env or kill process |
| CORS Error | Verify frontend is on http://localhost:5173 |
| Invalid Token | Login again, token may have expired |
| Role Permission Denied | Check user role and endpoint permissions |

## 📞 Support

All endpoints require proper authentication except:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products` (public)

---

**Urban Crust POS Backend - Ready to Deploy! ☕**

Start the server and begin managing your cafe operations with role-based task assignment!
