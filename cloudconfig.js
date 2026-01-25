// cloudconfig.js for multer-storage-cloudinary v2
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage || require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Cloudinary storage (v2 syntax)
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "wanderlust_DEV",
  allowedFormats: ["jpg", "jpeg", "png"],
});

// Multer instance
const upload = multer({ storage });

module.exports = { cloudinary, upload };
