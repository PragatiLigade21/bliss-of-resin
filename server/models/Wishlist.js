const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One wishlist per user
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        addedAt: {
          type: Date,
          default: Date.now,
        },

        notes: String, // User notes about product
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Index for product search performance
wishlistSchema.index({ "items.product": 1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);