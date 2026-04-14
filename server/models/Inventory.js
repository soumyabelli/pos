const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Prevent duplicate product-store entries
inventorySchema.index({ product: 1, store: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", inventorySchema);