import express from 'express';
import { requireAuth } from '../middleware/auth';
import Booking from '../models/Booking';
import Schedule from '../models/Schedule';
import Train from '../models/Train';
import User from '../models/User';
import { Types } from 'mongoose';

const router = express.Router();

const generatePnr = () => `PNR${Math.floor(1000000000 + Math.random() * 9000000000)}`;

// Create booking
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { scheduleId, passengers, contact, amount } = req.body;
    if (!scheduleId || !passengers || !Array.isArray(passengers)) return res.status(400).json({ message: 'Invalid payload' });

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });

    const seatsNeeded = passengers.length;
    if (schedule.availableSeats < seatsNeeded) return res.status(400).json({ message: 'Not enough seats' });

    // atomically decrement availableSeats
    const updated = await Schedule.findOneAndUpdate(
      { _id: scheduleId, availableSeats: { $gte: seatsNeeded } },
      { $inc: { availableSeats: -seatsNeeded } },
      { new: true }
    );
    if (!updated) return res.status(400).json({ message: 'Failed to reserve seats' });

    const train = await Train.findById(schedule.train);
    const pnr = generatePnr();
    const booking = await Booking.create({
      pnr,
      user: Types.ObjectId(req.user.userId),
      train: schedule.train,
      schedule: schedule._id,
      date: schedule.date,
      passengers,
      amount: amount || (train ? train.fare * seatsNeeded : 0),
      status: 'CONFIRMED',
    });

    return res.status(201).json({ pnr, bookingId: booking._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by PNR
router.get('/:pnr', requireAuth, async (req: any, res) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr }).populate('train').populate('user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // allow user or admin
    if (booking.user._id.toString() !== req.user.userId && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    return res.json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.post('/:id/cancel', requireAuth, async (req: any, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });

    if (booking.status === 'CANCELLED') return res.status(400).json({ message: 'Already cancelled' });

    booking.status = 'CANCELLED' as any;
    await booking.save();

    const seatsToReturn = booking.passengers.length || 1;
    await Schedule.findByIdAndUpdate(booking.schedule, { $inc: { availableSeats: seatsToReturn } });

    return res.json({ cancelled: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
