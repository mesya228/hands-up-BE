import { Router } from 'express';
import { initAuthRoutes, initUserRoutes } from './routes';

export const router: Router = Router();

const routes = [initUserRoutes, initAuthRoutes];

export const initRouters = () => routes.forEach((route) => route());
