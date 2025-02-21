import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await axios.get('http://localhost:5001/api/products');
      console.log('Products received:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setLoading(false);
    }
  };

  console.log('Current products state:', products); // Debug log
  console.log('Loading state:', loading); // Debug log
  console.log('Error state:', error); // Debug log

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Debug check for products array
  if (!Array.isArray(products)) {
    console.error('Products is not an array:', products);
    return (
      <div className="error-container">
        <p>Error: Invalid data format</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2 className="product-title">Products ({products.length})</h2>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No products available</h3>
          <p>Start by adding your first product!</p>
          <Link to="/add-product" className="add-product-button">
            Add New Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => {
            console.log('Rendering product:', product); // Debug log
            return (
              <div key={product._id} className="product-card">
                <div className="product-images">
                  {product.images && product.images.length > 0 ? (
                    <div className="product-image-container">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          console.error('Image failed to load:', product.images[0]);
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="no-image">No image available</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="price">${product.basePrice}</p>
                  {product.discount && (
                    <div className="discount-badge">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="product-actions">
                  <Link to={`/product/${product._id}`} className="action-button">
                    View Details
                  </Link>
                  <Link to={`/edit-product/${product._id}`} className="action-button edit">
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="add-product-container">
        <Link to="/add-product" className="add-product-button">
          Add New Product
        </Link>
      </div>
    </div>
  );
};

export default ProductList; 