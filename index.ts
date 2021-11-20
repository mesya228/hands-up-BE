import express from 'express';
import mongoose from 'mongoose';
import { initRouters, router } from './src/router/router';
const app = express();

const PORT = process.env.PORT || 8000;
const DB_URL: string =
	process.env.MONGO_URL ||
	'mongodb+srv://admin:jHpkx@mesyacluster.jwf5l.mongodb.net/main?retryWrites=true&w=majority';

app.listen(PORT, () => {
	initRouters();
	app.use(express.json());
	app.use(router);
	mongoose.connect(DB_URL);
	console.log(`Server listening at http://localhost:${PORT}`);
});
