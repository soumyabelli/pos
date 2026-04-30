import express from 'express';
import Product from '../models/Product.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Get All Products
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

// ✅ Get Single Product
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

// ✅ Create Product (Manager/Admin only)
router.post('/', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { sku, product, category, price, stock, image, description } = req.body;

    const newProduct = new Product({
      sku,
      product,
      category,
      price,
      stock,
      image,
      description
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Product (Manager/Admin only)
router.put('/:id', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Product (Manager/Admin only)
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

// ✅ Update Stock
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
