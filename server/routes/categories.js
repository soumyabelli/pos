import express from 'express';
import Category from '../models/Category.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { name, description = '' } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || ''
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
