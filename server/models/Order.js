import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false
        },
        sku: {
          type: String,
          default: ''
        },
        productName: {
          type: String,
          required: true,
          trim: true
        },
        qty: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        }
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI'],
      default: 'Cash'
    },
    customerName: {
      type: String,
      default: 'Walk-in Customer',
      trim: true
    },
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    store: {
      type: String,
      default: 'Main Store'
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Cancelled'],
      default: 'Completed'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
