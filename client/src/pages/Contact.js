import React from "react";

function Contact() {
  return (
    <section className="section alt" id="contact">
      <div className="container">
        <h2>Contact Us</h2>
        <p style={{ color: "var(--muted)" }}>
          Get in touch for product demos, pricing or support.
        </p>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div className="card" style={{ flex: "1 1 320px" }}>
            <h3>Email</h3>
            <p>info@velision.in</p>
          </div>
          <div className="card" style={{ flex: "1 1 320px" }}>
            <h3>Phone</h3>
            <p>+91-1234567890</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
