import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['size', 'color', 'other'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  additionalPrice: {
    type: Number,
    default: 0
  }
});

const storeStockSchema = new mongoose.Schema({
  store: {
    type: String,
    default: 'Main Store'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  reorderPoint: {
    type: Number,
    default: 10
  }
});

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    barcode: {
      type: String,
      default: '',
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
      default: 'General',
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    // Legacy field for backward compatibility
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    // Multi-store stock tracking
    storeStock: [storeStockSchema],
    
    // Inventory management
    threshold: {
      type: Number,
      default: 10,
      min: 0
    },
    
    // Variants support (size, color, etc.)
    variants: [variantSchema],
    
    // Sales forecasting
    monthlySalesVelocity: {
      type: Number,
      default: 0,
      description: 'Average units sold per month'
    },
    
    // Dynamic pricing
    dynamicPrice: {
      enabled: {
        type: Boolean,
        default: false
      },
      rules: [{
        condition: String,
        priceAdjustment: Number
      }]
    },
    
    image: {
      type: String,
      default: 'Item'
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

// Virtual for total stock across all stores
productSchema.virtual('totalStock').get(function() {
  return this.storeStock.reduce((sum, store) => sum + store.quantity, this.stock);
});

// Index for performance optimization
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ barcode: 1 });

export default mongoose.model('Product', productSchema);

