const multer = require('multer');
const path = require('path');

// 1. Storage Configuration

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ye folder root directory mein hona chahiye (jahan server.js hai)
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // Unique file name banega (e.g., 16788889999-myvideo.mp4)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// 2. File Filter (Validation)
// Sirf images aur videos accept karega
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// 3. Multer Instance (Final Export)
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB limit for local server (thora barha dia)
  }
});

module.exports = upload;