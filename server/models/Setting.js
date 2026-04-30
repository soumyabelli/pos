import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      default: 'Urban Crust Main Store',
      trim: true
    },
    currency: {
      type: String,
      required: true,
      default: 'Rs',
      trim: true
    },
    taxRate: {
      type: Number,
      required: true,
      default: 8.5,
      min: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
