const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, "Review title is required"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  comment: {
    type: String,
    required: [true, "Review comment is required"],
    maxlength: [1000, "Comment cannot exceed 1000 characters"],
    minlength: [10, "Comment must be at least 10 characters"]
  },
  images: [String], // Photos from user
  helpful: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 }
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ rating: -1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
