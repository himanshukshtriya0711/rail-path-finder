import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true, unique: true, index: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
});

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
export default RefreshToken;
