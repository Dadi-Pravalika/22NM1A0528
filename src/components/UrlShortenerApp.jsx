import React, { useState } from "react";

// Simple student-style URL shortener (client-side only)
// Features: login (fake), create up to 5 links, default 30 min expiry, optional custom code

function ShortenerApp() {
  const [user, setUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [rows, setRows] = useState([{ url: "", minutes: "", code: "" }]);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  function login(name) {
    if (!name.trim()) {
      setError("Enter username");
      return;
    }
    setUser(name);
    setLoggedIn(true);
    setError("");
  }

  function addRow() {
    if (rows.length >= 5) return;
    setRows([...rows, { url: "", minutes: "", code: "" }]);
  }

  function updateRow(i, field, val) {
    const copy = [...rows];
    copy[i][field] = val;
    setRows(copy);
  }

  function removeRow(i) {
    setRows(rows.filter((_, idx) => idx !== i));
  }

  function makeShort() {
    if (!loggedIn) {
      setError("Login required");
      return;
    }

    const newLinks = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.url.startsWith("http")) {
        setError("Row " + (i + 1) + ": Invalid URL");
        return;
      }

      let mins = parseInt(r.minutes);
      if (!mins) mins = 30;

      let code = r.code.trim() || Math.random().toString(36).substring(2, 8);
      if (links.some((l) => l.code === code)) {
        setError("Row " + (i + 1) + ": Code already taken");
        return;
      }

      const expiry = new Date(Date.now() + mins * 60000);
      newLinks.push({ ...r, code, expiry: expiry.toLocaleString(), clicks: 0 });
    }

    setLinks([...links, ...newLinks]);
    setRows([{ url: "", minutes: "", code: "" }]);
    setError("");
  }

  function openLink(code) {
    const copy = links.map((l) => {
      if (l.code === code) {
        l.clicks += 1;
        window.open(l.url, "_blank");
      }
      return l;
    });
    setLinks(copy);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>URL Shortener</h2>
      {!loggedIn ? (
        <div>
          <input placeholder="Username" onChange={(e) => setUser(e.target.value)} />
          <button onClick={() => login(user)}>Login</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user}</p>
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        </div>
      )}

      <hr />

      {rows.map((r, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <input
            placeholder="Long URL"
            value={r.url}
            onChange={(e) => updateRow(i, "url", e.target.value)}
          />
          <input
            placeholder="Minutes"
            value={r.minutes}
            onChange={(e) => updateRow(i, "minutes", e.target.value)}
            style={{ width: 70, marginLeft: 5 }}
          />
          <input
            placeholder="Custom code"
            value={r.code}
            onChange={(e) => updateRow(i, "code", e.target.value)}
            style={{ marginLeft: 5 }}
          />
          {rows.length > 1 && <button onClick={() => removeRow(i)}>x</button>}
        </div>
      ))}

      <button onClick={addRow}>+ Add</button>
      <button onClick={makeShort} style={{ marginLeft: 5 }}>Create</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>My Links</h3>
      <ul>
        {links.map((l, i) => (
          <li key={i}>
            <b>{l.code}</b> → {l.url} (expires {l.expiry})
            <button onClick={() => openLink(l.code)} style={{ marginLeft: 5 }}>Open</button>
            <span style={{ marginLeft: 5 }}>Clicks: {l.clicks}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShortenerApp;