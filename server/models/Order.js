const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orderItems: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    image: { type: String, required: true }
  }],
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zipCode: String,
    country: { type: String, default: "India" },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Razorpay", "Stripe"],
    default: "COD"
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    stripePaymentIntentId: String,
    transactionId: String
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  subtotal: Number,
  taxAmount: Number,
  shippingCost: Number,
  discountApplied: Number,
  couponCode: String,
  // Payment Status
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  // Delivery Status
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
    default: "pending"
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  // Tracking
  trackingNumber: String,
  shippingCompany: String,
  trackingUpdates: [
    {
      status: String,
      timestamp: Date,
      location: String,
      description: String
    }
  ],
  // Order Notes
  notes: String,
  internalNotes: String, // Admin notes
  // Return Information
  returnRequested: {
    type: Boolean,
    default: false
  },
  returnReason: String,
  returnApprovedAt: Date
}, {
  timestamps: true
});

// Calculate total price before saving
orderSchema.pre("save", function(next) {
  if (this.orderItems && this.orderItems.length > 0) {
    const subtotal = this.orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    this.subtotal = subtotal;
    this.totalPrice = subtotal + (this.taxAmount || 0) + (this.shippingCost || 0) - (this.discountApplied || 0);
  }
  next();
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ trackingNumber: 1 });

module.exports = mongoose.model("Order", orderSchema);