import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const categoriesData = [
  { name: 'Coffee', description: 'Hot and cold coffee items.' },
  { name: 'Drinks', description: 'Refreshing drinks and beverages.' },
  { name: 'Food', description: 'Main dishes and quick bites.' },
  { name: 'Dessert', description: 'Desserts and bakery items.' },
  { name: 'Specials', description: 'Viral Instagram Café Items.' }
];

const generateProducts = () => {
  const products = [];
  let counter = 1;

  const addItems = (list, category, basePrice, imgBase) => {
    list.forEach(name => {
      products.push({
        sku: `${category.substring(0, 3).toUpperCase()}-${counter.toString().padStart(3, '0')}`,
        product: name,
        category: category,
        price: basePrice + Math.floor(Math.random() * 100),
        stock: 50 + Math.floor(Math.random() * 50),
        threshold: 10,
        image: imgBase,
        description: `Delicious ${name.toLowerCase()}`,
        isActive: true
      });
      counter++;
    });
  };

  const coffee = ["Caramel Macchiato", "Frappuccino", "Cold Brew", "Spanish Latte", "Mocha Frappe", "Affogato", "Hazelnut Cappuccino", "Vanilla Sweet Cream Cold Brew", "Irish Coffee", "Dalgona Coffee", "Flat White", "Iced Americano", "Nitro Cold Brew", "Matcha Latte", "Vietnamese Egg Coffee"];
  const drinks = ["Mojito", "Blue Lagoon", "Bubble Tea", "Pina Colada", "Strawberry Mojito", "Mango Smoothie", "Hot Chocolate", "Virgin Margarita", "Lemon Iced Tea", "Oreo Shake", "Watermelon Cooler", "Milkshake", "Kombucha", "Espresso Martini", "Peach Iced Tea"];
  const food = ["Margherita Pizza", "Sushi Rolls", "Ramen", "Chicken Burger", "Loaded Fries", "Tacos", "Pasta Alfredo", "Butter Chicken", "Dim Sums", "Fried Chicken", "Burrito Bowl", "Korean Fried Chicken", "Garlic Bread", "Lasagna", "Steak Sandwich"];
  const dessert = ["Tiramisu", "Cheesecake", "Brownie Sundae", "Macarons", "Churros", "Red Velvet Cake", "Molten Lava Cake", "Donuts", "Mochi Ice Cream", "Belgian Waffles", "Banana Pudding", "Crème Brûlée", "Ice Cream Sundae", "Cinnamon Rolls", "Chocolate Croissant"];
  const viral = ["Pancake Stack", "Lotus Biscoff Shake", "Korean Corn Dog", "Croffle", "Sushi Bake", "Rainbow Cake", "Freakshake", "Cheese Pull Pizza", "Nutella Waffles", "Cotton Cheesecake", "Matcha Cheesecake", "Korean Garlic Bread", "Bento Cake", "Loaded Nachos", "Mini Pancake Cereal"];

  addItems(coffee, 'Coffee', 120, 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80');
  addItems(drinks, 'Drinks', 100, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80');
  addItems(food, 'Food', 200, 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=600&q=80');
  addItems(dessert, 'Dessert', 150, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=600&q=80');
  addItems(viral, 'Specials', 250, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80');

  return products;
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbancrust')
.then(async () => {
  await Category.deleteMany({});
  await Product.deleteMany({});

  await Category.insertMany(categoriesData);
  await Product.insertMany(generateProducts());
  
  console.log('Massive seed successful! Added 75 items.');
  process.exit(0);
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
