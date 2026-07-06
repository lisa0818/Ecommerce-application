const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products?search=shoe&category=Footwear
// Supports searching by name/description and filtering by category.
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      // Case-insensitive partial match on name, description, or category
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// GET /api/products/categories  (distinct category list, for filter dropdown)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product id' });
  }
});

// POST /api/products  (basic create endpoint, useful for admin/seeding via API)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    if (!name || !description || price == null || !category || !image) {
      return res.status(400).json({ message: 'name, description, price, category, image are required' });
    }
    const product = await Product.create({ name, description, price, category, image, stock });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
});

module.exports = router;
