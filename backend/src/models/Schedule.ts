import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISchedule extends Document {
  train: Types.ObjectId;
  date: Date;
  departure: string; // time string
  arrival: string; // time string
  duration: string;
  totalSeats: number;
  availableSeats: number;
}

const ScheduleSchema = new Schema<ISchedule>({
  train: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
  date: { type: Date, required: true, index: true },
  departure: { type: String },
  arrival: { type: String },
  duration: { type: String },
  totalSeats: { type: Number, default: 100 },
  availableSeats: { type: Number, default: 100 },
});

const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema);
export default Schedule;
