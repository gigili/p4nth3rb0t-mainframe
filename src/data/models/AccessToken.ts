import mongoose, { Document, Schema } from "mongoose";

export interface AccessTokenData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  updatedAt: number;
}

export interface AccessTokenDoc extends Document, AccessTokenData {}

export const AccessTokenSchema: Schema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  tokenType: { type: String, required: true },
  expiresIn: { type: Number, required: true },
  updatedAt: { type: Number, required: true },
});

export default mongoose.model<AccessTokenDoc>("AccessToken", AccessTokenSchema);
