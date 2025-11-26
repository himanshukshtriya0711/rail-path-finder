import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  pnr: string;
  user: Types.ObjectId;
  train: Types.ObjectId;
  schedule: Types.ObjectId;
  date: Date;
  passengers: any[];
  amount: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'PENDING';
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    pnr: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    train: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    date: { type: Date, required: true },
  passengers: { type: Schema.Types.Mixed, default: [] },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'PENDING'], default: 'CONFIRMED' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
