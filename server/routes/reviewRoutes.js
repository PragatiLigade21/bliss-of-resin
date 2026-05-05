const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * ✅ GET reviews for a product
 */
router.get("/product/:productId", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const sort = req.query.sort || "recent"; // recent, helpful, rating

    let sortObj = {};
    switch (sort) {
      case "helpful":
        sortObj = { "helpful.yes": -1 };
        break;
      case "rating":
        sortObj = { rating: -1 };
        break;
      case "recent":
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const reviews = await Review.find({
      product: req.params.productId,
      status: "approved"
    })
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("user", "name avatar");

    const total = await Review.countDocuments({
      product: req.params.productId,
      status: "approved"
    });

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(req.params.productId), status: "approved" } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
      ratingDistribution
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ ADD review for a product (USER)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user._id;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    // Check if user purchased this product (optional but recommended)
    const userOrder = await Order.findOne({
      user: userId,
      "orderItems.product": productId,
      isPaid: true
    });

    // Create review
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!userOrder,
      status: "pending" // Requires admin approval
    });

    await review.save();

    // Update product reviews array and rating
    await Product.findByIdAndUpdate(
      productId,
      {
        $push: { reviews: review._id },
        $inc: { numReviews: 1 }
      }
    );

    // Update product rating (average of all approved reviews)
    updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully. It will be published after approval.",
      review
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * ✅ UPDATE review (USER or ADMIN)
 */
router.put("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    // Update fields
    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.title) review.title = req.body.title;
    if (req.body.comment) review.comment = req.body.comment;

    await review.save();

    // Update product rating
    updateProductRating(review.product);

    res.json({ success: true, review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * ✅ DELETE review (USER or ADMIN)
 */
router.delete("/:reviewId", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check authorization
    if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Update product
    await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { reviews: review._id },
        $inc: { numReviews: -1 }
      }
    );

    // Update product rating
    updateProductRating(productId);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ MARK review as helpful (USER)
 */
router.post("/:reviewId/helpful", authMiddleware, async (req, res) => {
  try {
    const { helpful } = req.body; // true or false

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (helpful) {
      review.helpful.yes += 1;
    } else {
      review.helpful.no += 1;
    }

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ APPROVE/REJECT review (ADMIN ONLY)
 */
router.put("/:reviewId/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // approved, rejected

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Update product rating if approved
    if (status === "approved") {
      updateProductRating(review.product);
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Helper function to update product rating
 */
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({
      product: productId,
      status: "approved"
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, { rating: 0, numReviews: 0 });
      return;
    }

    const averageRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(averageRating.toFixed(1)),
      numReviews: reviews.length
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}

module.exports = router;
