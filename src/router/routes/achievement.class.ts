import { router } from '../router';
import {
  getAchievements,
  getSimplePublicProps,
  reportError,
  toType,
  verifyAccessToken,
} from '../../utils';
import { AchievmentSchema, IAchievment } from '../../models';
import { Request, Response } from 'express';
import { RequestErrors } from '../../enums';
import { v4 as uuidv4 } from 'uuid';

export class AchievmentRoutes {
  private readonly ROUTE_API = '/achievements';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getAchievements.bind(this));
    router.post(`${this.ROUTE_API}`, this.createAchievment.bind(this));
  }

  /**
   * Get achievements
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getAchievements(req: Request, res: Response) {
    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const achievements = await getAchievements();

    if (!achievements.length) {
      reportError(res, RequestErrors.AchievementsLack);
      return;
    }

    res.status(200).send({
      data: achievements.map((classItem) => getSimplePublicProps(classItem)),
    });
  }

  /**
   * Create achievment
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async createAchievment(req: Request, res: Response) {
    const { name } = req.body || {};

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const newAchievment = toType<IAchievment>(
      AchievmentSchema.create({ id: uuidv4(), name }).catch(() => null),
    );

    if (!newAchievment) {
      reportError(res, RequestErrors.SystemError);
      return;
    }

    res.status(200).send({
      data: {
        success: true,
      }
    });
  }
}
