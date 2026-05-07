import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const REQUIRED_ENV = ['MONGO_URI'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
}

const seedUsers = [
  {
    name: 'Admin',
    username: 'admin',
    email: 'admin@urbancrust.com',
    password: 'admin',
    role: 'admin'
  },
  {
    name: 'Manager',
    username: 'manager',
    email: 'manager@urbancrust.com',
    password: 'manager',
    role: 'manager'
  },
  {
    name: 'Store User',
    username: 'user',
    email: 'user@urbancrust.com',
    password: 'user',
    role: 'user'
  }
];

async function upsertDefaultUser(seedUser) {
  let user = await User.findOne({
    $or: [{ username: seedUser.username.toLowerCase() }, { email: seedUser.email.toLowerCase() }]
  }).select('+password');

  if (!user) {
    await User.create({ ...seedUser, store: 'Main Store', isActive: true });
    return { username: seedUser.username, action: 'created' };
  }

  user.name = seedUser.name;
  user.username = seedUser.username;
  user.email = seedUser.email;
  user.role = seedUser.role;
  user.isActive = true;
  user.store = 'Main Store';
  user.password = seedUser.password;
  await user.save();
  return { username: seedUser.username, action: 'updated' };
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const results = [];
  for (const seedUser of seedUsers) {
    const result = await upsertDefaultUser(seedUser);
    results.push(result);
  }

  for (const item of results) {
    console.log(`${item.username}: ${item.action}`);
  }
  console.log('Seeding complete.');
}

run()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
