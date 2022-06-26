import { router } from '../router';

import jwt from 'jsonwebtoken';
import { verifyRefreshToken } from '../../utils';
import { UserToken } from '../../models/token';

const ROUTE_API = '/token/';

export const initTokenRoutes = () => {
  /**
   * Refresh access token
   */
  router.post(ROUTE_API + 'refresh', async (req, res) => {
    const { refreshToken } = req.body || {};

    if (!refreshToken) {
      return res.status(400).json({ errors: ['Токен відсутній'] });
    }

    const token = await verifyRefreshToken(refreshToken).catch((err) =>
      res.status(400).json(err)
    );

    const payload = { uuid: token.uuid, roles: token.roles };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_HASH || '', {
      expiresIn: '5m',
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

      if (!refreshToken)
        return res.status(400).json({ errors: ['Неправильний'] });

      const userToken = await UserToken.findOne({
        token: refreshToken,
      });

      if (!userToken) {
        return res.status(200).json({ data: { success: true } });
      }

      await userToken.remove();
      res.status(200).json({ data: { success: true } });
    } catch (err) {
      console.log(err);
      res.status(500).json({ data: { success: false } });
    }
  });
};
