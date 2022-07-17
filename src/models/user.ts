import { Schema, model } from 'mongoose';
import { IClass } from './class';
import { ISchool } from './school';

const userSchema = new Schema({
  uuid: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  roles: {
    type: [String],
    enum: ['student', 'teacher', 'admin'],
    default: ['teacher'],
    require: true,
  },
  state: {
    type: String,
    enum: ['registered', 'pending'],
    default: 'pending',
    require: false,
  },
  username: {
    type: String,
    require: false,
  },
  name: {
    type: String,
    require: false,
  },
  surname: {
    type: String,
    require: false,
  },
  thirdname: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    require: false,
  },
  school: {
    type: Object,
    require: false,
  },
  phone: {
    require: false,
    type: String,
  },
  classes: {
    require: true,
    type: Array<String>,
  },
});

export const User = model('User', userSchema);

export interface IUser {
  uuid: string;
  email: string;

  password?: string;
  roles: string[];

  name?: string;
  surname?: string;
  thirdname?: string;
  username?: string;

  state?: 'registered' | 'pending';
  school?: string | ISchool;
  classes?: string[] | IClass[];
}

export interface ITeacher extends IUser {
  phone: string;
}

export interface IStudent extends IUser {}
