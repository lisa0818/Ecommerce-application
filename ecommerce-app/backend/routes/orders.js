const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.08;

// POST /api/orders/checkout
// Body: { shippingAddress, paymentMethod, cardNumber }  (card details are NEVER stored)
// Reads the user's persisted cart, "charges" a simulated payment, creates an Order,
// then empties the cart.
router.post('/checkout', async (req, res) => {
  try {
    const { shippingAddress, cardNumber } = req.body;

    const user = await User.findById(req.userId).populate('cart.product');
    if (!user.cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // --- Simulated payment gateway ---
    // No real payment processor is called. We just validate a plausible card
    // number format and randomly succeed/fail to mimic a real gateway.
    const digitsOnly = (cardNumber || '').replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digitsOnly)) {
      return res.status(400).json({ message: 'Invalid card number format' });
    }
    const paymentSucceeded = true; // deterministic success for demo purposes

    const items = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Number((itemsTotal * TAX_RATE).toFixed(2));
    const totalPrice = Number((itemsTotal + SHIPPING_FEE + tax).toFixed(2));

    const order = await Order.create({
      user: user._id,
      items,
      shippingAddress,
      paymentMethod: 'simulated_card',
      itemsTotal,
      shippingFee: SHIPPING_FEE,
      tax,
      totalPrice,
      status: paymentSucceeded ? 'paid' : 'failed',
      paidAt: paymentSucceeded ? new Date() : undefined,
    });

    // Empty the cart only after a successful simulated payment
    if (paymentSucceeded) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json({ order, message: 'Payment simulated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
});

// GET /api/orders  (order history for the logged-in user)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Invalid order id' });
  }
});

module.exports = router;
