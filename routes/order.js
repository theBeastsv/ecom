const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order"); // Import order controller

// Create a new order (requires authorization)
router.post("/", orderController.createOrder);

// Get all user's orders (requires authorization)
router.get("/", orderController.getOrders);

module.exports = router;
