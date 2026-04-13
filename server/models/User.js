const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["cashier", "manager", "admin"],
    default: "cashier"
  }
});

module.exports = mongoose.model("User", userSchema);