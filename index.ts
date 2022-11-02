import express from 'express';
import mongoose from 'mongoose';
import formData from 'express-form-data';
import cors from 'cors';
import { initRouters, router } from './src/router/router';

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL as string;

app.listen(PORT, () => {
  initRouters();

  app.use(express.json());
  app.use(
    cors({
      origin: [
        'http://localhost:4200',
        'https://handsup-63bb3.web.app',
        'https://hands-up.vercel.app',
      ],
    }),
  );
  app.use(formData.parse({}));
  app.use(router);

  mongoose.connect(DB_URL);

  console.log(`Server listening at ${PORT} port`);
});
