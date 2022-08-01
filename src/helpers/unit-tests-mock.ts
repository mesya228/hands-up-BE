import { initRouters, router } from 'src/router/router';
import express from 'express';
import formData from 'express-form-data';
// import mongoose from 'mongoose';
// const DB_URL = process.env.DB_URL as string;

export function getApp() {
  const app = express();

  initRouters();
  app.use(express.json());
  app.use(formData.parse({}));
  app.use(router);
  // mongoose.connect('mongodb+srv://mesya:3bxmhWHMGizA2JPT@cluster0.ob5ev.mongodb.net/main?retryWrites=true&w=majority');

  return app;
}
