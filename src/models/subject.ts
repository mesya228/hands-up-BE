import { Schema, model } from 'mongoose';

const subjectSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
});

export const SubjectSchema = model('Subject', subjectSchema);

export interface ISubject {
  id: string;
  name: string;
}
