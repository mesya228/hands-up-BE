import { Router } from 'express';
import {
  AuthRoutes,
  ClassMarksRoutes,
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
  classMarksRoutes: { constructor: ClassMarksRoutes },
  schoolRoutes: { constructor: SchoolRoutes },
};

export const initRouters = () =>
  Object.values(routes).forEach((route) => new route.constructor());
