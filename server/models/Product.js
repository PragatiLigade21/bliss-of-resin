const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    originalPrice: {
      type: Number,
      default: null, // For showing discounts
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    image: {
      type: String,
      required: true
    },
    images: [{
      type: String,
      default: [] // Multiple images for product gallery
    }],
    category: {
      type: String,
      required: true,
      enum: ["Resin Art", "Resin Trays", "Jewelry", "Home Decor", "Accessories", "Other"]
    },
    subcategory: {
      type: String,
      default: null
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    tags: [String], // For search optimization
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    dimensions: {
      width: { type: String, default: null },
      height: { type: String, default: null },
      depth: { type: String, default: null }
    },
    weight: String,
    material: String,
    color: String,
    viewCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Index for search optimization
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

module.exports = mongoose.model("Product", productSchema);