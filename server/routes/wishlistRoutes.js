const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * ✅ GET user's wishlist
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("items.product");

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
      await wishlist.save();
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ ADD product to wishlist
 */
router.post("/add/:productId", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { notes } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    // Check if product already in wishlist
    const itemExists = wishlist.items.some(
      item => item.product.toString() === productId
    );

    if (itemExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    // Add to wishlist
    wishlist.items.push({
      product: productId,
      notes: notes || ""
    });

    await wishlist.save();
    await wishlist.populate("items.product");

    res.json({
      success: true,
      message: "Product added to wishlist",
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ REMOVE product from wishlist
 */
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    const itemIndex = wishlist.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist"
      });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();
    await wishlist.populate("items.product");

    res.json({
      success: true,
      message: "Product removed from wishlist",
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ CHECK if product is in wishlist
 */
router.get("/check/:productId", authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const isInWishlist = wishlist?.items.some(
      item => item.product.toString() === req.params.productId
    ) || false;

    res.json({ success: true, isInWishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ UPDATE notes for a wishlist item
 */
router.put("/:productId/notes", authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    const item = wishlist.items.find(
      item => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in wishlist"
      });
    }

    item.notes = notes || "";
    await wishlist.save();
    await wishlist.populate("items.product");

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ CLEAR entire wishlist
 */
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true }
    );

    res.json({
      success: true,
      message: "Wishlist cleared",
      wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
