const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    image: { type: String, required: true }, // URL to product image
    stock: { type: Number, required: true, default: 100, min: 0 },
  },
  { timestamps: true }
);

// Text index so we can search by name/category/description
productSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
