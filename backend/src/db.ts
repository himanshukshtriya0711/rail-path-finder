import mongoose from 'mongoose';

const MONGO_URL = process.env.DATABASE_URL || process.env.MONGO_URL || 'mongodb://localhost:27017/indianrailway';

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
};

export default mongoose;
