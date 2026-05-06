const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    res.json({
      success: true,
      products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ ADD new product (ADMIN + IMAGE)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        price,
        originalPrice,
        description,
        category,
        stock,
        tags
      } = req.body;

      // validation
      if (!name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "Name, price, and category are required"
        });
      }

      // image handling
      let imagePath = "";
      if (req.file) {
        imagePath = req.file.path;
        // For Cloudinary: imagePath = req.file.path;
      }

      const product = new Product({
        name,
        price,
        originalPrice: originalPrice || null,
        image: imagePath,
        images: imagePath ? [imagePath] : [],
        description,
        category,
        stock: stock || 0,
        tags: tags ? tags.split(",") : [],
        createdBy: req.user.userId,
        isActive: true
      });

      const savedProduct = await product.save();

      res.status(201).json({
        success: true,
        product: savedProduct
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
);

// ✅ UPLOAD image endpoint (for admin image preview)
// This must come BEFORE the /:id route to avoid matching upload as an ID
router.post("/upload", authMiddleware, adminMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided"
      });
    }

    res.json({
      success: true,
      image: req.file.path
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ UPDATE product (ADMIN)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      category,
      stock,
      tags,
      image,
      isActive
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Update fields
    if (name) product.name = name;
    if (price) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image) product.image = image;
    if (isActive !== undefined) product.isActive = isActive;
    
    if (tags) {
      product.tags = Array.isArray(tags) ? tags : tags.split(",");
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ DELETE product (ADMIN)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // We do soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    // Alternatively, hard delete:
    // await product.remove();

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;