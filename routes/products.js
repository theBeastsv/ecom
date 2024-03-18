const express = require("express");
const router = express.Router();
const productController = require("../controllers/pproducts"); // Import product controller

// Get all products
router.get("/", productController.getAllProducts);

// Get a product by ID
router.get("/:id", productController.getProductById);

// Create a product (requires authorization)
router.post("/", productController.createProduct);

// Update a product by ID (requires authorization)
router.put("/:id", productController.updateProduct);

// Delete a product by ID (requires authorization)
router.delete("/:id", productController.deleteProduct);

module.exports = router;
