import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>(
  {
    token: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index to auto-delete expired tokens
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model<IToken>('Token', TokenSchema);
