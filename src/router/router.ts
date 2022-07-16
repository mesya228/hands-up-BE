import { Router } from 'express';
import * as routes from './routes';

export const router: Router = Router();

export const initRouters = () =>
  Object.values(routes).forEach((route) => new route());
