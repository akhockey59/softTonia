import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import AddEditProduct from './components/AddEditProduct';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/">E-Commerce</Link>
          </div>
          <div className="navbar-links">
            <Link to="/">Products</Link>
            <Link to="/add-product">Add Product</Link>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/add-product" element={<AddEditProduct />} />
            <Route path="/edit-product/:id" element={<AddEditProduct />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;