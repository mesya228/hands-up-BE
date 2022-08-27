import { initRouters, router } from 'src/router/router';
import express from 'express';
import formData from 'express-form-data';


export function getApp() {
  const app = express();

  initRouters();
  app.use(express.json());
  app.use(formData.parse({}));
  app.use(router);
  
  return app;
}

export function updateMock() {
  return () => ({ catch: () => {} });
}
