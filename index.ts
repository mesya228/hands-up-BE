import express from 'express';
import mongoose from 'mongoose';
import { initRouters, router } from './src/router/router';
const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

app.listen(PORT, () => {
  initRouters();
  app.use(express.json());
  app.use(router);
  mongoose.connect(DB_URL);
  console.log(`Server listening at ${PORT} port`);
});
