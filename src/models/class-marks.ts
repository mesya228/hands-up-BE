import { Schema, model } from 'mongoose';

const classMarksSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  classId: {
    type: String,
    require: true,
  },
  subjectId: {
    type: String,
    require: true,
  },
  teachers: {
    type: Array<String>,
    require: true,
  },
  marks: {
    type: Array<IMark>,
    default: [],
    require: true,
  },
});

export const ClassMarksSchema = model('ClassMarks', classMarksSchema);

export interface IClassMarks {
  id: string;
  subjectId: string;
  classId: string;
  teachers: string[];
  marks: IMark[];
}

export interface IMark {
  student: string;
  mark: number;
  date: string;
}
