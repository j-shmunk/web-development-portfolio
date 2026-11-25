# Mercurial Vapor 17 Colorway Archive

A MERN app: React provides the interface, Express and Node.js expose a JSON API, and MongoDB stores registered users and colorway records. Registration and login create an HttpOnly session cookie; the colorway API requires a valid session.

## Authentication vs. authorization

- **Authentication** answers “Who are you?” This app registers users and verifies their email/password at login. Passwords are hashed with bcrypt; successful login issues a one-hour, HttpOnly JWT cookie. Passwords are limited to 72 UTF-8 bytes to avoid bcrypt's input truncation.
- **Authorization** answers “What are you allowed to do?” After authentication, `requireAuth` checks the signed session and confirms the user still exists. That middleware protects the catalog API; only signed-in users can view, add, edit, or delete colorway records. In this app every registered user has the same catalog permissions.

## Product-data scope

The seed contains six distinct Nike Mercurial Vapor 17 Elite firm-ground colorway records: the five options in the Nike US Elite FG product selector (three core colorways plus United and Vini Jr. editions), and the separately listed Kobe Mambacurial edition. Nike marked Mambacurial “Coming Soon” when checked on November 25, 2026. Nike By You custom designs are excluded because they are user-configurable rather than fixed colorways. Product catalogs vary by region and change over time, so the linked Nike pages are the source of truth for current names and style codes.

Sources checked November 25, 2026:

- [Nike Mercurial Vapor 17 Elite FG color selector](https://www.nike.com/t/mercurial-vapor-17-elite-firm-ground-low-top-soccer-cleats-YnaBVCly/IF8508-102)
- [Nike Kobe Mercurial Vapor 17 Elite “Mambacurial”](https://www.nike.com/t/kobe-mercurial-vapor-17-elite-mambacurial-firm-ground-low-top-soccer-cleats-jnaOooe2/IU3417-600)
- [Nike Vapor 17 search results](https://www.nike.com/w?q=mercurial%20vapor%2017)

## Run locally

1. Start MongoDB.
2. In `server`, copy `.env.example` to `.env`. Set `MONGO_URI` and generate a unique signing key with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`, then set it as `JWT_SECRET`.
3. From `server`, run `npm install` and `npm run seed`. The seed upserts by style code and does not erase user-managed records.
4. Start the API with `npm run dev` from `server`.
5. From `client`, run `npm install` and `npm run dev`; open the Vite URL and register an account.

The API defaults to port 5002 so it can run alongside `lab13`. The client forwards `/api` requests to it. Registration requires a valid email, name, and password between 12 and 128 characters. Login and registration are rate-limited; all catalog fields are validated on the server.
