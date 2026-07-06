// Populates the database with sample products for local development/testing.
// Run with: npm run seed  (from the backend folder)
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Classic Leather Sneakers',
    description: 'Handcrafted leather sneakers with a cushioned insole, perfect for everyday wear.',
    price: 89.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    stock: 50,
  },
  {
    name: 'Running Trainers',
    description: 'Lightweight breathable trainers designed for long-distance running.',
    price: 74.5,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500',
    stock: 80,
  },
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 40,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Tracks heart rate, sleep, and workouts with a week-long battery life.',
    price: 129.0,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stock: 60,
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable, sustainably-sourced cotton t-shirt in a relaxed fit.',
    price: 24.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stock: 150,
  },
  {
    name: 'Denim Jacket',
    description: 'A timeless denim jacket that pairs with almost anything in your wardrobe.',
    price: 59.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500',
    stock: 70,
  },
  {
    name: 'Ceramic Pour-Over Coffee Set',
    description: 'A minimalist ceramic pour-over dripper and mug set for the coffee purist.',
    price: 42.0,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
    stock: 35,
  },
  {
    name: 'Aromatherapy Diffuser',
    description: 'Ultrasonic essential oil diffuser with adjustable mist and ambient LED light.',
    price: 34.5,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
    stock: 45,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip, eco-friendly yoga mat with alignment lines, 6mm thick.',
    price: 29.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    stock: 90,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells, 5-25 lbs per hand.',
    price: 149.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    stock: 25,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products.`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
