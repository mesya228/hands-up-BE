import { Schema, model } from 'mongoose';

const schoolSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

export const School = model('School', schoolSchema);

export interface ISchool {
  id: string;
  name: string;
}
