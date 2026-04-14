const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String
  },
  sku: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Text search index
productSchema.index({ name: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);