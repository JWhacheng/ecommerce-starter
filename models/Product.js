const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    stock: Number,
    price: Float32Array,
    discount: Float32Array,
    picture: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
