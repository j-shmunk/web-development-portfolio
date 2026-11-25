# Native Plant App

This app connects a React interface to an Express API and a MongoDB database.

## Architecture

```text
React (browser)
      ↓ HTTP requests to /api/plants
Express API (Node.js)
      ↓ Mongoose queries
MongoDB (native-plants database)
```

React sends requests to the Express API to list/search, add, edit, and delete plant records. During development, Vite forwards `/api` requests from the React app to the API on port 5001. Express validates and routes each request, Mongoose reads or writes plant documents in MongoDB, and the API returns JSON. React then renders the returned plants.

## Run locally

1. Start MongoDB locally, or obtain a MongoDB connection URI.
2. In `server`, copy `.env.example` to `.env` and set `MONGO_URI` to your connection URI.
3. From `server`, run `npm install`, then `npm run seed` to add starter plants to an empty collection. Seeding does not overwrite existing records.
4. In `server`, run `npm run dev` (or `npm start`). The API runs on port 5001 by default.
5. In another terminal, from `client`, run `npm install`, then `npm run dev`. Open the local URL printed by Vite.

The API health endpoint is `http://localhost:5001/api/health`. Plant records are available at `http://localhost:5001/api/plants`; pass `?search=aster` to search.
