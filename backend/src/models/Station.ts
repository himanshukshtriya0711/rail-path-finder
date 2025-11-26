import mongoose, { Document, Schema } from 'mongoose';

export interface IStation extends Document {
  code: string;
  name: string;
  city: string;
  createdAt: Date;
}

const StationSchema = new Schema<IStation>(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

const Station = mongoose.model<IStation>('Station', StationSchema);
export default Station;
