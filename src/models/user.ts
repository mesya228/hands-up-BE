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
    default: ['student'],
    require: true,
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
});

export const User = model('User', userSchema);

export interface IUser {
  uuid: string;
  email: string;
  roles: string[];
  username?: string;
  name?: string;
  surname?: string;
  thirdname?: string;
  password?: string;
}
