import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

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
      role: 'worker'
    }
  ];

  for (const seedUser of defaultUsers) {
    const existingUser = await User.findOne({ username: seedUser.username }).select('+password');

    if (!existingUser) {
      await User.create({ ...seedUser, store: 'Main Store' });
      console.log(`✅ Seeded default user: ${seedUser.username}/${seedUser.password}`);
      continue;
    }

    // Keep default demo credentials deterministic for local development.
    existingUser.name = seedUser.name;
    existingUser.email = seedUser.email;
    existingUser.role = seedUser.role;
    existingUser.store = 'Main Store';
    existingUser.isActive = true;
    existingUser.password = seedUser.password;
    await existingUser.save();

    console.log(`✅ Updated default user: ${seedUser.username}/${seedUser.password}`);
  }
}

mongoose.connection.once('open', async () => {
  try {
    await ensureDefaultUsers();
  } catch (error) {
    console.error('❌ Failed to seed default users:', error.message);
  }
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
  res.json({ 
    message: '☕ Urban Crust POS Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend connected to http://localhost:5173`);
});
