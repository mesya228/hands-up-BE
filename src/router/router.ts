import { Router } from 'express';
import { initUserRoutes } from './routes';

export const router: Router = Router();

const routes = [initUserRoutes];

export const initRouters = () => routes.forEach((route) => route());
