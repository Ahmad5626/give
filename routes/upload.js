const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary config
cloudinary.config({
  cloud_name: 'dr267iyg8',
  api_key: '812936637535539',
  api_secret: '-wx8V80JGBli6lDdHNgVKNqJ-KY'
});

// Storage engine
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'giveummah',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    fileUrl: req.file.path, // Cloudinary URL
  });
});


module.exports = router;