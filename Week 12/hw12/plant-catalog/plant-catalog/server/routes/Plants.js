import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { badRequest, validatePlant } from '../models/plants.js';

export default function createPlantRouter(collection) {
  const router = Router();

  router.param('id', (req, res, next, id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return next(badRequest('Invalid plant ID.'));
    req.plantId = new ObjectId(id);
    next();
  });

  router.get('/', async (req, res) => {
    const plants = await collection.find().sort({ createdAt: -1, _id: -1 }).toArray();
    res.json(plants);
  });

  router.post('/', async (req, res) => {
    const date = new Date();
    const plant = { ...validatePlant(req.body), createdAt: date, updatedAt: date };
    const { insertedId } = await collection.insertOne(plant);
    res.location(`/api/plants/${insertedId}`).status(201).json({ ...plant, _id: insertedId });
  });

  router.get('/:id', async (req, res) => {
    const plant = await collection.findOne({ _id: req.plantId });
    if (!plant) return res.status(404).json({ error: 'Plant not found.' });
    res.json(plant);
  });

  router.put('/:id', async (req, res) => {
    const plant = await collection.findOneAndUpdate(
      { _id: req.plantId },
      { $set: { ...validatePlant(req.body), updatedAt: new Date() } },
      { returnDocument: 'after' },
    );
    if (!plant) return res.status(404).json({ error: 'Plant not found.' });
    res.json(plant);
  });

  router.delete('/:id', async (req, res) => {
    const { deletedCount } = await collection.deleteOne({ _id: req.plantId });
    if (!deletedCount) return res.status(404).json({ error: 'Plant not found.' });
    res.status(204).end();
  });

  return router;
}
