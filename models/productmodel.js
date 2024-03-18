const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  stock: { type: Number, required: true },
  imageUrl: { type: String }, // URL for locally stored image (optional)
});

module.exports = mongoose.model("Product", productSchema);
