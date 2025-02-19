import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">VIP-SMUR-PEI</div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Main</Link>
        <Link to="/city-compare" className="navbar-link">City Compare</Link>
      </div>
    </nav>
  );
};

export default Navbar;
