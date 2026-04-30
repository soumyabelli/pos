import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create task (Admin/Manager)
router.post('/', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, category, notes } = req.body;

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (assignedUser.role !== 'worker') {
      return res.status(400).json({ error: 'Tasks can only be assigned to workers' });
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

// Get tasks (Admin/Manager all, Worker own only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === 'worker' ? { assignedTo: req.user.id } : {};

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task statistics
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const filter = req.user.role === 'worker' ? { assignedTo: req.user.id } : {};

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

    stats.forEach((stat) => {
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

// Get single task
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role === 'worker' && task.assignedTo._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status
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

// Update task (Admin/Manager)
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

// Delete task (Admin/Manager)
router.delete('/:id', authMiddleware, managerOrAdmin, async (req, res) => {
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

export default router;
