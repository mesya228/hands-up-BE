import { Router } from 'express';
import { initAuthRoutes, initUserRoutes } from './routes';
import { initTokenRoutes } from './routes/token';

export const router: Router = Router();

const routes = [initAuthRoutes, initTokenRoutes, initUserRoutes];

export const initRouters = () => routes.forEach((route) => route());
