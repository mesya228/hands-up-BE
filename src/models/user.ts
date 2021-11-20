import { Schema, model } from 'mongoose';

const schema = new Schema({
	email: {
		type: String,
		require: true,
	},
	username: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
});

export const User = model('User', schema);

export interface IUser {
	email: string;
	username: string;
	password: string;
}
