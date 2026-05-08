const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: { type: String, required: true },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      zipCode: String,
      country: { type: String, default: "India" },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Razorpay", "Stripe"],
      default: "COD",
    },

    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      stripePaymentIntentId: String,
      transactionId: String,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    subtotal: Number,
    taxAmount: Number,
    shippingCost: Number,
    discountApplied: Number,
    couponCode: String,

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: Date,

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: Date,

    trackingNumber: String,
    shippingCompany: String,

    trackingUpdates: [
      {
        status: String,
        timestamp: Date,
        location: String,
        description: String,
      },
    ],

    notes: String,
    internalNotes: String,

    returnRequested: {
      type: Boolean,
      default: false,
    },

    returnReason: String,
    returnApprovedAt: Date,
  },
  {
    timestamps: true,
  }
);

// ✅ Calculate total price before saving
// ✅ Fixed: removed next() because it caused "next is not a function"
orderSchema.pre("save", function () {
  if (this.orderItems && this.orderItems.length > 0) {
    const subtotal = this.orderItems.reduce((total, item) => {
      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 0;
      return total + itemPrice * itemQty;
    }, 0);

    this.subtotal = subtotal;

    const tax = Number(this.taxAmount) || 0;
    const shipping = Number(this.shippingCost) || 0;
    const discount = Number(this.discountApplied) || 0;

    this.totalPrice = subtotal + tax + shipping - discount;

    console.log(
      `📊 Order pre-save calc: subtotal=${subtotal}, tax=${tax}, shipping=${shipping}, total=${this.totalPrice}`
    );
  }
});

// Index for efficient queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ trackingNumber: 1 });

module.exports = mongoose.model("Order", orderSchema);