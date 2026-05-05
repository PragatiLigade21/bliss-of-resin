const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * ============================================
 * ADMIN DASHBOARD STATS
 * ============================================
 */

/**
 * ✅ GET dashboard statistics
 */
router.get("/dashboard/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    const topProducts = await Product.find()
      .sort({ viewCount: -1 })
      .limit(5)
      .select("name price viewCount rating");

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        orderStats: {
          pending: pendingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders
        },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ============================================
 * ORDER MANAGEMENT
 * ============================================
 */

/**
 * ✅ GET all orders (for admin)
 */
router.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;
    const sort = req.query.sort || "newest";

    let filters = {};
    if (status && status !== "all") {
      filters.status = status;
    }

    let sortObj = {};
    switch (sort) {
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "highest":
        sortObj = { totalPrice: -1 };
        break;
      case "lowest":
        sortObj = { totalPrice: 1 };
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const total = await Order.countDocuments(filters);
    const orders = await Order.find(filters)
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("user", "name email phone");

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ GET single order details
 */
router.get("/orders/:orderId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ UPDATE order status
 */
router.put("/orders/:orderId/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, trackingNumber, shippingCompany } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;
    
    if (status === "shipped") {
      order.trackingNumber = trackingNumber;
      order.shippingCompany = shippingCompany;
      order.trackingUpdates.push({
        status: "shipped",
        timestamp: new Date(),
        description: "Your order has been shipped"
      });
    }

    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.trackingUpdates.push({
        status: "delivered",
        timestamp: new Date(),
        description: "Your order has been delivered"
      });
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ UPDATE order payment status
 */
router.put("/orders/:orderId/payment", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isPaid } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        isPaid,
        paidAt: isPaid ? new Date() : null
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Payment status updated",
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ ADD admin notes to order
 */
router.put("/orders/:orderId/notes", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { notes, internalNotes } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { notes, internalNotes },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ============================================
 * USER MANAGEMENT
 * ============================================
 */

/**
 * ✅ GET all users (for admin)
 */
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total = await User.countDocuments();
    const users = await User.find()
      .select("-password")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ UPDATE user role (make admin)
 */
router.put("/users/:userId/role", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isAdmin } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User role updated",
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ DEACTIVATE user account
 */
router.put("/users/:userId/deactivate", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User account deactivated",
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ============================================
 * PRODUCT MANAGEMENT
 * ============================================
 */

/**
 * ✅ GET products for admin (including inactive)
 */
router.get("/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const keyword = req.query.keyword;

    let filters = {};
    if (keyword) {
      filters.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { sku: { $regex: keyword, $options: "i" } }
      ];
    }

    const total = await Product.countDocuments(filters);
    const products = await Product.find(filters)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ BULK UPDATE product stock
 */
router.post("/products/bulk/stock", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { updates } = req.body; // Array of {productId, stock}

    const results = await Promise.all(
      updates.map(update =>
        Product.findByIdAndUpdate(
          update.productId,
          { stock: update.stock },
          { new: true }
        )
      )
    );

    res.json({
      success: true,
      message: "Stock updated successfully",
      updated: results.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
