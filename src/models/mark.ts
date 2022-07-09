import { Schema, model } from 'mongoose';

const markSchema = new Schema({
  class: {
    type: String,
    require: true,
  },
  school: {
    type: String,
    require: true,
  },
  teachers: {
    type: Array<String>,
    require: true,
  },
  students: {
    type: Array<String>,
    require: true,
  },
  marks: {
    type: Array<String>,
    require: true,
  },
});

export const Mark = model('Mark', markSchema);

export interface IMark {
  id: string;
  name: string;
  school: string;
  students: string[];
  teachers: string[];
  marks: string[];
}
