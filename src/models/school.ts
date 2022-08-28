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

export const SchoolSchema = model('School', schoolSchema);

export interface ISchool {
  id: string;
  name: string;
}
