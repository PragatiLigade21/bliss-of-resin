const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");

// 🧾 CREATE ORDER (Protected)
router.post("/", authMiddleware, async (req, res) => {
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

    // Detailed Debug Logging
    console.log("📥 Incoming Request Body Summary:", {
      itemCount: orderItems?.length,
      hasAddress: !!shippingAddress,
      paymentMethod,
      totalPrice
    });

    if (!req.user || !req.user._id) {
      console.error("❌ Auth Error: req.user or req.user._id is missing");
      return res.status(401).json({ message: "User authentication failed" });
    }

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    // Create order with proper structure and type safety
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map(item => ({
        name: item.name,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        product: item.product,
        image: item.image || "/vite.svg"
      })),
      shippingAddress: {
        name: shippingAddress.name || "Customer",
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state || "",
        zipCode: shippingAddress.zipCode || "",
        country: shippingAddress.country || "India",
        phone: shippingAddress.phone
      },
      paymentMethod: paymentMethod || "COD",
      subtotal: Number(subtotal) || 0,
      taxAmount: Number(taxAmount) || 0,
      shippingCost: Number(shippingCost) || 0,
      totalPrice: Number(totalPrice) || 0,
      isPaid: paymentMethod === "COD" ? false : true,
    });

    console.log("🛠️ Attempting to save order...");
    const createdOrder = await order.save();

    console.log(`✅ Order saved successfully: ${createdOrder._id}`);
    res.status(201).json({
      success: true,
      order: createdOrder
    });

  } catch (err) {
    // Exact error logging for deployed environment debugging
    console.error("❌ CREATE_ORDER_CONTROLLER_ERROR:", err);
    console.error("❌ ERROR_MESSAGE:", err.message);
    console.error("❌ ERROR_STACK:", err.stack);
    
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false,
        message: "Validation Error", 
        details: messages,
        error: err.message 
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({ 
        success: false,
        message: `Invalid data for field: ${err.path}`, 
        error: err.message 
      });
    }

    // Return the exact error message to the frontend for diagnosis
    res.status(500).json({ 
      success: false,
      message: err.message || "Internal Server Error during order creation", 
      error: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
  }
});

// 📦 GET ALL ORDERS (Protected - Admin only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// 👤 GET CURRENT USER'S ORDERS (Protected)
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Error fetching user orders" });
  }
});

// 🔍 GET SINGLE ORDER BY ID (Protected)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to current user (or admin)
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
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