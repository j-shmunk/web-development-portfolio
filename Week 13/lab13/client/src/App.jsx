import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  scientificName: "",
  description: "",
  sunlight: "",
  soil: "",
  water: "",
  height: "",
  bloomSeason: "",
  nativeRange: "",
  wildlifeBenefits: "",
  image: "",
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

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { user } = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setPassword("");
      onLogin(user);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="eyebrow">NATIVE PLANT CATALOG</p>
        <span className="brand-mark" aria-hidden="true">✳</span>
        <h1>Administrator sign in</h1>
        <p className="muted">Sign in to manage plant records.</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              autoComplete="username"
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
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              maxLength={128}
              required
            />
          </label>
          {error && <p className="notice error" role="alert">{error}</p>}
          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="login-note">Administrator accounts are provisioned by the site owner.</p>
      </section>
    </main>
  );
}

function PlantForm({ plant, onSave, onCancel, busy, error }) {
  const [formData, setFormData] = useState(() => (
    plant
      ? {
          ...emptyForm,
          ...plant,
          height: plant.height ?? "",
          wildlifeBenefits: (plant.wildlifeBenefits || []).join(", "),
          image: plant.image || "",
        }
      : emptyForm
  ));

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...formData,
      height: formData.height === "" ? null : Number(formData.height),
      wildlifeBenefits: formData.wildlifeBenefits
        .split(",")
        .map((benefit) => benefit.trim())
        .filter(Boolean),
    });
  }

  return (
    <section className="panel editor" aria-labelledby="form-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PLANT RECORD</p>
          <h2 id="form-title">{plant ? "Edit plant" : "Add a plant"}</h2>
        </div>
        <span className="leaf-mark" aria-hidden="true">✳</span>
      </div>
      <form className="plant-form" onSubmit={handleSubmit}>
        <label>
          Common name
          <input name="name" value={formData.name} onChange={handleChange} maxLength={100} required />
        </label>
        <label>
          Scientific name
          <input name="scientificName" value={formData.scientificName} onChange={handleChange} maxLength={120} required />
        </label>
        <label className="wide">
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} rows="2" maxLength={1000} required />
        </label>
        <label>
          Sunlight
          <input name="sunlight" value={formData.sunlight} onChange={handleChange} maxLength={100} required />
        </label>
        <label>
          Soil
          <input name="soil" value={formData.soil} onChange={handleChange} maxLength={100} required />
        </label>
        <label>
          Water needs
          <input name="water" value={formData.water} onChange={handleChange} maxLength={100} required />
        </label>
        <label>
          Height (inches)
          <input name="height" type="number" min="0" max="3000" step="1" value={formData.height} onChange={handleChange} />
        </label>
        <label>
          Bloom season
          <input name="bloomSeason" value={formData.bloomSeason} onChange={handleChange} maxLength={60} required />
        </label>
        <label>
          Native range
          <input name="nativeRange" value={formData.nativeRange} onChange={handleChange} maxLength={200} required />
        </label>
        <label className="wide">
          Wildlife benefits
          <input
            name="wildlifeBenefits"
            value={formData.wildlifeBenefits}
            onChange={handleChange}
            placeholder="Separate benefits with commas"
          />
        </label>
        <label className="wide">
          Image URL <span className="optional">(optional)</span>
          <input name="image" type="url" value={formData.image} onChange={handleChange} maxLength={500} placeholder="https://example.com/plant.jpg" />
        </label>
        {error && <p className="notice error wide" role="alert">{error}</p>}
        <div className="form-actions wide">
          <button type="submit" className="button-primary" disabled={busy}>
            {busy ? "Saving…" : plant ? "Save changes" : "Add to catalog"}
          </button>
          {plant && (
            <button type="button" className="button-secondary" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function Admin({ user, onLogout }) {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [editingPlant, setEditingPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  async function loadPlants(searchTerm = search) {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ search: searchTerm });
      setPlants(await api(`/api/plants?${query}`));
    } catch (loadError) {
      setError(loadError.message);
      if (loadError.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlants("");
  }, []);

  async function handleSave(payload) {
    setBusy(true);
    setFormError("");
    setError("");
    setMessage("");
    try {
      await api(
        editingPlant ? `/api/plants/${editingPlant._id}` : "/api/plants",
        {
          method: editingPlant ? "PUT" : "POST",
          body: JSON.stringify(payload),
        },
      );
      setEditingPlant(null);
      setMessage(editingPlant ? "Plant record updated." : "Plant added to the catalog.");
      await loadPlants();
    } catch (saveError) {
      setFormError(saveError.message);
      if (saveError.status === 401) onLogout();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(plant) {
    if (!window.confirm(`Delete ${plant.name}? This cannot be undone.`)) return;
    setError("");
    setMessage("");
    try {
      await api(`/api/plants/${plant._id}`, { method: "DELETE" });
      if (editingPlant?._id === plant._id) setEditingPlant(null);
      setMessage(`${plant.name} was deleted.`);
      await loadPlants();
    } catch (deleteError) {
      setError(deleteError.message);
      if (deleteError.status === 401) onLogout();
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadPlants(search);
  }

  async function handleLogout() {
    try {
      await api("/api/auth/logout", { method: "POST" });
      onLogout();
    } catch (logoutError) {
      setError(logoutError.message);
    }
  }

  return (
    <main className="container">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Native Plant Admin home">
          <span aria-hidden="true">✳</span> Native Plant Admin
        </a>
        <div className="account">
          <span>{user.name || user.email}</span>
          <button className="button-secondary" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <header className="hero">
        <p className="eyebrow">ADMINISTRATIVE AREA</p>
        <h1>Plant records</h1>
        <p className="intro">Manage the native plants in your catalog.</p>
      </header>

      <PlantForm
        key={editingPlant?._id || "new"}
        plant={editingPlant}
        onSave={handleSave}
        onCancel={() => { setEditingPlant(null); setFormError(""); }}
        busy={busy}
        error={formError}
      />

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">DATABASE</p>
            <h2 id="catalog-title">View plant records</h2>
            <p className="catalog-count">{plants.length} {plants.length === 1 ? "record" : "records"}</p>
          </div>
          <form className="search-form" role="search" onSubmit={handleSearch}>
            <label className="sr-only" htmlFor="plant-search">Search plant records</label>
            <input
              id="plant-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search plant records"
            />
            <button className="button-primary" type="submit">Search</button>
            {search && (
              <button
                className="button-secondary"
                type="button"
                onClick={() => { setSearch(""); loadPlants(""); }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
        {message && <p className="notice success" role="status">{message}</p>}
        {error && <p className="notice error" role="alert">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading plant records…</p>
        ) : plants.length === 0 ? (
          <p className="empty-state">{search ? "No records match that search." : "No plants in the catalog yet."}</p>
        ) : (
          <ul className="plant-list">
            {plants.map((plant) => (
              <li className="plant-card" key={plant._id}>
                {plant.image && <img className="plant-image" src={plant.image} alt={plant.name} />}
                <div className="plant-card-body">
                  <div className="plant-title">
                    <div>
                      <h3>{plant.name}</h3>
                      <p className="scientific-name">{plant.scientificName}</p>
                    </div>
                    <span className="bloom-tag">{plant.bloomSeason}</span>
                  </div>
                  <p className="plant-description">{plant.description}</p>
                  <dl className="plant-details">
                    <div><dt>Sunlight</dt><dd>{plant.sunlight}</dd></div>
                    <div><dt>Soil</dt><dd>{plant.soil}</dd></div>
                    <div><dt>Water</dt><dd>{plant.water}</dd></div>
                    {plant.height != null && <div><dt>Height</dt><dd>{plant.height} in</dd></div>}
                    <div className="range-detail"><dt>Native range</dt><dd>{plant.nativeRange}</dd></div>
                  </dl>
                  {plant.wildlifeBenefits?.length > 0 && (
                    <p className="wildlife"><strong>Wildlife:</strong> {plant.wildlifeBenefits.join(" · ")}</p>
                  )}
                  <div className="card-actions">
                    <button className="button-secondary" onClick={() => { setEditingPlant(plant); setFormError(""); }}>
                      Edit
                    </button>
                    <button className="button-danger" onClick={() => handleDelete(plant)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer className="footer">Administrator access is required for all plant record operations.</footer>
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

  if (checkingSession) {
    return <main className="loading-page">Checking administrator session…</main>;
  }
  if (sessionError) {
    return <main className="loading-page notice error" role="alert">{sessionError}</main>;
  }
  return user ? <Admin user={user} onLogout={() => setUser(null)} /> : <Login onLogin={setUser} />;
}

export default App;
