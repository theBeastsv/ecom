// controllers/carts.js
const Cart = require("../models/cart");
const Product = require("../models/productmodel"); // For checking product stock

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user data is available from middleware
    const cart = await Cart.findOne({ userId }).populate("items.productId"); // Populate product details
    if (!cart) {
      return res.json({ message: "No items in cart" });
    }
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user data is available from middleware
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check product stock
    if (quantity > product.stock) {
      return res.status(400).json({ message: "Insufficient product stock" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
    }

    const existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/carts.js (continued)
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user data is available from middleware
    const productId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) =>
      item.productId.equals(productId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
