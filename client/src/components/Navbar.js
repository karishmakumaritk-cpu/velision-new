import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          <span className="logo" aria-hidden />
          Velision
        </Link>

        <ul className="nav-links" role="menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div>
          <Link to="/contact" className="btn-cta">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
