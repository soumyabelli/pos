import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { createClient } from 'redis';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js';
import settingRoutes from './routes/settings.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';
import analyticsRoutes from './routes/analytics.js';
import storesRoutes from './routes/stores.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Setting from './models/Setting.js';
import User from './models/User.js';
import { cacheMiddleware } from './middleware/cache.js';

console.log("🚀 SERVER.JS IS RUNNING");

dotenv.config();

let SocketIOServer = null;
try {
  const socketIoModule = await import('socket.io');
  SocketIOServer = socketIoModule.Server;
} catch {
  console.warn('⚠️ socket.io package missing. Realtime features are disabled until dependencies are fixed.');
}

const app = express();
const httpServer = createServer(app);
const REQUESTED_PORT = Number(process.env.PORT) || 5000;
const isProduction = (process.env.NODE_ENV || 'development') === 'production';
const autoPortFallback =
  !isProduction && (process.env.AUTO_PORT_FALLBACK || 'true').toLowerCase() === 'true';
const portRetryCount = Number(process.env.PORT_RETRY_COUNT) || 10;

// Redis Setup — fully optional, server runs fine without it
let redisConnected = false;
const redisConfig = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : process.env.REDIS_HOST
    ? { socket: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) || 6379 } }
    : null;

const redisClient = createClient(redisConfig || { socket: { host: '127.0.0.1', port: 6379 } });

redisClient.on('error', (err) => {
  const message = err?.message || 'unknown error';
  if (redisConnected) {
    redisConnected = false;
    console.warn(`⚠️ Redis disconnected (${message}) — running without cache.`);
  } else {
    console.warn(`⚠️ Redis error before connection established: ${message}`);
  }
});

const redisTarget = redisConfig
  ? redisConfig.url || `${redisConfig.socket.host}:${redisConfig.socket.port}`
  : '127.0.0.1:6379';
console.log(`ℹ️ Connecting to Redis at ${redisTarget}`);

if (redisConfig) {
  try {
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connect timeout')), 3000))
    ]);
    redisConnected = true;
    console.log('✅ Redis connected');
  } catch (err) {
    console.warn(`⚠️ Redis unavailable (${err?.message || 'connection failure'}) — caching disabled, server continues.`);
  }
} else {
  try {
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connect timeout')), 3000))
    ]);
    redisConnected = true;
    console.log('✅ Redis connected');
  } catch (err) {
    console.warn(`⚠️ Redis unavailable (${err?.message || 'connection failure'}) — caching disabled, server continues.`);
  }
}

export { redisClient, redisConnected };

// Socket.IO Setup
const io = SocketIOServer
  ? new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    })
  : { on() {}, emit() {} };

export { io };

// Provide fallback defaults for Railway if environment variables are not set in the dashboard
const fallbackEnvVars = {
  MONGO_URI: "mongodb://localhost:27017/pos",
  JWT_SECRET: "your_super_secret_jwt_key_change_this_in_production_12345"
};

const missingEnvVars = ['MONGO_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Missing environment variables: ${missingEnvVars.join(', ')}. Using fallbacks.`);
  missingEnvVars.forEach(key => process.env[key] = fallbackEnvVars[key]);
}

const rawAllowedOrigins = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = rawAllowedOrigins
  .split(',')
  .map((origin) => origin.trim().replaceAll(/^['"]|['"]$/g, '').replace(/\/+$/, ''))
  .filter(Boolean);

if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/+$/, '');
  if (allowedOrigins.includes(normalizedOrigin)) return true;

  // Allow Vercel preview/production frontend domains.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalizedOrigin)) return true;

  return false;
}

app.use(helmet());
const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express 5 no longer accepts '*' here; regex matches all preflight paths safely.
async function connectMongo() {
  const connectTimeout = 5000; // 5 second timeout per connection attempt
  
  try {
    await Promise.race([
      mongoose.connect(process.env.MONGO_URI),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), connectTimeout))
    ]);
    console.log('MongoDB connected');
    return;
  } catch (err) {
    console.warn(`⚠️ MongoDB unavailable (${err.code || 'CONNECT_ERROR'}): ${err.message}`);

    const fallback = fallbackEnvVars.MONGO_URI;
    if (fallback && process.env.MONGO_URI !== fallback) {
      console.log('Attempting fallback MongoDB URI...');
      try {
        await Promise.race([
          mongoose.connect(fallback),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), connectTimeout))
        ]);
        console.log('MongoDB connected (fallback URI)');
        return;
      } catch (fallbackErr) {
        console.warn(`⚠️ MongoDB fallback failed (${fallbackErr.code || 'CONNECT_ERROR'}): ${fallbackErr.message}`);
      }
    }

    console.warn('⚠️ MongoDB not connected. Running with limited in-memory settings mode.');
  }
}

await connectMongo();
// (duplicate mongoose.connect removed — already called above with await)

async function ensureDefaultUsers() {
  const defaultUsers = [
    {
      name: 'Admin',
      username: 'admin',
      email: 'admin@urbancrust.com',
      password: 'admin',
      role: 'admin'
    },
    {
      name: 'Manager',
      username: 'manager',
      email: 'manager@urbancrust.com',
      password: 'manager',
      role: 'manager'
    },
    {
      name: 'Store Employee',
      username: 'user',
      email: 'user@urbancrust.com',
      password: 'user',
      role: 'user'
    }
  ];

  for (const seedUser of defaultUsers) {
    let user = await User.findOne({
      $or: [{ username: seedUser.username.toLowerCase() }, { email: seedUser.email.toLowerCase() }]
    }).select('+password');

    if (!user) {
      await User.create({ ...seedUser, store: 'Main Store' });
      continue;
    }

    user.name = seedUser.name;
    user.username = seedUser.username;
    user.email = seedUser.email;
    user.role = seedUser.role;
    user.store = 'Main Store';
    user.isActive = true;
    user.password = seedUser.password;
    await user.save();
  }
}

async function ensureDefaultCategories() {
  const defaults = [
    { name: 'Coffee', description: 'Hot and cold coffee items.' },
    { name: 'Drinks', description: 'Soft drinks and beverages.' },
    { name: 'Food', description: 'Main dishes and quick bites.' },
    { name: 'Dessert', description: 'Desserts and bakery items.' }
  ];

  for (const item of defaults) {
    const exists = await Category.findOne({ name: item.name });
    if (!exists) {
      await Category.create(item);
    }
  }
}

async function ensureDefaultSettings() {
  const current = await Setting.findOne();
  if (!current) {
    await Setting.create({
      storeName: 'Urban Crust Main Store',
      currency: 'Rs',
      taxRate: 8.5
    });
  }
}

async function ensureDefaultProducts() {
  const defaults = [
    {
      sku: 'COF-ESP-001',
      product: 'Espresso Shot',
      category: 'Coffee',
      price: 120,
      stock: 50,
      threshold: 10,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80',
      description: 'Strong, rich espresso shot.',
      isActive: true
    },
    {
      sku: 'COF-LAT-002',
      product: 'Cafe Latte',
      category: 'Coffee',
      price: 180,
      stock: 42,
      threshold: 12,
      image: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=600&q=80',
      description: 'Smooth espresso with steamed milk.',
      isActive: true
    },
    {
      sku: 'DRK-ICT-003',
      product: 'Iced Lemon Tea',
      category: 'Drinks',
      price: 140,
      stock: 60,
      threshold: 15,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
      description: 'Refreshing chilled lemon tea.',
      isActive: true
    },
    {
      sku: 'FOD-SND-004',
      product: 'Grilled Veg Sandwich',
      category: 'Food',
      price: 220,
      stock: 28,
      threshold: 8,
      image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=600&q=80',
      description: 'Toasted sandwich with fresh veggies.',
      isActive: true
    },
    {
      sku: 'DST-CHC-005',
      product: 'Chocolate Brownie',
      category: 'Dessert',
      price: 160,
      stock: 25,
      threshold: 7,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=600&q=80',
      description: 'Fudgy chocolate brownie square.',
      isActive: true
    },
    {
      sku: 'DST-CHC-006',
      product: 'Blueberry Muffin',
      category: 'Dessert',
      price: 150,
      stock: 18,
      threshold: 6,
      image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80',
      description: 'Moist muffin loaded with blueberries.',
      isActive: true
    }
  ];
  for (const item of defaults) {
    const existing = await Product.findOne({ sku: item.sku });
    if (!existing) {
      await Product.create(item);
    }
  }
}

mongoose.connection.once('open', async () => {
  try {
    await ensureDefaultUsers();
    await ensureDefaultCategories();
    await ensureDefaultSettings();
    await ensureDefaultProducts();
    console.log('Default admin backend data is ready');
  } catch (error) {
    console.error('Failed to seed default data:', error.message);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', cacheMiddleware(600), categoryRoutes);
app.use('/api/products', cacheMiddleware(600), productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stores', storesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Urban Crust POS Backend API',
    version: '1.1.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mongoState: mongoose.connection.readyState
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Socket.IO Connection Handler
if (SocketIOServer) {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);
    
    socket.on('subscribe_inventory', () => {
      socket.join('inventory_channel');
    });
    
    socket.on('subscribe_orders', () => {
      socket.join('orders_channel');
    });
    
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}

function startServer(port, retriesLeft) {
  httpServer.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (autoPortFallback && retriesLeft > 0) {
        const nextPort = port + 1;
        console.warn(`⚠️ Port ${port} is in use. Retrying on ${nextPort}...`);
        startServer(nextPort, retriesLeft - 1);
        return;
      }
      const helpText = autoPortFallback
        ? `Tried ${portRetryCount + 1} ports starting at ${REQUESTED_PORT}`
        : 'Auto fallback is disabled';
      console.error(`❌ Port ${port} is already in use. ${helpText}.`);
      process.exit(1);
    }

    console.error('Failed to start server:', err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
    if (port !== REQUESTED_PORT) {
      console.log(`ℹ️ Requested port ${REQUESTED_PORT} was busy. Using ${port} in dev mode.`);
    }
    console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`${redisConnected ? '✅' : '⚠️ '} Redis: ${redisConnected ? 'connected' : 'disabled (no Redis available)'}`);
    console.log(`${SocketIOServer ? '✅' : '⚠️ '} Socket.IO: ${SocketIOServer ? 'enabled' : 'disabled (package missing)'}`);
  });
}

startServer(REQUESTED_PORT, portRetryCount);
