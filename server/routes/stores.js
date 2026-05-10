import express from 'express';
import Product from '../models/Product.js';
import { authMiddleware, managerOrAdmin } from '../middleware/auth.js';
import { 
  updateStoreStock, 
  getTotalInventory, 
  transferStock,
  findOptimalFulfillmentCenter,
  getLowStockAlerts 
} from '../utils/multiStoreService.js';
import { io } from '../server.js';

const router = express.Router();

/**
 * Store Locations
 */
const STORE_LOCATIONS = [
  { store: 'Main Store', city: 'Central', lat: 19.076, lng: 72.8777 },
  { store: 'Downtown Store', city: 'South', lat: 19.0176, lng: 72.8194 },
  { store: 'Mall Store', city: 'West', lat: 19.1136, lng: 72.8697 }
];

router.get('/locations', async (req, res) => {
  res.json(STORE_LOCATIONS);
});

/**
 * Get inventory for a product across all stores
 */
router.get('/inventory/:productId', authMiddleware, async (req, res) => {
  try {
    const inventory = await getTotalInventory(req.params.productId);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update stock at specific store
 */
router.post('/stock/update', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { productId, store, quantityChange } = req.body;
    const product = await updateStoreStock(productId, store, quantityChange);
    
    // Broadcast stock update
    io.to('inventory_channel').emit('store_stock:updated', {
      productId,
      store,
      newQuantity: quantityChange,
      timestamp: new Date()
    });

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Transfer stock between stores
 */
router.post('/transfer', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const { productId, fromStore, toStore, quantity } = req.body;
    
    const result = await transferStock(productId, fromStore, toStore, quantity);
    
    // Broadcast transfer event
    io.to('inventory_channel').emit('stock:transferred', {
      productId,
      from: fromStore,
      to: toStore,
      quantity,
      timestamp: new Date()
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Find optimal fulfillment center for a product
 */
router.post('/fulfillment/find', authMiddleware, async (req, res) => {
  try {
    const { productId, stores } = req.body;
    const optimalStore = await findOptimalFulfillmentCenter(productId, stores || ['Main Store', 'Downtown Store', 'Mall Store']);
    res.json({ optimalStore });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Get low stock alerts across all stores
 */
router.get('/alerts/low-stock', authMiddleware, managerOrAdmin, async (req, res) => {
  try {
    const alerts = await getLowStockAlerts();
    res.json({ count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get store-wise inventory summary
 */
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $unwind: '$storeStock'
      },
      {
        $group: {
          _id: '$storeStock.store',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$storeStock.quantity' },
          lowStockCount: {
            $sum: {
              $cond: [{ $lte: ['$storeStock.quantity', '$storeStock.reorderPoint'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
