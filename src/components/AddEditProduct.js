import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    basePrice: '',
    variants: {
      colors: [],
      sizes: []
    },
    discount: ''
  });

  const [newVariant, setNewVariant] = useState({
    type: 'colors',
    name: '',
    priceModifier: 0
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (id) {
      const getProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/products/${id}`);
          setProduct(response.data);
          setImagePreviews(response.data.images);
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('Failed to fetch product');
        }
      };

      getProduct();
    }
  }, [id]);

  const handleAddVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        [newVariant.type]: [
          ...prev.variants[newVariant.type],
          { name: newVariant.name, priceModifier: Number(newVariant.priceModifier) }
        ]
      }
    }));
    setNewVariant({ type: 'colors', name: '', priceModifier: 0 });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    
    // Clear previous previews
    setImagePreviews([]);
    
    // Generate new previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('basePrice', product.basePrice);
      formData.append('variants', JSON.stringify(product.variants));
      formData.append('discount', product.discount);

      // Append each image to formData
      images.forEach(image => {
        formData.append('images', image);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false
      };

      const response = await axios.post(
        'http://localhost:5001/api/products',
        formData,
        config
      );

      console.log('Product saved:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="add-edit-product"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({...product, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Base Price</label>
          <input
            type="number"
            value={product.basePrice}
            onChange={(e) => setProduct({...product, basePrice: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Discount (%)</label>
          <input
            type="text"
            value={product.discount}
            onChange={(e) => setProduct({...product, discount: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="image-preview">
                <img src={preview} alt={`Preview ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="variant-section">
          <h3>Add Variants</h3>
          <div className="variant-form">
            <select
              value={newVariant.type}
              onChange={(e) => setNewVariant({...newVariant, type: e.target.value})}
            >
              <option value="colors">Color</option>
              <option value="sizes">Size</option>
            </select>
            <input
              type="text"
              placeholder="Variant name"
              value={newVariant.name}
              onChange={(e) => setNewVariant({...newVariant, name: e.target.value})}
            />
            <input
              type="number"
              placeholder="Price modifier"
              value={newVariant.priceModifier}
              onChange={(e) => setNewVariant({...newVariant, priceModifier: e.target.value})}
            />
            <button type="button" onClick={handleAddVariant}>Add Variant</button>
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : (id ? 'Update Product' : 'Add Product')}
        </button>
      </form>
    </motion.div>
  );
};

export default AddEditProduct; 