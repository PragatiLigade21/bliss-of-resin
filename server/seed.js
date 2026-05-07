/**
 * Seed Script for Products
 * Run: node seed.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  description: { type: String, maxlength: 1000 },
  image: { type: String, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  subcategory: { type: String, default: null },
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  tags: [String],
  sku: { type: String },
  dimensions: {
    width: { type: String, default: null },
    height: { type: String, default: null },
    depth: { type: String, default: null }
  },
  weight: String,
  material: String,
  color: String,
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

const products = [
  {
    name: "Ocean Blue Resin Tray",
    price: 1200,
    originalPrice: 1500,
    image: "https://images.unsplash.com/photo-1532368946481-86c4303674ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UmVzaW4lMjBUcmF5fGVufDB8fDB8fHww",
    description: "Beautiful ocean blue resin tray with wave patterns, perfect for serving or decoration",
    category: "Resin Trays",
    stock: 15,
    rating: 4.5,
    numReviews: 12,
    material: "Resin",
    color: "Blue"
  },
  {
    name: "Sunset Orange Tray",
    price: 1100,
    originalPrice: 1400,
    image: "https://images.unsplash.com/photo-1630628123261-72dd7c75bc02?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Djpg",
    description: "Vibrant sunset orange resin tray with flowing designs",
    category: "Resin Trays",
    stock: 22,
    rating: 4.2,
    numReviews: 8,
    material: "Resin",
    color: "Orange"
  },
  {
    name: "Forest Green Serving Tray",
    price: 1350,
    originalPrice: 1600,
    image: "/images/sunset orange.jpg",
    description: "Elegant forest green resin tray with leaf motifs",
    category: "Resin Trays",
    stock: 18,
    rating: 4.7,
    numReviews: 15,
    material: "Resin",
    color: "Green"
  },
  {
    name: "Purple Galaxy Tray",
    price: 1500,
    originalPrice: 1800,
    image: "/images/tray.jpg",
    description: "Mesmerizing purple galaxy resin tray with cosmic patterns",
    category: "Resin Trays",
    stock: 12,
    rating: 4.8,
    numReviews: 20,
    material: "Resin",
    color: "Purple"
  },
  {
    name: "Rose Gold Tray",
    price: 1400,
    originalPrice: 1700,
    image: "/images/tray.jpg",
    description: "Luxurious rose gold resin tray with metallic finish",
    category: "Resin Trays",
    stock: 20,
    rating: 4.6,
    numReviews: 10,
    material: "Resin",
    color: "Rose Gold"
  },
  {
    name: "Crystal Clear Jewelry Box",
    price: 2500,
    originalPrice: 3000,
    image: "/images/table.jpg",
    description: "Handcrafted crystal clear resin jewelry box with compartments",
    category: "Home Decor",
    stock: 8,
    rating: 4.9,
    numReviews: 25,
    material: "Resin",
    color: "Clear"
  },
  {
    name: "Marble Effect Coasters Set",
    price: 800,
    originalPrice: 1000,
    image: "/images/coaster.jpg",
    description: "Set of 4 marble effect resin coasters",
    category: "Home Decor",
    stock: 35,
    rating: 4.4,
    numReviews: 18,
    material: "Resin",
    color: "White"
  },
  {
    name: "Epoxy River Table Coaster",
    price: 650,
    image: "/images/coaster.jpg",
    description: "Unique river table style coaster with wood and resin",
    category: "Home Decor",
    stock: 40,
    rating: 4.3,
    numReviews: 14,
    material: "Resin + Wood",
    color: "Brown"
  },
  {
    name: "Resin Earrings - Teal Drops",
    price: 450,
    originalPrice: 550,
    image: "/images/tray.jpg",
    description: "Beautiful teal drop earrings handcrafted with resin",
    category: "Jewelry",
    stock: 25,
    rating: 4.7,
    numReviews: 30,
    material: "Resin",
    color: "Teal"
  },
  {
    name: "Resin Necklace - Ocean Pendant",
    price: 850,
    originalPrice: 1000,
    image: "/images/tray.jpg",
    description: "Stunning ocean themed pendant necklace with blue resin",
    category: "Jewelry",
    stock: 15,
    rating: 4.8,
    numReviews: 22,
    material: "Resin",
    color: "Blue"
  },
  {
    name: "Resin Bracelet - Galaxy Swirl",
    price: 350,
    image: "/images/tray.jpg",
    description: "Galaxy swirl resin bracelet with glitter accents",
    category: "Jewelry",
    stock: 30,
    rating: 4.5,
    numReviews: 16,
    material: "Resin",
    color: "Purple"
  },
  {
    name: "Resin Keychain - Custom Shape",
    price: 200,
    image: "/images/tray.jpg",
    description: "Custom shaped resin keychain with your choice of colors",
    category: "Accessories",
    stock: 50,
    rating: 4.2,
    numReviews: 10,
    material: "Resin",
    color: "Mixed"
  },
  {
    name: "Geometric Resin Wall Art",
    price: 3500,
    originalPrice: 4200,
    image: "/images/table.jpg",
    description: "Stunning geometric resin wall art piece",
    category: "Resin Art",
    stock: 5,
    rating: 4.9,
    numReviews: 8,
    material: "Resin",
    color: "Multi"
  },
  {
    name: "Abstract Flow Resin Art",
    price: 2800,
    image: "/images/table.jpg",
    description: "Beautiful abstract flowing resin art with gold flakes",
    category: "Resin Art",
    stock: 7,
    rating: 4.6,
    numReviews: 12,
    material: "Resin",
    color: "Gold"
  },
  {
    name: "Resin Phone Stand",
    price: 550,
    image: "/images/table.jpg",
    description: "Artistic resin phone stand for desk decor",
    category: "Home Decor",
    stock: 28,
    rating: 4.4,
    numReviews: 9,
    material: "Resin",
    color: "Clear"
  },
  {
    name: "Pet Memorial Resin Art",
    price: 4500,
    originalPrice: 5000,
    image: "/images/table.jpg",
    description: "Custom pet memorial with paw print preserved in resin",
    category: "Resin Art",
    stock: 3,
    rating: 5.0,
    numReviews: 5,
    material: "Resin",
    color: "Custom"
  },
  {
    name: "Resin Candle Holder Set",
    price: 900,
    originalPrice: 1100,
    image: "/images/coaster.jpg",
    description: "Set of 3 decorative resin candle holders",
    category: "Home Decor",
    stock: 20,
    rating: 4.5,
    numReviews: 18,
    material: "Resin",
    color: "Amber"
  },
  {
    name: "Resin Bookmark - Floral",
    price: 150,
    image: "/images/tray.jpg",
    description: "Handmade floral design resin bookmark",
    category: "Accessories",
    stock: 45,
    rating: 4.1,
    numReviews: 7,
    material: "Resin",
    color: "Pink"
  },
  {
    name: "Resin Cutting Board - Custom",
    price: 1800,
    originalPrice: 2200,
    image: "/images/table.jpg",
    description: "Food-safe resin cutting board with custom design",
    category: "Home Decor",
    stock: 10,
    rating: 4.7,
    numReviews: 14,
    material: "Food-safe Resin",
    color: "Custom"
  },
  {
    name: "Resin Clock - Modern Design",
    price: 2200,
    image: "/images/table.jpg",
    description: "Modern design resin wall clock with silent movement",
    category: "Home Decor",
    stock: 12,
    rating: 4.6,
    numReviews: 11,
    material: "Resin",
    color: "Black"
  }
];

async function seed() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://vYdu40mfTLO7tRCg:vYdu40mfTLO7tRCg@cluster0.bzayyoq.mongodb.net/bliss-of-resin?retryWrites=true&w=majority";
    
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Old products cleared");

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products seeded successfully`);

    // Verify
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seed();