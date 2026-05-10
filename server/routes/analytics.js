import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * Sales Analytics - Daily, Weekly, Monthly sales data
 */
router.get('/sales', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    let dateRange;

    const now = new Date();
    if (period === 'daily') {
      dateRange = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'weekly') {
      dateRange = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      dateRange = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: dateRange }, status: 'Completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          ordersCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ period, salesData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Product Performance - Top sellers, slow movers
 */
router.get('/products-performance', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const topSellers = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productName',
          totalQty: { $sum: '$items.qty' },
          totalRevenue: { $sum: '$items.total' },
          avgPrice: { $avg: '$items.price' }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 10 }
    ]);

    const slowMovers = await Product.find({ stock: { $gt: 0 } })
      .select('product sku stock monthlySalesVelocity')
      .sort({ monthlySalesVelocity: 1 })
      .limit(10);

    res.json({ topSellers, slowMovers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Inventory Status - Low stock alerts, overstock
 */
router.get('/inventory-status', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const lowStock = await Product.find({
      $expr: { $lte: ['$stock', '$threshold'] },
      isActive: true
    }).select('sku product stock threshold');

    const overstock = await Product.find({
      stock: { $gt: 50 },
      monthlySalesVelocity: { $lt: 5 }
    }).select('sku product stock monthlySalesVelocity');

    res.json({ 
      lowStock: lowStock.length,
      items: lowStock,
      overstock: overstock.length,
      overstockItems: overstock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Financial Reports - Revenue, tax, payments breakdown
 */
router.get('/financial', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const financialData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalTax: { $sum: '$tax' },
          totalSubtotal: { $sum: '$subtotal' },
          ordersCount: { $sum: 1 }
        }
      }
    ]);

    const paymentBreakdown = await Order.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          amount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      financial: financialData[0] || { totalRevenue: 0, totalTax: 0, totalSubtotal: 0, ordersCount: 0 },
      paymentBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cashier Performance - Orders processed, revenue
 */
router.get('/cashier-performance', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const cashierStats = await Order.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: '$cashier',
          ordersCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { ordersCount: -1 } }
    ]);

    const populatedStats = await Promise.all(
      cashierStats.map(async (stat) => {
        const user = await User.findById(stat._id).select('name username');
        return {
          ...stat,
          cashierName: user?.name || 'Unknown',
          cashierUsername: user?.username || 'Unknown'
        };
      })
    );

    res.json(populatedStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Inventory Forecasting - Reorder recommendations
 */
router.get('/forecasting', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    const forecasts = products.map((product) => {
      const velocity = product.monthlySalesVelocity || 0;
      const leadTime = 7; // days
      const safetyStock = velocity * (leadTime / 30);
      const reorderPoint = safetyStock + velocity * 0.5;
      const economicOrderQty = Math.sqrt((2 * 100 * velocity) / 0.25);

      return {
        sku: product.sku,
        product: product.product,
        currentStock: product.stock,
        monthlySalesVelocity: velocity,
        reorderPoint: Math.ceil(reorderPoint),
        economicOrderQty: Math.ceil(economicOrderQty),
        shouldReorder: product.stock <= Math.ceil(reorderPoint),
        daysOfSupply: velocity > 0 ? Math.ceil(product.stock / (velocity / 30)) : 0
      };
    });

    const shouldReorderItems = forecasts.filter(f => f.shouldReorder);

    res.json({
      totalForecasts: forecasts.length,
      itemsToReorder: shouldReorderItems.length,
      forecasts: forecasts.sort((a, b) => a.daysOfSupply - b.daysOfSupply)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Customer Analytics - Repeat customers, spending patterns
 */
router.get('/customer-analytics', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const customerStats = await Order.aggregate([
      { $match: { status: 'Completed', customerPhone: { $ne: '' } } },
      {
        $group: {
          _id: '$customerPhone',
          customerName: { $first: '$customerName' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    const repeatCustomers = customerStats.filter(c => c.orderCount > 1);

    res.json({
      totalCustomers: customerStats.length,
      repeatCustomers: repeatCustomers.length,
      topCustomers: customerStats.slice(0, 10),
      repeatCustomerStats: repeatCustomers.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
