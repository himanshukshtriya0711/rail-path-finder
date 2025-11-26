import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDb } from './db';

const port = process.env.PORT || 4000;

const start = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start', err);
  process.exit(1);
});
