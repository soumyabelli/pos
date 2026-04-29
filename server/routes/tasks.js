import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { authMiddleware, adminOnly, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Create Task (Admin/Manager only - assign to workers)
router.post('/', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, category, notes } = req.body;

    // Verify assignedTo user exists and is a worker
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      priority,
      dueDate,
      category,
      notes
    });

    await task.save();
    await task.populate(['assignedTo', 'assignedBy'], 'name email role');

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Tasks (Admin/Manager see all, Workers see their own)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};

    // Workers only see their assigned tasks
    if (req.user.role === 'worker') {
      filter.assignedTo = req.user.id;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Single Task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permissions
    if (req.user.role === 'worker' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Task Status (Workers update their task status)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Workers can only update their own tasks
    if (req.user.role === 'worker' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    task.status = status;
    await task.save();
    await task.populate(['assignedTo', 'assignedBy'], 'name email role');

    res.json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Task (Admin/Manager only)
router.put('/:id', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, notes } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, dueDate, category, notes },
      { new: true }
    ).populate(['assignedTo', 'assignedBy'], 'name email role');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Task (Admin/Manager only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Task Statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'worker') {
      filter.assignedTo = req.user.id;
    }

    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      total: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'Pending') summary.pending = stat.count;
      if (stat._id === 'In Progress') summary.inProgress = stat.count;
      if (stat._id === 'Completed') summary.completed = stat.count;
      if (stat._id === 'Cancelled') summary.cancelled = stat.count;
      summary.total += stat.count;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
