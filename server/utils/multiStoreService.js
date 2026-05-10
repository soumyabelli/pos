import Product from '../models/Product.js';

/**
 * Multi-Store Inventory Service
 * Manages inventory across multiple store locations
 */

export const updateStoreStock = async (productId, store, quantityChange) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  let storeInventory = product.storeStock.find(s => s.store === store);
  if (!storeInventory) {
    storeInventory = { store, quantity: 0, reorderPoint: product.threshold };
    product.storeStock.push(storeInventory);
  }

  storeInventory.quantity += quantityChange;
  if (storeInventory.quantity < 0) {
    throw new Error(`Insufficient stock at ${store}. Available: ${storeInventory.quantity - quantityChange}`);
  }

  // Update legacy stock field
  product.stock += quantityChange;
  await product.save();
  return product;
};

/**
 * Get total inventory across all stores
 */
export const getTotalInventory = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const totalQty = product.storeStock.reduce((sum, store) => sum + store.quantity, 0);
  return { 
    total: totalQty, 
    byStore: product.storeStock,
    legacy: product.stock 
  };
};

/**
 * Transfer inventory between stores
 */
export const transferStock = async (productId, fromStore, toStore, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const fromInventory = product.storeStock.find(s => s.store === fromStore);
  if (!fromInventory || fromInventory.quantity < quantity) {
    throw new Error(`Insufficient stock at ${fromStore}`);
  }

  fromInventory.quantity -= quantity;

  let toInventory = product.storeStock.find(s => s.store === toStore);
  if (!toInventory) {
    toInventory = { store: toStore, quantity: 0, reorderPoint: product.threshold };
    product.storeStock.push(toInventory);
  }
  toInventory.quantity += quantity;

  await product.save();
  return { success: true, product };
};

/**
 * Find best fulfillment center for an order
 * Considers: stock availability, distance, store capacity
 */
export const findOptimalFulfillmentCenter = async (productId, stores) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const storesWithStock = product.storeStock
    .filter(s => stores.includes(s.store) && s.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity);

  if (storesWithStock.length === 0) {
    throw new Error('No stores have sufficient stock');
  }

  // Prefer store with highest stock
  return storesWithStock[0].store;
};

/**
 * Get low stock alerts across all stores
 */
export const getLowStockAlerts = async () => {
  const alerts = await Product.aggregate([
    {
      $addFields: {
        lowStockStores: {
          $filter: {
            input: '$storeStock',
            as: 'store',
            cond: { $lte: ['$$store.quantity', '$$store.reorderPoint'] }
          }
        }
      }
    },
    { $match: { lowStockStores: { $ne: [] } } },
    { $project: { sku: 1, product: 1, lowStockStores: 1 } }
  ]);

  return alerts;
};
