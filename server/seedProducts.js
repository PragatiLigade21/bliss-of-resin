const mongoose = require("mongoose");
const products = require("./sample-products.json");

const Product = mongoose.model("Product", {
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  rating: Number,
  stock: Number,
});

async function seed() {
  try {
    // ✅ WAIT FOR CONNECTION
    await mongoose.connect("mongodb+srv://vYdu40mfTLO7tRCg:vYdu40mfTLO7tRCg@cluster0.bzayyoq.mongodb.net/bliss-of-resin?retryWrites=true&w=majority");

    console.log("✅ MongoDB Connected");

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products added successfully");

    process.exit();
  } catch (err) {
    console.log("❌ Error:", err);
    process.exit(1);
  }
}

seed();