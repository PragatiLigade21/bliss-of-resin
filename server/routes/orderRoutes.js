const express = require("express");
const router = express.Router();

const Order = require("../models/Order");

// 🧾 CREATE ORDER (Protected)
router.post("/", async (req, res) => {
  console.log("🚀 Create Order API Hit!");
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = "COD",
      subtotal,
      taxAmount,
      shippingCost,
      totalPrice
    } = req.body;

    console.log("📥 Incoming Order Request Body:", JSON.stringify(req.body, null, 2));
    console.log("👤 Logged-in User Info:", req.user);

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      console.warn("⚠️ Validation failed: No order items");
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress) {
      console.warn("⚠️ Validation failed: Shipping address is required");
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Create order with proper structure
    const order = new Order({
      user: req.user._id, // Use the ObjectId from authMiddleware
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: Number(subtotal),
      taxAmount: Number(taxAmount),
      shippingCost: Number(shippingCost),
      totalPrice: Number(totalPrice),
      isPaid: paymentMethod === "COD" ? false : true, // COD is not paid yet
    });

    console.log("🛠️ Attempting to save order to MongoDB...");
    const createdOrder = await order.save();

    console.log(`✅ Order saved successfully: ${createdOrder._id}`);
    res.status(201).json(createdOrder);

  } catch (err) {
    console.error("❌ MongoDB Order Save Error:", err);
    
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      console.warn("⚠️ Validation Details:", messages);
      return res.status(400).json({ 
        message: "Order validation failed", 
        details: messages 
      });
    }

    if (err.name === "CastError") {
      console.warn("⚠️ Cast Error:", err.message);
      return res.status(400).json({ 
        message: "Invalid data format in order", 
        field: err.path 
      });
    }

    res.status(500).json({ 
      message: "Server error during order creation", 
      error: err.message 
    });
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