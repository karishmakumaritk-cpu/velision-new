import React from "react";

function Services() {
  return (
    <section className="section alt">
      <div className="container">
        <h2>Our Services</h2>
        <p style={{ color: "var(--muted)" }}>
          Comprehensive services tailored for enterprise HR operations.
        </p>
        <div className="features" style={{ marginTop: 20 }}>
          <div className="card">
            <h3>Consulting</h3>
            <p>Strategic HR transformation and implementation guidance.</p>
          </div>
          <div className="card">
            <h3>Development</h3>
            <p>Custom integrations and automation to streamline processes.</p>
          </div>
          <div className="card">
            <h3>Support</h3>
            <p>Ongoing support and SLAs to keep operations running smoothly.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
