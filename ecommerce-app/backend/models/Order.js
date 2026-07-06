const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true }, // snapshot at time of purchase
    price: { type: Number, required: true }, // snapshot at time of purchase
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    paymentMethod: { type: String, default: 'simulated_card' },
    itemsTotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
