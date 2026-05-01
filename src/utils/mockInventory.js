const INVENTORY_STORAGE_KEY = "urban_crust_inventory_v2";

// Initial seed data based on the Food/Cafe theme
const INITIAL_INVENTORY = [
  { id: "CF-ESP-01", product: "Espresso", sku: "1001", store: "Main Cafe", category: "Coffee", stock: 50, status: "optimal", price: 3.5, image: "☕" },
  { id: "CF-LAT-02", product: "Latte", sku: "1002", store: "Main Cafe", category: "Coffee", stock: 40, status: "optimal", price: 4.5, image: "🍵" },
  { id: "CF-CAP-03", product: "Cappuccino", sku: "1003", store: "Main Cafe", category: "Coffee", stock: 35, status: "optimal", price: 4.5, image: "☕" },
  { id: "FD-CRO-01", product: "Croissant", sku: "1004", store: "Main Cafe", category: "Food", stock: 20, status: "optimal", price: 2.5, image: "🥐" },
  { id: "FD-BMU-02", product: "Blueberry Muffin", sku: "1005", store: "Pastry Desk", category: "Food", stock: 15, status: "reorder", price: 3.0, image: "🧁" },
  { id: "DR-SPW-01", product: "Sparkling Water", sku: "1006", store: "Fridge A", category: "Drinks", stock: 60, status: "optimal", price: 2.0, image: "🥤" },
  { id: "DR-ICT-02", product: "Iced Tea", sku: "1007", store: "Fridge A", category: "Drinks", stock: 45, status: "optimal", price: 3.5, image: "🍹" },
  { id: "FD-SAN-03", product: "Sandwich", sku: "1008", store: "Main Cafe", category: "Food", stock: 5, status: "critical", price: 6.5, image: "🥪" },
  { id: "DS-CHC-01", product: "Chocolate Cake", sku: "1009", store: "Pastry Desk", category: "Dessert", stock: 12, status: "reorder", price: 5.0, image: "🍰" },
  { id: "DS-MAC-02", product: "Macaron", sku: "1010", store: "Main Cafe", category: "Dessert", stock: 0, status: "critical", price: 2.5, image: "🍪" },
];

function updateStatus(stock) {
  if (stock === 0) return "critical";
  if (stock <= 15) return "reorder";
  return "optimal";
}

/**
 * Initializes localStorage with seed data if it doesn't exist
 */
export function initializeInventory() {
  const existing = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(INITIAL_INVENTORY));
  }
}

/**
 * Gets the current inventory list from localStorage
 */
export function getInventory() {
  initializeInventory();
  try {
    return JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Error parsing inventory from local storage", error);
    return [];
  }
}

/**
 * Set the entire inventory and dispatch a custom event so listeners can re-render
 */
export function setInventory(inventoryArray) {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventoryArray));
  window.dispatchEvent(new Event("inventory_updated"));
}

/**
 * Reduces stock levels for items purchased in the POS
 * @param {Array} cartItems - Array of { sku: string, qty: number } objects
 */
export function reduceStockForPurchase(cartItems) {
  const currentInventory = getInventory();
  
  const updatedInventory = currentInventory.map(item => {
    const purchasedItem = cartItems.find(cartItem => cartItem.sku === item.sku);
    if (purchasedItem) {
      const newStock = Math.max(0, item.stock - purchasedItem.qty);
      return {
        ...item,
        stock: newStock,
        status: updateStatus(newStock)
      };
    }
    return item;
  });
  
  setInventory(updatedInventory);
}
