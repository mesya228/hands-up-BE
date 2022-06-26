import jwt from 'jsonwebtoken';
import { IUser } from 'src/models';
import { UserToken } from '../models/token';

export const generateToken = async (user: IUser) => {
  try {
    const payload = { uuid: user.uuid, roles: user.roles };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_HASH || 'publicAccess',
      {
        expiresIn: '5m',
      }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_HASH || 'publicRefresh',
      {
        expiresIn: '30d',
      }
    );

    const userToken = await UserToken.findOne({ uuid: user.uuid });
    if (userToken) await userToken.remove();

    await new UserToken({ uuid: user.uuid, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export default generateToken;
