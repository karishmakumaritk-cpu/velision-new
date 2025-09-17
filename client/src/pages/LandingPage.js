import React, { useEffect, useState } from "react";
import { getUsers, createUser } from "../api";

function LandingPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    getUsers()
      .then(data => { if (mounted) setUsers(data); })
      .catch(err => { if (mounted) setError(err.message); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    try {
      const user = await createUser({ name, email });
      setUsers(prev => [user, ...prev]);
      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Enterprise HR & Payroll. Simplified.</h1>
            <p>One platform to manage hiring, payroll, compliance, documentation and rewards — built for growing organizations.</p>
            <div style={{display:'flex',gap:12}}>
              <a href="#contact" className="btn-cta">Request Demo</a>
              <a href="/services" style={{alignSelf:'center', color:'#0b5ed7', fontWeight:600}}>Explore Services</a>
            </div>
          </div>
          <div className="hero-illustration" aria-hidden>
            {/* simple placeholder illustration area; replace with SVG/image as needed */}
            <div style={{width:'80%',height:160,background:'linear-gradient(90deg,#eef7ff,#ffffff)',borderRadius:8}}></div>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 style={{marginBottom:8}}>Why Velision</h2>
        <p style={{color:'var(--muted)'}}>Practical HR tools, automated payroll and compliance — designed to scale with your business.</p>

        <div className="features" style={{marginTop:20}}>
          <div className="card">
            <h3>Unified HR</h3>
            <p>Centralize employee records, recruitment and onboarding with secure workflows.</p>
          </div>
          <div className="card">
            <h3>Payroll & Statutory</h3>
            <p>Accurate payroll runs, PF calculations and statutory compliance automation.</p>
          </div>
          <div className="card">
            <h3>Reporting & Insights</h3>
            <p>Dashboards and exportable reports to help HR make data-driven decisions.</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Users</h2>
        {loading && <p>Loading users…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            <form onSubmit={onAdd} style={{ marginBottom: 12 }}>
              <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
              <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit">Add</button>
            </form>
            <ul>
              {users.length === 0 && <li>No users</li>}
              {users.map(u => (
                <li key={u._id || u.email}>{u.name} — {u.email}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default LandingPage;
