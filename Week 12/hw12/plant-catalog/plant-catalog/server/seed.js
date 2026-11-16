import { MongoClient, ObjectId } from 'mongodb';
import { plantsCollection, validatePlant } from './models/plants.js';

const samples = [
  {
    _id: new ObjectId('65aa10000000000000000001'),
    name: 'Purple coneflower',
    scientificName: 'Echinacea purpurea',
    sunlight: 'Full sun',
    bloomSeason: 'Summer',
    notes: 'Attracts butterflies.',
  },
  {
    _id: new ObjectId('65aa10000000000000000002'),
    name: 'White wood aster',
    scientificName: 'Eurybia divaricata',
    sunlight: 'Partial shade',
    bloomSeason: 'Fall',
    notes: 'Grows in woodland gardens.',
  },
  {
    _id: new ObjectId('65aa10000000000000000003'),
    name: 'Wild columbine',
    scientificName: 'Aquilegia canadensis',
    sunlight: 'Partial shade',
    bloomSeason: 'Spring',
    notes: 'Its red flowers attract hummingbirds.',
  },
];

const client = new MongoClient(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plant_catalog',
  { serverSelectionTimeoutMS: 5000 },
);

try {
  await client.connect();
  const collection = plantsCollection(client.db());
  const now = new Date();
  const result = await collection.bulkWrite(samples.map(({ _id, ...sample }) => ({
    updateOne: {
      filter: { _id },
      update: {
        $setOnInsert: { ...validatePlant(sample), createdAt: now, updatedAt: now },
      },
      upsert: true,
    },
  })));
  console.log(`Added ${result.upsertedCount} sample plants.`);
} catch (error) {
  console.error(`Could not seed MongoDB (${error.code || error.name}).`);
  process.exitCode = 1;
} finally {
  await client.close();
}
