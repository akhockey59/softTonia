const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
    return new Promise((resolve, reject) => {
      const writeStream = cloudinary.uploader.upload_stream(
        {
          folder: "e-commerce",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      );

      const readStream = Readable.from(buffer);
      readStream.pipe(writeStream);
    });
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    console.log('Starting product creation...');
    const imageUrls = [];
    
    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      console.log(`Uploading ${req.files.length} images...`);
      
      for (const file of req.files) {
        try {
          console.log(`Uploading image: ${file.originalname}`);
          const imageUrl = await uploadToCloudinary(file.buffer);
          console.log('Image uploaded successfully:', imageUrl);
          imageUrls.push(imageUrl);
        } catch (uploadError) {
          console.error('Individual image upload error:', uploadError);
          throw new Error(`Failed to upload image: ${file.originalname}`);
        }
      }
    }

    // Parse variants
    let variants = {};
    try {
      variants = req.body.variants ? JSON.parse(req.body.variants) : {};
    } catch (error) {
      console.error('Error parsing variants:', error);
      variants = { colors: [], sizes: [] };
    }

    // Create product document
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      basePrice: Number(req.body.basePrice),
      images: imageUrls,
      variants: variants,
      discount: req.body.discount
    });

    // Save to database
    const newProduct = await product.save();
    console.log('Product saved successfully:', newProduct);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(400).json({ 
      message: 'Failed to create product',
      error: error.message 
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updates = {
      name: req.body.name,
      description: req.body.description,
      basePrice: req.body.basePrice,
      variants: JSON.parse(req.body.variants || '{}'),
      discount: req.body.discount
    };

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
      }
      updates.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete images from Cloudinary
    // Note: You'll need to extract the public_id from the URL to delete
    // For now, we're just deleting from database
    
    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 