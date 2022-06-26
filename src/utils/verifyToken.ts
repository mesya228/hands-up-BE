import { UserToken } from '../models/token';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { TokenErrors } from '../enums';

export const verifyAccessToken = (
  accessToken: string,
  res: Response
): boolean => {
  if (!accessToken) {
    res.status(404).send({ errors: ['Токен відсутній'] });
    return false;
  }

  let isValid: boolean = false;

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_HASH || '',
    (tokenResponse) => {
      if (!tokenResponse) {
        isValid = true;
        return;
      }

      isValid = true;

      const handler = tokenErrorHandlers[tokenResponse.name];
      if (handler) {
        res.status(handler.code).send({ errors: handler.errors });
      }
    }
  );


  return isValid;
};

export const verifyRefreshToken = (refreshToken: string): Promise<any> => {
  const privateKey = process.env.REFRESH_TOKEN_HASH || '';

  return new Promise((resolve, reject) => {
    UserToken.findOne({ token: refreshToken }, (err: any, token: any) => {
      if (!token) {
        return reject({ errors: ['Неправильний токен'] });
      }

      jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
        if (err) {
          return reject({ errors: ['Неправильний токен'] });
        }

        resolve(tokenDetails);
      });
    });
  });
};

const tokenErrorHandlers: IErrorHandlers = {
  [TokenErrors.TokenExpiredError]: {
    errors: ['Час токену вийшов'],
    code: 401,
  },
  [TokenErrors.JsonWebTokenError]: {
    errors: ['Неправильний формат токена'],
    code: 400,
  },
};

interface IErrorHandlers {
  [key: string]: {
    errors: string[];
    code: number;
  };
}
