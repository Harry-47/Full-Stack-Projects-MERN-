const multer = require('multer');
const path = require('path');

// 1. Storage Engine Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Unique name: 'task-123456789-myFile.pdf'
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'task-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. File Filter (Security Guard)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); 
  } else {
    cb(new Error('Only Images and PDFs are allowed!'), false); 
  }
};

// 3. Export Multer Object
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Limit
  fileFilter: fileFilter
});

module.exports = upload;