const multer = require("multer");
const path = require("path");

// Storage engine
const fs = require("fs");
const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Optional file type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  const mime = allowedTypes.test(ext);
  if (mime) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf, .doc, .docx, and .txt files are allowed"));
  }
};

// Final exportable multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = upload;
