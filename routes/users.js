const express = require("express");
const router = express.Router();
const userController = require("../controllers/user"); 

// User registration
router.post("/register", userController.register);

// User login
router.post("/login", userController.login);

module.exports = router;
