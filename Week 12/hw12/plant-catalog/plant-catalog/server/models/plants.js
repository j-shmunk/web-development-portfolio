const sunlightOptions = ['Full sun', 'Partial shade', 'Full shade'];
const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];

const fields = [
  { name: 'name', label: 'Common name', max: 100, required: true },
  { name: 'scientificName', label: 'Scientific name', max: 120 },
  { name: 'sunlight', label: 'Sunlight', options: sunlightOptions },
  { name: 'bloomSeason', label: 'Bloom season', options: seasonOptions },
  { name: 'notes', label: 'Notes', max: 500 },
];

export function validatePlant(body) {
  const plant = {};
  for (const { name, label, max, required, options } of fields) {
    const raw = body?.[name] ?? '';
    if (typeof raw !== 'string') throw badRequest(`${label} must be text.`);
    const value = raw.trim();
    if (required && !value) throw badRequest(`${label} is required.`);
    if ((max && value.length > max) || (options && value && !options.includes(value))) {
      throw badRequest(`${label} has an invalid value.`);
    }
    plant[name] = value;
  }
  return plant;
}

export function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export function plantsCollection(db) {
  return db.collection('plants');
}
