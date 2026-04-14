const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem"
    }
  ],
  totalAmount: Number,
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);