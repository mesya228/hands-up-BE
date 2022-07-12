import jwt from 'jsonwebtoken';
import { ITokenPayload } from 'src/interfaces';
import { IUser } from '../../src/models';
import { UserToken } from '../models/token';

export const generateToken = async (user: IUser) => {
  try {
    const payload = {
      uuid: user.uuid,
      email: user.email,
      roles: user.roles,
      state: user.state,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_HASH || 'publicRefresh',
      {
        expiresIn: '30d',
      }
    );

    const userToken = await UserToken.findOne({ uuid: user.uuid });
    if (userToken) await userToken.remove();

    await UserToken.create({ uuid: user.uuid, token: refreshToken });
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const generateAccessToken = (payload: ITokenPayload | any): string => {
  const { uuid, email, roles, state } = payload;

  return jwt.sign(
    { uuid, email, roles, state },
    process.env.ACCESS_TOKEN_HASH || 'publicAccess',
    {
      expiresIn: '30m',
    }
  );
};
