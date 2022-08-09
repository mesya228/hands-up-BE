import { Schema, model } from 'mongoose';

const classSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  school: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  students: {
    type: Array<String>,
    require: true,
    default: [],
  },
});

export const ClassSchema = model('Class', classSchema);

export interface IClass {
  id: string;
  name: string;
  school: string;
  students: string[];
}
