const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET is not defined in .env. Using fallback for development.");
  }
  
  try {
    const payload = { userId: userId.toString() };
    return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d"
    });
  } catch (error) {
    console.error("❌ JWT Signing Error:", error);
    throw new Error("Failed to generate authentication token");
  }
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(`🔄 Registration attempt for: ${email}`);
    
    // Check DB Connection state
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ Database not connected. State:", mongoose.connection.readyState);
      return res.status(503).json({ 
        success: false, 
        message: "Database connection is currently unavailable. Please try again later." 
      });
    }

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide all required fields (name, email, password)" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.warn(`⚠️ Registration failed: User already exists (${email})`);
      return res.status(400).json({ 
        success: false,
        message: "An account with this email already exists" 
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    console.log(`✅ User registered successfully: ${user.email}`);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        isAdmin: user.isAdmin || false
      },
      token
    });

  } catch (error) {
    console.error("❌ Registration error details:", error);
    
    // Handle MongoDB duplicate key error (if findOne check fails due to race condition)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "An account with this email already exists" 
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(", ") 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Server error during registration",
      error: error.message 
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log(`✅ User logged in: ${user.email}`);
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || (user.isAdmin ? "admin" : "user"),
        isAdmin: user.isAdmin
      },
      token
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// GET PROFILE (Protected route)
router.get("/profile", async (req, res) => {
  try {
    // This will be protected by auth middleware
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;