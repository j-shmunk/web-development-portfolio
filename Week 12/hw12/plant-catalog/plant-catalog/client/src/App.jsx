import React, { useEffect, useRef, useState } from 'react';

const sunlightOptions = ['Full sun', 'Partial shade', 'Full shade'];
const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];

const fields = [
  { name: 'name', label: 'Common name', max: 100, required: true },
  { name: 'scientificName', label: 'Scientific name', max: 120 },
  { name: 'sunlight', label: 'Sunlight', options: sunlightOptions },
  { name: 'bloomSeason', label: 'Bloom season', options: seasonOptions },
  { name: 'notes', label: 'Notes', max: 500 },
];

async function request(path = '', options = {}) {
  const response = await fetch(`/api/plants${path}`, options);
  if (response.status === 204) return;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || 'Could not reach the plant API.');
  if (!data) throw new Error('The plant API returned an invalid response.');
  return data;
}

function PlantForm({ plant, busy, onSubmit }) {
  return (
    <form id="plant-form" onSubmit={onSubmit}>
      {fields.map(({ name, label, required, max, options }) => (
        <label key={name}>
          {label}{required && ' *'}
          {options ? (
            <select name={name} defaultValue={plant?.[name] ?? ''} disabled={busy}>
              <option value="">Choose an option</option>
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
          ) : name === 'notes' ? (
            <textarea name={name} rows="3" maxLength={max} defaultValue={plant?.[name] ?? ''} disabled={busy} />
          ) : (
            <input name={name} required={required} maxLength={max} defaultValue={plant?.[name] ?? ''} disabled={busy} />
          )}
        </label>
      ))}
    </form>
  );
}

export default function App() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [action, setAction] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const dialog = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    request('', { signal: controller.signal })
      .then(setPlants)
      .catch((err) => {
        if (!controller.signal.aborted) setLoadError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [loadAttempt]);

  useEffect(() => {
    if (action && !dialog.current.open) dialog.current.showModal();
  }, [action]);

  function openAction(type, plant) {
    setError('');
    setAction({ type, plant });
  }

  async function changePlant(event) {
    event.preventDefault();
    if (busy) return;
    const { type, plant } = action;
    const methods = { add: 'POST', edit: 'PUT', delete: 'DELETE' };
    const options = { method: methods[type] };
    if (type !== 'delete') {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)));
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const record = await request(plant ? `/${plant._id}` : '', options);
      setPlants((current) => {
        if (type === 'add') return [record, ...current];
        if (type === 'delete') return current.filter(({ _id }) => _id !== plant._id);
        return current.map((item) => item._id === plant._id ? record : item);
      });
      if (type === 'add') setSearch('');
      setNotice(type === 'delete' ? `${plant.name} deleted.` : `${record.name} saved.`);
      dialog.current.close();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const query = search.trim().toLowerCase();
  const visiblePlants = plants.filter((plant) =>
    [plant.name, plant.scientificName].some((name) => name?.toLowerCase().includes(query)),
  );

  return (
    <main>
      <header className="hero">
        <div>
          <h1>Plant Catalog</h1>
          <p>Keep track of your plants and their growing conditions.</p>
        </div>
        <button className="primary" disabled={loading || Boolean(loadError)} onClick={() => openAction('add')}>+ Add plant</button>
      </header>
      <section className="collection" aria-label="Plant records" aria-busy={loading}>
        <div className="toolbar">
          <label>Search plants
            <input type="search" placeholder="Common or scientific name" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <span>{visiblePlants.length} of {plants.length} plants</span>
        </div>
        <div className="notice" role="status">{notice}</div>
        {loading && <p className="empty" role="status">Loading plants…</p>}
        {loadError && (
          <div className="empty">
            <p role="alert">{loadError}</p>
            <button onClick={() => {
              setLoadError('');
              setLoading(true);
              setLoadAttempt(loadAttempt + 1);
            }}>Try again</button>
          </div>
        )}
        {!loading && !loadError && visiblePlants.length === 0 && (
          <div className="empty">
            <h2>{plants.length ? 'No matching plants' : 'No plants yet'}</h2>
            <p>{plants.length ? 'Try a different name.' : 'Add your first plant to start your catalog.'}</p>
          </div>
        )}
        <div className="grid">
          {visiblePlants.map((plant) => (
            <article key={plant._id}>
              <h2>{plant.name}</h2>
              {plant.scientificName && <p className="scientific">{plant.scientificName}</p>}
              <dl>
                <div><dt>Sunlight</dt><dd>{plant.sunlight || '—'}</dd></div>
                <div><dt>Bloom season</dt><dd>{plant.bloomSeason || '—'}</dd></div>
              </dl>
              {plant.notes && <p className="notes">{plant.notes}</p>}
              <div className="actions">
                <button aria-label={`Edit ${plant.name}`} onClick={() => openAction('edit', plant)}>Edit</button>
                <button className="text-danger" aria-label={`Delete ${plant.name}`} onClick={() => openAction('delete', plant)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <dialog ref={dialog} aria-labelledby="dialog-title" onClose={() => setAction(null)} onCancel={(event) => { if (busy) event.preventDefault(); }}>
        {action && (
          <>
            <h2 id="dialog-title">{{ add: 'Add plant', edit: 'Edit plant', delete: 'Delete plant?' }[action.type]}</h2>
            {action.type === 'delete'
              ? <form id="plant-form" onSubmit={changePlant}><p>Remove <strong>{action.plant.name}</strong> from your catalog?</p></form>
              : <PlantForm plant={action.plant} busy={busy} onSubmit={changePlant} />}
            {error && <p className="text-danger" role="alert">{error}</p>}
            <div className="actions">
              <button disabled={busy} onClick={() => dialog.current.close()}>Cancel</button>
              <button className={action.type === 'delete' ? 'danger' : 'primary'} type="submit" form="plant-form" disabled={busy}>
                {busy ? 'Working…' : action.type === 'delete' ? 'Delete plant' : 'Save plant'}
              </button>
            </div>
          </>
        )}
      </dialog>
    </main>
  );
}
