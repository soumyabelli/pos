const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = mongoose.model("Store", storeSchema);