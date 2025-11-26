import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITrain extends Document {
  number: string;
  name: string;
  fare: number;
  route: Types.ObjectId[]; // station ids in order
  createdAt: Date;
}

const TrainSchema = new Schema<ITrain>(
  {
    number: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    fare: { type: Number, required: true },
    route: [{ type: Schema.Types.ObjectId, ref: 'Station' }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

const Train = mongoose.model<ITrain>('Train', TrainSchema);
export default Train;
