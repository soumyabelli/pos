export const initialCategories = [
  {
    id: "cat-1",
    name: "Beverages",
    description: "Soft drinks, juices, and ready-to-drink refreshments.",
  },
  {
    id: "cat-2",
    name: "Snacks",
    description: "Impulse buys, chips, chocolates, and packaged treats.",
  },
  {
    id: "cat-3",
    name: "Personal Care",
    description: "Daily-use hygiene and self-care essentials.",
  },
  {
    id: "cat-4",
    name: "Household",
    description: "Cleaning and home maintenance essentials.",
  },
];

export const initialProducts = [
  { id: "prd-1", name: "Big Mac", category: "Fast Food", price: 5.99, stock: 150, threshold: 25, sku: "MCD-BM-01", description: "Two 100% beef patties, special sauce, lettuce, cheese.", imageName: "burger.png", status: "Active" },
  { id: "prd-2", name: "Whopper", category: "Fast Food", price: 6.49, stock: 120, threshold: 20, sku: "BK-WH-02", description: "A ¼ lb of savory flame-grilled beef topped with tomatoes.", imageName: "burger.png", status: "Active" },
  { id: "prd-3", name: "KFC Original Bucket", category: "Fast Food", price: 14.99, stock: 50, threshold: 10, sku: "KFC-OB-03", description: "Classic 8-piece chicken bucket.", imageName: "chicken.png", status: "Active" },
  { id: "prd-4", name: "Subway B.M.T.", category: "Fast Food", price: 7.99, stock: 80, threshold: 15, sku: "SUB-BMT-04", description: "Spicy pepperoni, salami, and black forest ham.", imageName: "sandwich.png", status: "Active" },
  { id: "prd-5", name: "Caramel Frappuccino", category: "Beverages", price: 4.95, stock: 200, threshold: 30, sku: "SBUX-CF-05", description: "Caramel syrup blended with coffee, milk and ice.", imageName: "coffee.png", status: "Active" },
  { id: "prd-6", name: "Domino's Pepperoni", category: "Fast Food", price: 11.99, stock: 90, threshold: 15, sku: "DOM-PEP-06", description: "Classic pepperoni pizza with mozzarella.", imageName: "pizza.png", status: "Active" },
  { id: "prd-7", name: "Taco Bell Crunchwrap", category: "Fast Food", price: 4.59, stock: 110, threshold: 20, sku: "TB-CW-07", description: "A warm tortilla filled with seasoned beef, nacho cheese.", imageName: "taco.png", status: "Active" },
  { id: "prd-8", name: "Dunkin' Glazed Donut", category: "Snacks", price: 1.49, stock: 300, threshold: 40, sku: "DNK-GD-08", description: "Classic sweet glazed donut.", imageName: "donut.png", status: "Active" },
  { id: "prd-9", name: "Wendy's Frosty", category: "Beverages", price: 2.29, stock: 180, threshold: 25, sku: "WEN-FR-09", description: "Signature chocolate dairy dessert.", imageName: "icecream.png", status: "Active" },
  { id: "prd-10", name: "Pizza Hut Stuffed Crust", category: "Fast Food", price: 15.99, stock: 60, threshold: 10, sku: "PH-SC-10", description: "Cheese stuffed crust pizza.", imageName: "pizza.png", status: "Active" },
  { id: "prd-11", name: "Chipotle Burrito Bowl", category: "Fast Food", price: 9.85, stock: 140, threshold: 20, sku: "CHP-BB-11", description: "Rice, beans, fajita veggies, and your choice of meat.", imageName: "bowl.png", status: "Active" },
  { id: "prd-12", name: "Panda Express Orange Chicken", category: "Fast Food", price: 8.50, stock: 100, threshold: 15, sku: "PE-OC-12", description: "Crispy chicken bites in sweet and spicy orange sauce.", imageName: "chicken.png", status: "Active" }
];

export const orders = Array.from({ length: 26 }).map((_, i) => {
  const statuses = ["Completed", "Pending", "Cancelled"];
  const channels = ["In-store", "Website", "Marketplace", "Drive-thru"];
  const customers = [
    "Ronald McDonald", "Colonel Sanders", "Wendy Thomas", "Howard Schultz", 
    "John Schnatter", "Glen Bell", "Dan Cathy", "Steve Ells"
  ];
  return {
    id: `ORD-9${2000 + i}`,
    channel: channels[i % channels.length],
    customer: customers[i % customers.length],
    amount: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    date: `2026-04-${(i % 30 + 1).toString().padStart(2, '0')} ${10 + (i % 12)}:15`,
    status: statuses[i % statuses.length],
  };
});

export const initialUsers = [
  { id: "usr-1", name: "Ariana Wells", email: "ariana@novaretail.com", role: "Admin", status: "Active" },
  { id: "usr-2", name: "John Carter", email: "john@novaretail.com", role: "Manager", status: "Active" },
  { id: "usr-3", name: "Sophia Lee", email: "sophia@novaretail.com", role: "Cashier", status: "Active" },
  { id: "usr-4", name: "Mike Chen", email: "mike@novaretail.com", role: "Inventory", status: "Inactive" },
];

export const salesOverview = [
  { month: "Jan", online: 15000, store: 17200 },
  { month: "Feb", online: 18100, store: 16200 },
  { month: "Mar", online: 19800, store: 18400 },
  { month: "Apr", online: 21400, store: 19100 },
  { month: "May", online: 22500, store: 20500 },
  { month: "Jun", online: 23600, store: 21100 },
  { month: "Jul", online: 24900, store: 22200 },
  { month: "Aug", online: 26100, store: 23500 },
  { month: "Sep", online: 27300, store: 24100 },
  { month: "Oct", online: 28000, store: 25800 },
  { month: "Nov", online: 29100, store: 26600 },
  { month: "Dec", online: 30900, store: 27800 },
];
