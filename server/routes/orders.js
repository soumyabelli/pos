import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// ✅ Create Order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items = [], subtotal = 0, tax = 0, paymentMethod, customerName } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must include at least one item' });
    }

    const totalAmount = subtotal + tax;
    const orderId = `ORD-${Date.now()}`;
    const normalizedItems = [];

    // Normalize items and update stock for each item where possible
    for (const item of items) {
      const qty = Number(item.qty || 0);
      const price = Number(item.price || 0);

      if (!qty || qty < 1) {
        return res.status(400).json({ error: 'Each item must have qty >= 1' });
      }

      let dbProduct = null;
      if (item.product) {
        dbProduct = await Product.findById(item.product);
      }

      if (!dbProduct && item.sku) {
        dbProduct = await Product.findOne({ sku: String(item.sku) });
      }

      if (dbProduct) {
        dbProduct.stock = Math.max(0, dbProduct.stock - qty);
        await dbProduct.save();
      }

      normalizedItems.push({
        product: dbProduct?._id,
        sku: item.sku || dbProduct?.sku || '',
        productName: item.productName || item.product || dbProduct?.product || 'Item',
        qty,
        price,
        total: Number(item.total || qty * price)
      });
    }

    const order = new Order({
      orderId,
      items: normalizedItems,
      subtotal,
      tax,
      totalAmount,
      paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      cashier: req.user.id,
      store: 'Main Store'
    });

    await order.save();
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('cashier', 'name email')
      .populate('items.product', 'product price sku')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Orders Statistics
router.get('/stats/daily', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalItems: { $sum: { $size: '$items' } }
        }
      }
    ]);

    res.json(orders[0] || { totalOrders: 0, totalRevenue: 0, totalItems: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Single Order
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cashier', 'name email')
      .populate('items.product', 'product price sku');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
