import { router } from '../router';

import { generateAccessToken, verifyRefreshToken } from '../../utils';
import { UserToken } from '../../models/token';
import { Request, Response } from 'express';

export class TokenRoutes {
  private readonly ROUTE_API = '/token';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.post(`${this.ROUTE_API}/test`, async (req, res) => {
      return res.status(200).json('I LOVE YOu');
    });

    router.post(`${this.ROUTE_API}/refresh`, this.refreshToken.bind(this));
    router.post(`${this.ROUTE_API}/delete`, this.deleteToken.bind(this));
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   */
  private async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({ errors: ['Токен відсутній'] });
    }

    const token = await verifyRefreshToken(refreshToken).catch(() => null);

    if (!token) {
      return res.status(400).json({ errors: ['Неправильний токен'] });
    }

    const accessToken = generateAccessToken(token);
    
    res.status(200).json({
      data: {
        accessToken,
      },
    });
  }
  
  /**
   * @param  {Request} req
   * @param  {Response} res
   */
  private async deleteToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body || {};

      if (!refreshToken) {
        return res.status(400).json({ errors: ['Неправильний токен'] });
      }

      const userToken = await UserToken.findOne({
        token: refreshToken,
      });

      if (!userToken) {
        return res.status(200).json({ data: { success: true } });
      }

      await userToken.remove();
      res.status(200).json({ data: { success: true } });
    } catch (err) {
      res.status(500).json({ data: { success: false } });
    }
  }
}
