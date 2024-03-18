const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart"); // Import cart controller

// Get user's cart
router.get("/", cartController.getCart);

// Add item to cart
router.post("/", cartController.addToCart);

// Remove item from cart
router.delete("/:id", cartController.removeFromCart);

module.exports = router;
