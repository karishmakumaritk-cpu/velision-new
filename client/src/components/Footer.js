import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div className="brand" style={{ color: "#fff" }}>
            Velision
          </div>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/about">About</a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>

        <p style={{ marginTop: 8 }}>
          &copy; {new Date().getFullYear()} Velision. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
