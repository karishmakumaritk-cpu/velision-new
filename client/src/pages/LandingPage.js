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
    <div className="hero">
      <h1>Welcome to Velision</h1>
      <p>Professional solutions for your business</p>

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
    </div>
  );
}

export default LandingPage;
