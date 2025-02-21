const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');
const cloudinary = require('../config/cloudinary');

// Routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', upload.array('images', 5), productController.createProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Add this route to test Cloudinary configuration
router.get('/test-cloudinary', (req, res) => {
  try {
    const config = cloudinary.config();
    res.json({
      message: 'Cloudinary configured successfully',
      cloud_name: config.cloud_name
    });
  } catch (error) {
    res.status(500).json({
      message: 'Cloudinary configuration error',
      error: error.message
    });
  }
});

module.exports = router; 