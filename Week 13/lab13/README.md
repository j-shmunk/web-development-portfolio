# Native Plant Admin

A React administrative interface backed by an Express API and MongoDB. Administrator sign-in protects all plant record operations.

## Architecture

```text
React admin interface
      ↓ same-origin /api requests
Express API (authentication, validation, protected routes)
      ↓ Mongoose
MongoDB (native-plants database)
```

React sends JSON requests and receives plant records from Express. Express checks the administrator session, validates each submitted field, and then uses Mongoose to read or change MongoDB documents. The browser never receives a password hash or the signing secret.

## Security concepts used

- **Environment variables:** MongoDB URI, JWT signing key, and initial admin credentials are set in the server `.env`, not in source files. Keep the `.env` private.
- **Password security:** There is no public registration form. Provision one admin account with the server command; the password is hashed with bcrypt (12 rounds) before it is saved.
- **Authentication:** Successful login issues a one-hour JWT in an `HttpOnly`, `SameSite=Strict` cookie. JavaScript cannot read this cookie. Production cookies are marked `Secure`.
- **Protected routes:** Every plant list/read/create/update/delete endpoint checks the signed session and verifies the user still exists with the administrator role.
- **Input validation:** The API accepts only the expected plant fields, enforces data types and length limits, checks URLs and numeric ranges, validates IDs, and limits JSON body size.
- **Login protection:** Sign-in requests are rate limited. Invalid account and password attempts receive the same generic response.

## Setup

1. Start MongoDB locally or provide an accessible MongoDB URI.
2. In `server`, copy `.env.example` to `.env`. Set `MONGO_URI`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 12 characters. Generate a strong JWT secret, for example with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`, then set it as `JWT_SECRET`.
3. From `server`, run `npm install`, then `npm run create-admin`. This creates or updates the configured administrator and stores only the bcrypt password hash.
4. Start the API from `server` with `npm run dev` (or `npm start`).
5. In another terminal, run `npm install` and `npm run dev` from `client`. Open the URL printed by Vite and sign in with the configured admin credentials.

The API uses port 5001 by default. Vite forwards `/api` requests to it. Do not expose the development server publicly or reuse example credentials in a deployed application.
