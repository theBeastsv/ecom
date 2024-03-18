// controllers/orders.js
const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/productmodel"); // For updating product stock

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user data is available from middleware
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId"); // Populate product details
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price, // Use product price at order time
    }));

    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId,
      items: orderItems,
      total,
      shippingAddress,
    });
    await order.save();

    // Update product stock after successful order creation
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        product.stock -= item.quantity;
        await product.save();
      })
    );

    // Clear cart after successful order creation
    await Cart.deleteOne({ userId });

    res.json({ message: "Order created successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user data is available from middleware
    const orders = await Order.find({ userId }).populate("items.productId");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
