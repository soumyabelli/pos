import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbancrust')
.then(async () => {
  await Category.deleteMany({});
  await Product.deleteMany({});

  const defaults = [
    { name: 'Grocery', description: 'Staples and daily needs.' },
    { name: 'Beverages', description: 'Juices, water and drinks.' },
    { name: 'Snacks', description: 'Chips, biscuits and namkeen.' },
    { name: 'Personal Care', description: 'Soaps, shampoos and oral care.' },
    { name: 'Household', description: 'Detergents and cleaners.' },
    { name: 'Dairy', description: 'Milk, butter and cheese.' },
    { name: 'Fruits & Veg', description: 'Fresh produce.' }
  ];
  await Category.insertMany(defaults);

  const products = [
    { sku: '8901262001234', product: 'Amul Milk 1L', category: 'Dairy', price: 64, stock: 150, threshold: 20, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', description: 'Fresh pasteurized milk.', isActive: true },
    { sku: '8901030720013', product: 'Tata Salt 1kg', category: 'Grocery', price: 28, stock: 200, threshold: 30, image: 'https://images.unsplash.com/photo-1627581518177-87eb6e210cd4?auto=format&fit=crop&w=600&q=80', description: 'Iodized salt.', isActive: true },
    { sku: '8901058001234', product: 'Maggi 2-Minute Noodles', category: 'Snacks', price: 14, stock: 300, threshold: 50, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80', description: 'Instant noodles.', isActive: true },
    { sku: '8901030823456', product: 'Surf Excel Matic 1kg', category: 'Household', price: 120, stock: 80, threshold: 15, image: 'https://images.unsplash.com/photo-1584824486516-0555a07fc511?auto=format&fit=crop&w=600&q=80', description: 'Washing powder.', isActive: true },
    { sku: '8901030720020', product: 'Bisleri Water 1L', category: 'Beverages', price: 20, stock: 500, threshold: 100, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80', description: 'Packaged drinking water.', isActive: true },
    { sku: '8901030720030', product: 'Colgate Strong Teeth 200g', category: 'Personal Care', price: 90, stock: 120, threshold: 25, image: 'https://images.unsplash.com/photo-1596755437812-32a2a074092b?auto=format&fit=crop&w=600&q=80', description: 'Toothpaste.', isActive: true },
    { sku: '8901030720040', product: 'Parle-G Biscuit 250g', category: 'Snacks', price: 20, stock: 250, threshold: 50, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', description: 'Glucose biscuits.', isActive: true },
    { sku: '8901030720050', product: 'Fortune Sunflower Oil 1L', category: 'Grocery', price: 150, stock: 90, threshold: 20, image: 'https://images.unsplash.com/photo-1474624080186-b4d45d949437?auto=format&fit=crop&w=600&q=80', description: 'Cooking oil.', isActive: true }
  ];
  await Product.insertMany(products);
  
  console.log('Seed successful');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
