import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    product: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Coffee', 'Drinks', 'Food', 'Dessert'],
      default: 'Coffee'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      default: '☕'
    },
    description: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
