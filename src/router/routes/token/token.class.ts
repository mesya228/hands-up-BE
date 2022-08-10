import { router } from '../../router';

import { generateAccessToken, reportError, verifyRefreshToken } from '../../../utils';
import { UserToken } from '../../../models/token';
import { Request, Response } from 'express';
import { RequestErrors } from '../../../enums';

export class TokenRoutes {
  private readonly ROUTE_API = '/token';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.post(`${this.ROUTE_API}/refresh`, this.refreshToken.bind(this));
    router.delete(`${this.ROUTE_API}`, this.deleteToken.bind(this));
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   */
  private async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return reportError(res, RequestErrors.TokenLack);
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
        return reportError(res, RequestErrors.TokenLack);
      }

      const userToken = await UserToken.findOne({
        token: refreshToken,
      }).catch(() => null);

      if (!userToken) {
        return reportError(res, RequestErrors.TokenLack);
      }

      await userToken.remove();
      res.status(200).json({ data: { success: true } });
    } catch (e) {
      res.status(500).json({ data: { success: false } });
    }
  }
}
