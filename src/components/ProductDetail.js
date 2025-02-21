import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${id}`);
        console.log('Product data:', response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    getProductDetails();
  }, [id]); // Only depend on id parameter

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-images">
          {product.images && product.images.map((image, index) => (
            <div key={index} className="product-image-container">
              <img 
                src={image} 
                alt={`${product.name} view ${index + 1}`}
                className="product-image"
              />
            </div>
          ))}
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          
          <div className="product-options">
            <div className="option-group">
              <label>Color:</label>
              <select 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Select Color</option>
                {product.variants?.colors?.map((color, index) => (
                  <option key={index} value={color.name}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label>Size:</label>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">Select Size</option>
                {product.variants?.sizes?.map((size, index) => (
                  <option key={index} value={size.name}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="price-section">
            <p className="price">Price: ${product.basePrice}</p>
            {product.discount && (
              <span className="discount-badge">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="product-actions">
            <button 
              className="edit-button"
              onClick={() => navigate(`/edit-product/${id}`)}
            >
              Edit Product
            </button>
            <button className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;