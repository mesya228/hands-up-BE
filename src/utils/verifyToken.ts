import { UserToken } from '../models/token';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response } from 'express';
import { RequestErrors, TokenErrors } from '../enums';
import { ITokenPayload } from 'src/interfaces';
import { reportError } from './reportError';

export const verifyAccessToken = (
  accessToken: string | undefined,
  res: Response,
  config: IVerifyTokenConfig = {},
): ITokenPayload | null | undefined => {
  if (!accessToken) {
    reportError(res, RequestErrors.TokenLack);
    return null;
  }

  const decodedToken = jwt.decode(accessToken) as any;

  if (checkTokenAccess(res, config, decodedToken)) {
    return null;
  }

  try {
    const tokenResponse = jwt.verify(accessToken, process.env.ACCESS_TOKEN_HASH || 'accessTest') as JwtPayload;

    if (tokenResponse) {
      return decodedToken;
    }
  } catch (e: any) {
    const handler = tokenErrorHandlers[e.name];

    if (handler) {
      res.status(handler.code).send({ errors: handler.errors });
    }
  }
};

/**
 * Check token access rules
 *
 * @param  {Response} res
 * @param  {string} compareId?
 * @param  {boolean} registrationState?
 */
const checkTokenAccess = (res: Response, config: any, decodedToken: ITokenPayload) => {
  const { registrationState, compareId } = config;

  if (
    (!registrationState && decodedToken && decodedToken.state === 'pending') ||
    (registrationState && decodedToken && decodedToken.state === 'complete')
  ) {
    res.status(400).send({ errors: ['Реєстрацію не завершено'] });
    return true;
  }

  if (compareId && compareId !== decodedToken.uuid) {
    res.status(400).send({ errors: ['У доступі відмовлено'] });
    return true;
  }
};

export const verifyRefreshToken = (refreshToken: string): Promise<any> => {
  const privateKey = process.env.REFRESH_TOKEN_HASH || 'publicRefresh';

  return new Promise(async (resolve, reject) => {
    const token = await UserToken.findOne({ token: refreshToken }).catch(() => null) as any;

    if (!token) {
      return reject({ errors: ['Неправильний токен'] });
    }

    try {
      const tokenDetails = jwt.verify(token.token, privateKey);

      if (tokenDetails) {
        return resolve(tokenDetails);
      }

      return reject({ errors: ['Неправильний токен'] });
    } catch (e: any) {
      const handler = tokenErrorHandlers[e.name];
  
      if (handler) {
        return reject({ errors: ['Неправильний токен'] });
      }
    }
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
  [TokenErrors.NotBeforeError]: {
    errors: ['Помилка системи'],
    code: 400,
  },
};

interface IErrorHandlers {
  [key: string]: {
    errors: string[];
    code: number;
  };
}

interface IVerifyTokenConfig {
  registrationState?: boolean;
  compareId?: string;
}
