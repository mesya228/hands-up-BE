import { model, Schema } from 'mongoose';

const userTokenSchema = new Schema({
  uuid: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});

export const UserToken = model('UserToken', userTokenSchema);
