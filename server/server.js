const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images with options
const imagesPath = path.join(__dirname, "images");
console.log(`📁 Serving images from: ${imagesPath}`);
app.use("/images", express.static(imagesPath, {
  maxAge: "1d",
  etag: false
}));

// Debug route to test images
app.get("/test-image/:filename", (req, res) => {
  const imagePath = path.join(__dirname, "images", req.params.filename);
  console.log(`Requested: ${imagePath}`);
  console.log(`Exists: ${fs.existsSync(imagePath)}`);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: "File not found", path: imagePath });
  }
});

// Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authMiddleware = require("./middleware/authMiddleware");

// Mount routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", authMiddleware, orderRoutes); // Protected orders route
app.use("/api/reviews", reviewRoutes); // Reviews routes
app.use("/api/wishlist", wishlistRoutes); // Wishlist routes
app.use("/api/admin", authMiddleware, adminRoutes); // Admin routes (auth required, admin check inside)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then((conn) => {
  console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
})
.catch((err) => console.log("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.send("Bliss of Resin API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});