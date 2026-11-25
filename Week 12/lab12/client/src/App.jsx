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

async function request(path, options) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed.");
  }
  return data;
}

function App() {
  const [plants, setPlants] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadPlants(searchTerm = search) {
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({ search: searchTerm });
      setPlants(await request(`/api/plants?${query}`));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlants("");
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      ...formData,
      height: formData.height === "" ? null : Number(formData.height),
      wildlifeBenefits: formData.wildlifeBenefits
        .split(",")
        .map((benefit) => benefit.trim())
        .filter(Boolean),
    };
    const wasEditing = Boolean(editingId);

    try {
      await request(
        editingId ? `/api/plants/${editingId}` : "/api/plants",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      setFormData(emptyForm);
      setEditingId(null);
      setMessage(wasEditing ? "Plant updated." : "Plant added.");
      await loadPlants();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  function startEditing(plant) {
    setEditingId(plant._id);
    setFormData({
      name: plant.name,
      scientificName: plant.scientificName,
      description: plant.description,
      sunlight: plant.sunlight,
      soil: plant.soil,
      water: plant.water,
      height: plant.height ?? "",
      bloomSeason: plant.bloomSeason,
      nativeRange: plant.nativeRange,
      wildlifeBenefits: plant.wildlifeBenefits.join(", "),
      image: plant.image || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deletePlant(plant) {
    if (!window.confirm(`Delete ${plant.name} from the catalog?`)) return;
    setError("");
    setMessage("");
    try {
      await request(`/api/plants/${plant._id}`, { method: "DELETE" });
      if (editingId === plant._id) {
        setEditingId(null);
        setFormData(emptyForm);
      }
      setMessage(`${plant.name} deleted.`);
      await loadPlants();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
    setError("");
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadPlants(search);
  }

  async function clearSearch() {
    setSearch("");
    await loadPlants("");
  }

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">GROW LOCAL · SUPPORT WILDLIFE</p>
        <h1>Native Plant Catalog</h1>
        <p className="intro">
          Find, care for, and keep track of the plants that belong in your
          landscape.
        </p>
        <div className="hero-note">
          <span aria-hidden="true">✳</span>
          <span>Rooted in place. Made for pollinators.</span>
        </div>
      </header>

      <section className="panel editor" aria-labelledby="form-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">PLANT RECORD</p>
            <h2 id="form-title">{editingId ? "Edit a plant" : "Add a plant"}</h2>
          </div>
          <span className="leaf-mark" aria-hidden="true">✳</span>
        </div>
        <form onSubmit={handleSubmit} className="plant-form">
          <label>
            Common name
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <label>
            Scientific name
            <input
              name="scientificName"
              value={formData.scientificName}
              onChange={handleChange}
              required
            />
          </label>
          <label className="wide">
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              required
            />
          </label>
          <label>
            Sunlight
            <input name="sunlight" value={formData.sunlight} onChange={handleChange} required />
          </label>
          <label>
            Soil
            <input name="soil" value={formData.soil} onChange={handleChange} required />
          </label>
          <label>
            Water needs
            <input name="water" value={formData.water} onChange={handleChange} required />
          </label>
          <label>
            Height (inches)
            <input
              name="height"
              type="number"
              min="0"
              value={formData.height}
              onChange={handleChange}
            />
          </label>
          <label>
            Bloom season
            <input name="bloomSeason" value={formData.bloomSeason} onChange={handleChange} required />
          </label>
          <label>
            Native range
            <input name="nativeRange" value={formData.nativeRange} onChange={handleChange} required />
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
            <input
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/plant.jpg"
            />
          </label>
          <div className="form-actions wide">
            <button type="submit" className="button-primary">
              {editingId ? "Save changes" : "Add to catalog"}
            </button>
            {editingId && (
              <button type="button" className="button-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="notice success" role="status">{message}</p>}
        {error && <p className="notice error" role="alert">{error}</p>}
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="catalog-header">
          <div>
            <p className="eyebrow">YOUR COLLECTION</p>
            <h2 id="catalog-title">Plants in the catalog</h2>
            <p className="catalog-count">
              {plants.length} {plants.length === 1 ? "plant" : "plants"} shown
            </p>
          </div>
          <form className="search-form" onSubmit={handleSearch} role="search">
            <label className="sr-only" htmlFor="plant-search">Search plants</label>
            <input
              id="plant-search"
              type="search"
              placeholder="Search plants..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" className="button-primary">Search</button>
            {search && (
              <button type="button" className="button-secondary" onClick={clearSearch}>
                Clear
              </button>
            )}
          </form>
        </div>

        {error && !loading && <p className="notice error" role="alert">{error}</p>}
        {loading ? (
          <p className="empty-state">Loading plants…</p>
        ) : plants.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✳</span>
            <p>{search ? "No plants match your search." : "No plants yet. Add one above to get started."}</p>
          </div>
        ) : (
          <ul className="plant-list">
            {plants.map((plant) => (
              <li key={plant._id} className="plant-card">
                {plant.image && (
                  <img className="plant-image" src={plant.image} alt={plant.name} />
                )}
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
                    <div><dt>Sun</dt><dd>{plant.sunlight}</dd></div>
                    <div><dt>Soil</dt><dd>{plant.soil}</dd></div>
                    <div><dt>Water</dt><dd>{plant.water}</dd></div>
                    {plant.height != null && <div><dt>Height</dt><dd>{plant.height} in</dd></div>}
                    <div className="range-detail"><dt>Native range</dt><dd>{plant.nativeRange}</dd></div>
                  </dl>
                  {plant.wildlifeBenefits.length > 0 && (
                    <p className="wildlife">
                      <strong>Wildlife:</strong> {plant.wildlifeBenefits.join(" · ")}
                    </p>
                  )}
                  <div className="card-actions">
                    <button className="button-secondary" onClick={() => startEditing(plant)}>
                      Edit
                    </button>
                    <button className="button-danger" onClick={() => deletePlant(plant)}>
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">
        <span aria-hidden="true">✳</span> Native plants, thriving together.
      </footer>
    </main>
  );
}

export default App;
