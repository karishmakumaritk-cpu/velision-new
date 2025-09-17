import React from "react";

function About() {
  return (
    <section className="section">
      <div className="container">
        <h2>About Velision</h2>
        <p style={{ color: "var(--muted)" }}>
          We are a team of HR and payroll experts building software to simplify
          people operations.
        </p>
        <div
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          <div className="card">
            <h3>Mission</h3>
            <p>
              To make HR systems accessible and reliable for every organization.
            </p>
          </div>
          <div className="card">
            <h3>Vision</h3>
            <p>Trusted, integrated HR tools powering modern workplaces.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
