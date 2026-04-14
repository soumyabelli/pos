const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["cashier", "manager", "admin"],
    default: "cashier"
  }
}, { timestamps: true });

// Index for fast lookup
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);