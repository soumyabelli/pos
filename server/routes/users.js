import express from 'express';
import User from '../models/User.js';
import { authMiddleware, adminOnly, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Get All Users (Admin only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Workers (Manager/Admin)
router.get('/workers/list', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker', isActive: true }).select('name username email role store');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Single User
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

// ✅ Update User Profile
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot update other users' });
    }

    const { name, username, email, store } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, username, email, store },
      { new: true }
    ).select('-password');

    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Change Password
router.post('/:id/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete User (Admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
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
