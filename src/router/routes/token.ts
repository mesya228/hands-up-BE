import { router } from '../router';

import jwt from 'jsonwebtoken';
import { verifyRefreshToken } from '../../utils';
import { UserToken } from '../../models/token';

const ROUTE_API = '/token/';

export const initTokenRoutes = () => {
  router.post(ROUTE_API + 'test', async (req, res) => {
    return res.status(200).json('I LOVE YOu');
  });

  /**
   * Refresh access token
   */
  router.post(ROUTE_API + 'refresh', async (req, res) => {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({ errors: ['Токен відсутній'] });
    }

    const token = await verifyRefreshToken(refreshToken).catch(() => null);

    if (!token) {
      return res.status(400).json({ errors: ['Неправильний токен'] });
    }

    const payload = {
      uuid: token.uuid,
      roles: token.roles,
      email: token.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_HASH || '', {
      expiresIn: '30m',
    });

    res.status(200).json({
      data: {
        accessToken,
      },
    });
  });

  /**
   * Sign up
   */
  router.post(ROUTE_API + 'delete', async (req, res) => {
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
  });
};
