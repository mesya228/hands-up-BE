import { Schema, model } from 'mongoose';

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
  classes: {
    require: false,
    type: Object,
  },
  phone: {
    require: false,
    type: String,
  },
  class: {
    require: false,
    type: Object,
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
  school?: ISchool;
}

export interface ITeacher extends IUser {
  classes: IClass[];
  phone: string;
}

export interface IStudent extends IUser {
  class: IClass;
}

interface IClass {
  id: string;
  name: string;
  users?: IUser[];
}

interface ISchool {
  id: string;
  name: string;
  classes: IClass[];
}
