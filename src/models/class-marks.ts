import { Schema, model } from 'mongoose';

const classMarksSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  class: {
    type: String,
    require: true,
  },
  school: {
    type: String,
    require: true,
  },
  teachers: {
    type: String,
    require: true,
  },
  marks: {
    type: Array<IMark>,
    require: true,
  },
});

export const ClassMarks = model('ClassMarks', classMarksSchema);

export interface IClassMarks {
  id: string;
  name: string;
  school: string;
  teachers: string;
  marks: IMark[];
}

export interface IMark {
  student: string;
  mark: number;
  date: string;
}
