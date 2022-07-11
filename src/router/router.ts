import { Router } from 'express';
import { AuthRoutes, ClassRoutes, SchoolRoutes, UserRoutes } from './routes';
import { TokenRoutes } from './routes/token';

export const router: Router = Router();

const routes = {
  authRoutes: { constructor: AuthRoutes },
  userRoutes: { constructor: UserRoutes },
  tokenRoutes: { constructor: TokenRoutes },
  classRoutes: { constructor: ClassRoutes },
  schoolRoutes: { constructor: SchoolRoutes },
};

export const initRouters = () =>
  Object.values(routes).forEach((route) => new route.constructor());
