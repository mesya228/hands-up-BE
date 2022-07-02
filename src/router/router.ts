import { Router } from 'express';
import { initAuthRoutes, initSchoolRoutes, initUserRoutes } from './routes';
import { initTokenRoutes } from './routes/token';

export const router: Router = Router();

const routes = [
  initAuthRoutes,
  initTokenRoutes,
  initUserRoutes,
  initSchoolRoutes,
];

export const initRouters = () => routes.forEach((route) => route());
