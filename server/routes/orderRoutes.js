const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

// 🧾 CREATE ORDER (Protected)
router.post("/", async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = "COD",
      totalPrice
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Create order with proper structure
    const order = new Order({
      user: req.user.userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: paymentMethod === "COD" ? false : true, // COD is not paid yet
    });

    const createdOrder = await order.save();

    console.log(`✅ Order created: ${createdOrder._id} for user: ${req.user.userId}`);
    res.status(201).json(createdOrder);

  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  }
});

// 📦 GET ALL ORDERS (Protected - Admin only)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 👤 GET CURRENT USER'S ORDERS (Protected)
router.get("/my-orders", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching user orders" });
  }
});

// 🔍 GET SINGLE ORDER BY ID (Protected)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to current user (or admin)
    if (order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);

  } catch (err) {
    console.error("❌ Error fetching order:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    res.status(500).json({ message: "Error fetching order" });
  }
});

module.exports = router;