import express from 'express';
import User from '../models/User.js';
import { authMiddleware, adminOnly, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

function normalizeRole(inputRole) {
  const role = String(inputRole || 'worker').toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'manager') return 'manager';
  return 'worker';
}

// Get all users (Admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workers (Manager/Admin)
router.get('/workers/list', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isActive: true }).select('name username email role store');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user (Admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, username, email, password, role, store, isActive } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const derivedUsername = String(username || normalizedEmail.split('@')[0] || '')
      .toLowerCase()
      .trim();

    if (!derivedUsername) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: derivedUsername }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already registered' });
    }

    const user = await User.create({
      name,
      username: derivedUsername,
      email: normalizedEmail,
      password,
      role: normalizeRole(role),
      store: store || 'Main Store',
      isActive: typeof isActive === 'boolean' ? isActive : true
    });

    const sanitizedUser = await User.findById(user._id).select('-password');
    res.status(201).json({ message: 'User created', user: sanitizedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot update other users' });
    }

    const { name, username, email, store, isActive, role } = req.body;
    const updates = { name, username, email, store };

    if (req.user.role === 'admin') {
      if (typeof isActive === 'boolean') updates.isActive = isActive;
      if (role) updates.role = normalizeRole(role);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.post('/:id/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
