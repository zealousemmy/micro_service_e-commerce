const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5050;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./Product");
const isAuthenticated = require("../isAuthenticated");
dotenv.config();
const amqp = require("amqplib");
let channel, connection;
app.use(express.json());
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Product service DB Connected");
  }
);
// function to connect rabbitmq to rabbitmq
async function connect() {
  // const connection = await amqp.connect(process.env.RABBITMQ_URI);
  // const channel = await connection.createChannel();
  // return {connection, channel};
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");
}
connect();
// create a new product
app.post("/products/create", isAuthenticated, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const newProduct = new Product({ name, description, price });
    // await newProduct.save();
    res.status(201).send(newProduct);
  } catch (err) {
    console.log(err);
  }
});
// Buy a new product
// analysing how the user buys the product
// user sends a list of product Id's to buy in array format
// creating an order with those product and a total value of sum of product's prices
app.post("/products/buy", isAuthenticated, async (req, res) => {
  const { productIds } = req.body;
  try {
    const products = await Product.find({ _id: { $in: productIds } });
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(`listening to ${port} at product service`);
});
