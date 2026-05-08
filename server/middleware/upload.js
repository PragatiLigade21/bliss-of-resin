/**
 * Multer Upload Middleware (Cloudinary)
 */

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Cloudinary storage
// Important: Do NOT use allowed_formats here because it can cause Invalid Signature error
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileName = file.originalname
      .split(".")[0]
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");

    return {
      folder: "resin-products",
      resource_type: "image",
      public_id: `${Date.now()}-${fileName}`,
    };
  },
});

// ✅ File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and WEBP image files are allowed"), false);
  }
};

// ✅ Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;