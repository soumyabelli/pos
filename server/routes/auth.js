import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

function normalizeRole(inputRole) {
  const role = String(inputRole || 'user').toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'manager') return 'manager';
  return 'user';
}

// ✅ Register
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role, store } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ error: 'Name, username, email and password are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already registered' });
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
      role: normalizeRole(role),
      store: store || 'Main Store'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Employee List for Dropdown Login
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ 
      role: { $in: ['user', 'worker'] }, 
      isActive: true 
    }).select('name username employeeId subRole shift store');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Login
router.post('/login', async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginId = (identifier || username || email || '').toLowerCase().trim();

    if (!loginId || !password) {
      return res.status(400).json({ error: 'Username/email and password required' });
    }

    // Find user and check password
    const user = await User.findOne({
      $or: [{ email: loginId }, { username: loginId }]
    }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        username: user.username,
        email: user.email, 
        role: user.role,
        store: user.store 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Current User
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
