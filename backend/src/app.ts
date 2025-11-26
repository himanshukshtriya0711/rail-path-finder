import express from "express";
import cors from "cors";
import authRouter from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok' });
});

// Routers
// Routers
app.use('/api/auth', authRouter);
// mount other routers
import trainsRouter from './routes/trains';
import bookingsRouter from './routes/bookings';
import adminRouter from './routes/admin';

app.use('/api/trains', trainsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);

export default app;
