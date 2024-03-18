const express = require("express");
const connect = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();
connect();
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.status(200).send("appi is working ");
});

app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/products", productRoutes);
const Port = process.env.Port || 5000;

app.listen(Port, (req, res) => {
  console.log(`Serer is ruuning on this port ${Port}`);
});
