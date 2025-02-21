import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-brand">
        <Link to="/">E-Commerce</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/add-product">Add Product</Link>
      </div>
    </motion.nav>
  );
};

export default Navbar; 