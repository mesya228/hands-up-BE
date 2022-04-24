import { Router } from "express";
import { initCompanyRoutes } from "./routes";

export const router: Router = Router();

const routes = [initCompanyRoutes];

export const initRouters = () => routes.forEach((route) => route());
