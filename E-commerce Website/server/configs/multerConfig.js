
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary  = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary,
  params: () => {
    return {
      folder: 'products',
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
