import { Router } from 'express';
import { initAuthRoutes, initGenerateRoutes, initImageRoutes } from './routes';

export const router: Router = Router();

const routes = [initAuthRoutes, initGenerateRoutes, initImageRoutes];

export const initRouters = () => routes.forEach((route) => route());
