import { Schema, model } from 'mongoose';

const achievmentSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  subjectId: {
    type: String,
    require: false,
  },
  level: {
    type: Number,
    require: false,
  },
});

export const AchievmentSchema = model('Achievment', achievmentSchema);

export interface IAchievment {
  id: string;
  name: string;
  imageUrl: string;

  subjectId?: string;
  level?: number;
}
