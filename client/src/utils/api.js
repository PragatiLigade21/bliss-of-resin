/**
 * Centralized API Service
 * All API calls to backend
 */

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

/**
 * Generic fetch wrapper
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * ============================================
 * PRODUCTS API
 * ============================================
 */

export const productsAPI = {
  // Get all products with filters
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/products?${query}`);
  },

  // Get single product
  getProduct: (productId) => {
    return apiFetch(`/products/product/${productId}`);
  },

  // Get categories
  getCategories: () => {
    return apiFetch("/products/categories");
  },

  // Get related products
  getRelatedProducts: (productId) => {
    return apiFetch(`/products/related/${productId}`);
  },

  // Create product (admin)
  createProduct: (productData) => {
    return apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(productData)
    });
  },

  // Update product (admin)
  updateProduct: (productId, productData) => {
    return apiFetch(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData)
    });
  },

  // Delete product (admin)
  deleteProduct: (productId) => {
    return apiFetch(`/products/${productId}`, {
      method: "DELETE"
    });
  }
};

/**
 * ============================================
 * REVIEWS API
 * ============================================
 */

export const reviewsAPI = {
  // Get reviews for a product
  getProductReviews: (productId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/reviews/product/${productId}?${query}`);
  },

  // Add review
  addReview: (productId, reviewData) => {
    return apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify({ productId, ...reviewData })
    });
  },

  // Update review
  updateReview: (reviewId, reviewData) => {
    return apiFetch(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData)
    });
  },

  // Delete review
  deleteReview: (reviewId) => {
    return apiFetch(`/reviews/${reviewId}`, {
      method: "DELETE"
    });
  },

  // Mark review as helpful
  markHelpful: (reviewId, helpful) => {
    return apiFetch(`/reviews/${reviewId}/helpful`, {
      method: "POST",
      body: JSON.stringify({ helpful })
    });
  },

  // Approve/reject review (admin)
  updateReviewStatus: (reviewId, status) => {
    return apiFetch(`/reviews/${reviewId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
  }
};

/**
 * ============================================
 * WISHLIST API
 * ============================================
 */

export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: () => {
    return apiFetch("/wishlist");
  },

  // Add to wishlist
  addToWishlist: (productId, notes = "") => {
    return apiFetch(`/wishlist/add/${productId}`, {
      method: "POST",
      body: JSON.stringify({ notes })
    });
  },

  // Remove from wishlist
  removeFromWishlist: (productId) => {
    return apiFetch(`/wishlist/remove/${productId}`, {
      method: "DELETE"
    });
  },

  // Check if in wishlist
  checkInWishlist: (productId) => {
    return apiFetch(`/wishlist/check/${productId}`);
  },

  // Update wishlist item notes
  updateNotes: (productId, notes) => {
    return apiFetch(`/wishlist/${productId}/notes`, {
      method: "PUT",
      body: JSON.stringify({ notes })
    });
  },

  // Clear wishlist
  clearWishlist: () => {
    return apiFetch("/wishlist", {
      method: "DELETE"
    });
  }
};

/**
 * ============================================
 * ADMIN API
 * ============================================
 */

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => {
    return apiFetch("/admin/dashboard/stats");
  },

  // Get all orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/admin/orders?${query}`);
  },

  // Get order details
  getOrderDetails: (orderId) => {
    return apiFetch(`/admin/orders/${orderId}`);
  },

  // Update order status
  updateOrderStatus: (orderId, status, trackingNumber, shippingCompany) => {
    return apiFetch(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, trackingNumber, shippingCompany })
    });
  },

  // Update payment status
  updatePaymentStatus: (orderId, isPaid) => {
    return apiFetch(`/admin/orders/${orderId}/payment`, {
      method: "PUT",
      body: JSON.stringify({ isPaid })
    });
  },

  // Add notes to order
  addOrderNotes: (orderId, notes, internalNotes) => {
    return apiFetch(`/admin/orders/${orderId}/notes`, {
      method: "PUT",
      body: JSON.stringify({ notes, internalNotes })
    });
  },

  // Get all users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/admin/users?${query}`);
  },

  // Update user role
  updateUserRole: (userId, isAdmin) => {
    return apiFetch(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ isAdmin })
    });
  },

  // Deactivate user
  deactivateUser: (userId) => {
    return apiFetch(`/admin/users/${userId}/deactivate`, {
      method: "PUT"
    });
  },

  // Get products (admin view)
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/admin/products?${query}`);
  },

  // Bulk update stock
  bulkUpdateStock: (updates) => {
    return apiFetch("/admin/products/bulk/stock", {
      method: "POST",
      body: JSON.stringify({ updates })
    });
  }
};

export default {
  productsAPI,
  reviewsAPI,
  wishlistAPI,
  adminAPI
};
