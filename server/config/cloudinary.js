const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Validate environment variables
const requiredEnvVars = ["CLOUD_NAME", "API_KEY", "API_SECRET"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`❌ Cloudinary Error: Missing environment variables: ${missingEnvVars.join(", ")}`);
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Verify Cloudinary connection
cloudinary.api.ping()
  .then(result => console.log("✅ Cloudinary Connection: Successful"))
  .catch(err => {
    console.error("❌ Cloudinary Connection Error:", err.message);
    console.error("Credentials Check:", {
      cloud_name: process.env.CLOUD_NAME ? "Present" : "Missing",
      api_key: process.env.API_KEY ? "Present" : "Missing",
      api_secret: process.env.API_SECRET ? "Present" : "Missing"
    });
  });

module.exports = cloudinary;