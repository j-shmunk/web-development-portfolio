import { fileURLToPath, pathToFileURL } from 'node:url';
import { MongoClient } from 'mongodb';
import express from 'express';
import { plantsCollection } from './models/plants.js';
import createPlantRouter from './routes/Plants.js';


export function createApp(collection, staticDir) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));

  app.use('/api/plants', createPlantRouter(collection));
  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  if (staticDir) app.use(express.static(staticDir));

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.status >= 400 && error.status < 500) {
      const message = error.type === 'entity.parse.failed' ? 'Invalid JSON.' : error.message;
      return res.status(error.status).json({ error: message });
    }
    console.error(error);
    res.status(500).json({ error: 'The server could not complete the request.' });
  });
  return app;
}

export async function startServer() {
  const client = new MongoClient(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plant_catalog',
    { serverSelectionTimeoutMS: 5000 },
  );
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';

  try {
    await client.connect();
    const app = createApp(plantsCollection(client.db()), fileURLToPath(new URL('../client/dist', import.meta.url)));
    const server = app.listen(port, host);
    server.on('listening', () => console.log(`Plant Catalog listening on http://${host}:${port}`));
    server.on('error', async (error) => {
      console.error(`Could not start server (${error.code || error.name}).`);
      await client.close();
      process.exitCode = 1;
    });

    function shutdown() {
      server.close(async () => {
        await client.close();
      });
    }

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error(`Could not connect to MongoDB (${error.code || error.name}). Check MONGODB_URI and database availability.`);
    await client.close();
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await startServer();
}
