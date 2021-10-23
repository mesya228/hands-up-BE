import { Schema, model } from 'mongoose';

const schema = new Schema({
	id: {
		type: String,
		require: true,
	},
	instagramLink: {
		type: String,
		require: true,
	},
});

export const User = model('User', schema);

export interface IUser {
	username: string;
	email: string;
	password: string;
}
