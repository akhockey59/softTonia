const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  type: String,
  name: String,
  priceModifier: Number
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  variants: {
    colors: [variantSchema],
    sizes: [variantSchema]
  },
  discount: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProductTest', productSchema); 