const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    let authHeader = req.header("Authorization");
    
    // Fallback to "authorization" header (some clients use lowercase)
    if (!authHeader) {
      authHeader = req.header("authorization");
    }

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Check if token starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Extract token
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Fetch user from database to get latest role and isAdmin status
    const user = await User.findById(decoded.userId).select("role isAdmin");
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user info to request (including role for admin check)
    req.user = {
      _id: user._id, // Add _id for compatibility
      userId: decoded.userId,
      role: user.role || "user",
      isAdmin: user.isAdmin || user.role === "admin"
    };
    
    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", error: "Unauthorized" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token", error: "Unauthorized" });
    }

    res.status(500).json({ message: "Server error in authentication", error: "Internal Server Error" });
  }
};

module.exports = authMiddleware;