const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require a logged-in user, so the cart persists to their account
// and follows them across devices/browsers.
router.use(protect);

async function getPopulatedCart(userId) {
  const user = await User.findById(userId).populate('cart.product');
  return user.cart;
}

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
});

// POST /api/cart  { productId, quantity }
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.userId);
    const existingItem = user.cart.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({ product: productId, quantity: Number(quantity) });
    }

    await user.save();
    res.status(201).json(await getPopulatedCart(req.userId));
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
});

// PUT /api/cart/:productId  { quantity }
router.put('/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const user = await User.findById(req.userId);
    const item = user.cart.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = Number(quantity);
    await user.save();
    res.json(await getPopulatedCart(req.userId));
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    res.json(await getPopulatedCart(req.userId));
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove cart item', error: err.message });
  }
});

// DELETE /api/cart  (clear whole cart, used after checkout)
router.delete('/', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
});

module.exports = router;
