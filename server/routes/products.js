import express from 'express';
import Product from '../models/Product.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public catalog (active products only)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin catalog (includes inactive products)
router.get('/admin/all', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const {
      sku,
      product,
      name,
      category,
      price,
      stock,
      threshold,
      image,
      imageUrl,
      description,
      status,
      isActive
    } = req.body;

    const newProduct = new Product({
      sku,
      product: product || name,
      category,
      price,
      stock,
      threshold,
      image: imageUrl || image,
      description,
      isActive: typeof isActive === 'boolean' ? isActive : status !== 'Inactive'
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const {
      sku,
      product: productName,
      name,
      category,
      price,
      stock,
      threshold,
      image,
      imageUrl,
      description,
      status,
      isActive
    } = req.body;

    const updates = {
      sku,
      product: productName || name,
      category,
      price,
      stock,
      threshold,
      image: imageUrl || image,
      description
    };

    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    } else if (status) {
      updates.isActive = status !== 'Inactive';
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/stock', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: quantity } },
      { new: true }
    );
    res.json({ message: 'Stock updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
