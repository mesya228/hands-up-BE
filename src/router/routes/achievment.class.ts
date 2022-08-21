import { router } from '../router';
import {
  getAchievments,
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
  private readonly ROUTE_API = '/achievments';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getAchievments.bind(this));
    router.post(`${this.ROUTE_API}`, this.createAchievment.bind(this));
  }

  /**
   * Get achievments
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getAchievments(req: Request, res: Response) {
    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const achievments = await getAchievments();

    if (!achievments.length) {
      reportError(res, RequestErrors.AchievmentsLack);
      return;
    }

    res.status(200).send({
      data: achievments.map((classItem) => getSimplePublicProps(classItem)),
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
