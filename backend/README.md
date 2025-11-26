Railway reservation backend (scaffold)

Quick start

1. copy `.env.example` to `.env` and fill values (DATABASE_URL, JWT_SECRET)
2. npm install
3. npx prisma generate
4. npx prisma migrate dev --name init
5. npm run dev

Chosen stack
- Node.js + TypeScript
- Express for lightweight API
- Prisma ORM + PostgreSQL
- JWT authentication

Next steps
- Implement Auth (signup/login/refresh)
- Implement Train/Station models + search API
- Implement Booking flow and seat inventory
- Add tests and CI

MongoDB (Compass)
-----------------
This backend uses MongoDB (Mongoose). For local development we default to a database named `indianrailway` on your local Mongo server.

To connect with MongoDB Compass:

1. Open MongoDB Compass.
2. Use the connection string: `mongodb://localhost:27017` and connect.
3. The database `indianrailway` will be created automatically when you load data.

To persist the in-memory dataset into MongoDB (create stations, trains and schedules), start the server and call:

POST http://localhost:4000/api/trains/load-hard

This will write the hardcoded 60 trains into the `indianrailway` database. After that the `/api/trains/search` endpoint will prefer DB-backed searches.

Protecting the loader (admin-only)
--------------------------------
The `POST /api/trains/load-hard` endpoint is restricted to admin users. To mark a user as an admin:

1. Create a user via the signup endpoint (or directly in MongoDB).
2. Open MongoDB Compass and connect to `mongodb://localhost:27017`.
3. Open the `indianrailway` database, find the `users` collection, and update the `role` field of the desired user document to `"ADMIN"`.

Alternatively, you can update the user via the mongo shell:

```bash
use indianrailway
db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'ADMIN' } })
```

Once a user has `role: "ADMIN"`, they can call `POST /api/trains/load-hard` with a valid access token.

