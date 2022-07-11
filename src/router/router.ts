import { Router } from 'express';
import {
  AuthRoutes,
  ClassRoutes,
  SchoolRoutes,
  TokenRoutes,
  UserRoutes,
} from './routes';

export const router: Router = Router();

const routes = {
  authRoutes: { constructor: AuthRoutes },
  tokenRoutes: { constructor: TokenRoutes },
  userRoutes: { constructor: UserRoutes },
  classRoutes: { constructor: ClassRoutes },
  schoolRoutes: { constructor: SchoolRoutes },
};

export const initRouters = () =>
  Object.values(routes).forEach((route) => new route.constructor());
