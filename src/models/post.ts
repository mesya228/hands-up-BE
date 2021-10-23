import { Schema, model } from 'mongoose';

const schema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	link: {
		type: String,
		require: true,
	},
	text: {
		type: String,
	},
});

export const Post = model('Post', schema);

export interface IPost {
	username: string;
	link: string;
	text: string;
}
