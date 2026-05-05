/**
 * Authentication Middleware
 * Handles JWT verification and admin authorization
 */

const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect middleware - verifies JWT token
 * Usage: router.get("/", protect, handler)
 */
const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: "No token provided. Authorization denied." 
    });
  }

  // Check if token starts with "Bearer "
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid token format. Use: Bearer <token>" 
    });
  }

  // Extract token (remove "Bearer " prefix)
  token = authHeader.substring(7);

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Get user from database (exclude password)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found. Token may be invalid." 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: "Account is deactivated. Contact support." 
      });
    }

    // Attach user to request
    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || (user.isAdmin ? "admin" : "user"),
      isAdmin: user.isAdmin
    };

    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token has expired. Please login again." 
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token. Please login again." 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Server error in authentication." 
    });
  }
};

/**
 * Admin middleware - checks if user is admin
 * Usage: router.post("/", protect, admin, handler)
 * Note: Must be used AFTER protect middleware
 */
const admin = (req, res, next) => {
  // Check if user exists (should be set by protect middleware)
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required. Please login." 
    });
  }

  // Check if user is admin
  const userRole = req.user.role || (req.user.isAdmin ? "admin" : "user");
  
  if (userRole !== "admin" && !req.user.isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied. Admin privileges required." 
    });
  }

  next();
};

module.exports = { protect, admin };