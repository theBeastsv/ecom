const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  shippingAddress: { type: String },
  paymentInfo: { type: Object }, // Store payment details securely
  status: { type: String, required: true, default: "pending" }, // Order status (pending, confirmed, shipped, delivered)
});

module.exports = mongoose.model("Order", orderSchema);
