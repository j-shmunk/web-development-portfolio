import { useEffect, useState } from "react";

const emptyColorway = {
  edition: "",
  colorway: "",
  tier: "Elite",
  surface: "Firm Ground",
  styleCode: "",
  status: "Listed",
  colors: "",
  sourceUrl: "",
  imageUrl: "",
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { user } = await api(`/api/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setPassword("");
      onAuthenticated(user);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">MERCURIAL ARCHIVE · VOL. 17</p>
        <h1>Speed in every color.</h1>
        <p className="muted">
          Sign in or create an account to browse and manage the Vapor 17 colorway archive.
        </p>
        <div className="auth-tabs" role="tablist" aria-label="Account options">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={!isRegister ? "active" : ""}
            onClick={() => changeMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={isRegister ? "active" : ""}
            onClick={() => changeMode("register")}
          >
            Register
          </button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={80}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={12}
              maxLength={72}
              required
            />
            {isRegister && <span className="field-hint">Use 12–72 characters (at most 72 UTF-8 bytes).</span>}
          </label>
          {error && <p className="notice error" role="alert">{error}</p>}
          <button className="button-primary" type="submit" disabled={busy}>
            {busy ? "Please wait…" : isRegister ? "Create account" : "Log in"}
          </button>
        </form>
        <p className="fine-print">
          Accounts are personal. Passwords are securely hashed and never displayed.
        </p>
      </section>
    </main>
  );
}

function ColorwayForm({ item, onSave, onCancel, error, busy }) {
  const [form, setForm] = useState(() => (
    item
      ? {
          ...emptyColorway,
          ...item,
          colors: item.colors.join(", "),
        }
      : emptyColorway
  ));

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...form,
      styleCode: form.styleCode.toUpperCase(),
      colors: form.colors.split(",").map((color) => color.trim()).filter(Boolean),
    });
  }

  return (
    <section className="panel editor" aria-labelledby="editor-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">COLORWAY RECORD</p>
          <h2 id="editor-title">{item ? "Edit colorway" : "Add a colorway"}</h2>
        </div>
        <span className="bolt" aria-hidden="true">↗</span>
      </div>
      <form className="colorway-form" onSubmit={handleSubmit}>
        <label>
          Edition
          <input name="edition" value={form.edition} onChange={handleChange} maxLength={80} placeholder="Core, United, Vini Jr." required />
        </label>
        <label>
          Official colorway name
          <input name="colorway" value={form.colorway} onChange={handleChange} maxLength={120} required />
        </label>
        <label>
          Tier
          <select name="tier" value={form.tier} onChange={handleChange}>
            <option>Elite</option>
            <option>Pro</option>
            <option>Academy</option>
            <option>Club</option>
          </select>
        </label>
        <label>
          Playing surface
          <select name="surface" value={form.surface} onChange={handleChange}>
            <option>Firm Ground</option>
            <option>Artificial Grass</option>
            <option>Multi-Ground</option>
            <option>Turf</option>
            <option>Indoor/Court</option>
          </select>
        </label>
        <label>
          Nike style code
          <input name="styleCode" value={form.styleCode} onChange={handleChange} maxLength={20} placeholder="IF8508-102" required />
        </label>
        <label>
          Catalog status
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Listed</option>
            <option>Coming soon</option>
          </select>
        </label>
        <label className="wide">
          Swatch colors (hex, comma-separated)
          <input name="colors" value={form.colors} onChange={handleChange} placeholder="#111111, #8fcf31" required />
        </label>
        <label className="wide">
          Official product page
          <input name="sourceUrl" type="url" value={form.sourceUrl} onChange={handleChange} maxLength={500} placeholder="https://www.nike.com/t/..." required />
        </label>
        <label className="wide">
          Product image URL <span className="optional">(optional)</span>
          <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} maxLength={500} placeholder="https://static.nike.com/..." />
        </label>
        {error && <p className="notice error wide" role="alert">{error}</p>}
        <div className="form-actions wide">
          <button className="button-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : item ? "Save changes" : "Add colorway"}
          </button>
          {item && <button className="button-secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button>}
        </div>
      </form>
    </section>
  );
}

function ColorwayCard({ item, onEdit, onDelete }) {
  return (
    <article className="colorway-card">
      {item.imageUrl ? (
        <img className="product-image" src={item.imageUrl} alt={`${item.edition} ${item.colorway}`} loading="lazy" />
      ) : (
        <div className="product-placeholder" aria-hidden="true">M·17</div>
      )}
      <div className="card-content">
        <div className="card-kicker">
          <span>{item.tier} · {item.surface}</span>
          <span className={`status ${item.status === "Coming soon" ? "coming" : ""}`}>{item.status}</span>
        </div>
        <p className="edition">{item.edition}</p>
        <h3>{item.colorway}</h3>
        <div className="swatches" aria-label={`Color swatches: ${item.colors.join(", ")}`}>
          {item.colors.map((color) => (
            <span className="swatch" key={color} style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
        <p className="style-code">Style code <strong>{item.styleCode}</strong></p>
        <a className="source-link" href={item.sourceUrl} target="_blank" rel="noreferrer">
          View source at Nike <span aria-hidden="true">↗</span>
        </a>
        <div className="card-actions">
          <button className="button-secondary" onClick={() => onEdit(item)}>Edit</button>
          <button className="button-danger" onClick={() => onDelete(item)}>Delete</button>
        </div>
      </div>
    </article>
  );
}

function Catalog({ user, onLogout }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  async function loadColorways(searchTerm = search) {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ search: searchTerm });
      setItems(await api(`/api/colorways?${query}`));
    } catch (loadError) {
      setError(loadError.message);
      if (loadError.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadColorways("");
  }, []);

  async function handleSave(payload) {
    setBusy(true);
    setFormError("");
    setMessage("");
    try {
      await api(editing ? `/api/colorways/${editing._id}` : "/api/colorways", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setEditing(null);
      setMessage(editing ? "Colorway updated." : "Colorway added.");
      await loadColorways();
    } catch (saveError) {
      setFormError(saveError.message);
      if (saveError.status === 401) onLogout();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete ${item.edition} — ${item.colorway}?`)) return;
    setError("");
    setMessage("");
    try {
      await api(`/api/colorways/${item._id}`, { method: "DELETE" });
      if (editing?._id === item._id) setEditing(null);
      setMessage(`${item.colorway} removed from the catalog.`);
      await loadColorways();
    } catch (deleteError) {
      setError(deleteError.message);
      if (deleteError.status === 401) onLogout();
    }
  }

  async function handleLogout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
      onLogout();
    } catch (logoutError) {
      setError(logoutError.message);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadColorways(search);
  }

  return (
    <main className="container">
      <nav className="topbar">
        <a className="brand" href="/" aria-label="Mercurial colorway catalog home">
          <span className="brand-symbol">M</span>
          <span>MERCURIAL <b>ARCHIVE</b></span>
        </a>
        <div className="account">
          <span className="member-name">{user.name}</span>
          <button className="button-secondary" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <header className="hero">
        <div>
          <p className="eyebrow">NIKE FOOTBALL · VOL. 17</p>
          <h1>Colorway archive<span>.</span></h1>
          <p className="intro">A member-managed catalog of Mercurial Vapor 17 releases.</p>
        </div>
        <div className="hero-index"><strong>{items.length.toString().padStart(2, "0")}</strong><span>COLORWAYS<br />IN VIEW</span></div>
      </header>

      <ColorwayForm
        key={editing?._id || "new"}
        item={editing}
        onSave={handleSave}
        onCancel={() => { setEditing(null); setFormError(""); }}
        error={formError}
        busy={busy}
      />

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">THE LINEUP</p>
            <h2 id="catalog-title">Mercurial Vapor 17</h2>
          </div>
          <form className="search-form" role="search" onSubmit={handleSearch}>
            <label htmlFor="search" className="sr-only">Search colorways</label>
            <input id="search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search editions, colors, style codes…" />
            <button type="submit" className="button-primary">Search</button>
            {search && <button type="button" className="button-secondary" onClick={() => { setSearch(""); loadColorways(""); }}>Clear</button>}
          </form>
        </div>
        {message && <p className="notice success" role="status">{message}</p>}
        {error && <p className="notice error" role="alert">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading the archive…</p>
        ) : items.length === 0 ? (
          <p className="empty-state">{search ? "No colorways match your search." : "The catalog is empty. Add a colorway above."}</p>
        ) : (
          <div className="colorway-grid">
            {items.map((item) => (
              <ColorwayCard key={item._id} item={item} onEdit={(selected) => { setEditing(selected); setFormError(""); }} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
      <footer className="footer">
        <p>Product names and colorway descriptions are catalog references. Nike is not affiliated with this project.</p>
        <p>Members can add, edit, or remove records after signing in.</p>
      </footer>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    api("/api/auth/session")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((error) => {
        if (error.status !== 401) setSessionError(error.message);
      })
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) return <main className="loading-page">Checking your session…</main>;
  if (sessionError) return <main className="loading-page notice error" role="alert">{sessionError}</main>;
  return user ? <Catalog user={user} onLogout={() => setUser(null)} /> : <AuthPanel onAuthenticated={setUser} />;
}

export default App;
