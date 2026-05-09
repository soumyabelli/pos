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
    { name: 'Coffee', description: 'Hot and cold coffee items.' },
    { name: 'Drinks', description: 'Soft drinks and beverages.' },
    { name: 'Food', description: 'Main dishes and quick bites.' },
    { name: 'Dessert', description: 'Desserts and bakery items.' }
  ];
  await Category.insertMany(defaults);

  const products = [
    {
      sku: 'COF-ESP-001',
      product: 'Espresso Shot',
      category: 'Coffee',
      price: 120,
      stock: 50,
      threshold: 10,
      image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80',
      description: 'Strong, rich espresso shot.',
      isActive: true
    },
    {
      sku: 'COF-LAT-002',
      product: 'Cafe Latte',
      category: 'Coffee',
      price: 180,
      stock: 42,
      threshold: 12,
      image: 'https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=600&q=80',
      description: 'Smooth espresso with steamed milk.',
      isActive: true
    },
    {
      sku: 'DRK-ICT-003',
      product: 'Iced Lemon Tea',
      category: 'Drinks',
      price: 140,
      stock: 60,
      threshold: 15,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
      description: 'Refreshing chilled lemon tea.',
      isActive: true
    },
    {
      sku: 'FOD-SND-004',
      product: 'Grilled Veg Sandwich',
      category: 'Food',
      price: 220,
      stock: 28,
      threshold: 8,
      image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=600&q=80',
      description: 'Toasted sandwich with fresh veggies.',
      isActive: true
    },
    {
      sku: 'DST-CHC-005',
      product: 'Chocolate Brownie',
      category: 'Dessert',
      price: 160,
      stock: 25,
      threshold: 7,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=600&q=80',
      description: 'Fudgy chocolate brownie square.',
      isActive: true
    },
    {
      sku: 'DST-CHC-006',
      product: 'Blueberry Muffin',
      category: 'Dessert',
      price: 150,
      stock: 18,
      threshold: 6,
      image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=600&q=80',
      description: 'Moist muffin loaded with blueberries.',
      isActive: true
    }
  ];
  await Product.insertMany(products);
  
  console.log('Seed successful');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
