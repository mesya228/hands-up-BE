import { IUser, User } from '../../models';
import { router } from '../router';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import {
  generateToken,
  getUserPublicProps,
  verifyAccessToken,
} from '../../utils';

const ROUTE_API = '/auth';
const SALT: number | any = process.env.SALT;

export const initAuthRoutes = () => {
  /**
   * Sign in
   */
  router.post(`${ROUTE_API}/sign-in`, async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({
        errors: ['Неправильні пошта або пароль'],
      });

      return;
    }

    const user = await User.findOne({ email }).catch((e) => {
      res.status(400).json({
        errors: ['Помилка системи, спробуйте пізніше!'],
      });
    });

    if (user) {
      bcrypt.compare(
        password,
        user.password || '',
        async (err: any, passwordsMatch: boolean) => {
          if (passwordsMatch) {
            const token = await generateToken(user as IUser).catch(() => null);

            if (token) {
              res.status(200).json({
                data: { user: getUserPublicProps(user as IUser), token },
              });

              return;
            }

            res.status(400).json({
              errors: ['Помилка системи, спробуйте пізніше!'],
            });
            return;
          }

          res.status(400).json({
            errors: ['Неправильні пошта або пароль'],
          });
        }
      );

      return;
    }

    res.status(400).json({
      errors: ['Неправильні пошта або пароль'],
    });
  });

  /**
   * Sign up
   */
  router.post(`${ROUTE_API}/sign-up`, async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({
        errors: ['Неправильні пошта або пароль'],
      });
      return;
    }

    const user = await User.findOne({ email }).catch(() => {
      res.status(400).json({
        errors: ['Помилка системи, спробуйте пізніше'],
      });
    });

    if (user) {
      res.status(400).json({
        errors: ['Користувач з такими даними вже є'],
      });
      return;
    }

    bcrypt.genSalt(SALT, async (err: any, salt: string) => {
      bcrypt.hash(password, salt, async (err: any, hashedPassword: string) => {
        const newUser = await User.create({
          uuid: uuidv4(),
          email,
          password: hashedPassword,
          roles: ['teacher'],
        }).catch(() => null);

        if (!newUser) {
          res.status(400).json({
            errors: ['Помилка системи, спробуйте пізніше'],
          });
          return;
        }

        res.status(201).json({
          data: getUserPublicProps(newUser as IUser),
        });
      });
    });
  });

  /**
   * Sign up start
   */
  router.post(`${ROUTE_API}/sign-up-start`, async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({
        errors: ['Неправильні пошта або пароль'],
      });
      return;
    }

    const user = await User.findOne({ email }).catch(() => {
      res.status(400).json({
        errors: ['Помилка системи, спробуйте пізніше'],
      });
    });

    if (user) {
      res.status(400).json({
        errors: ['Користувач з такою поштою вже зареєстрован'],
      });
      return;
    }

    bcrypt.genSalt(SALT, async (err: any, salt: string) => {
      bcrypt.hash(password, salt, async (err: any, hashedPassword: string) => {
        const newUser = (await User.create({
          uuid: uuidv4(),
          email,
          password: hashedPassword,
          roles: ['teacher'],
        }).catch(() => null)) as IUser;

        if (!newUser) {
          res.status(400).json({
            errors: ['Помилка системи, спробуйте пізніше'],
          });
          return;
        }

        const accessToken = jwt.sign(
          {
            uuid: newUser.uuid,
            roles: newUser.roles,
            email: newUser.email,
            state: newUser.state,
          },
          process.env.ACCESS_TOKEN_HASH || 'publicAccess',
          {
            expiresIn: '30m',
          }
        );

        res.status(201).json({
          data: {
            user: {
              uuid: newUser.uuid,
            },
            token: { accessToken },
          },
        });
      });
    });
  });

  /**
   * Sign up finish
   */
  router.patch(`${ROUTE_API}/sign-up-finish/:uuid`, async (req: any, res) => {
    const { uuid } = req.params || {};
    const { name, surname, thirdname, school } = req.body || {};

    if (!name || !surname || !thirdname || !school) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res, true)) {
      return;
    }

    const user = await User.updateOne({
      uuid,
      name,
      surname,
      thirdname,
      school,
      state: 'registered',
    }).catch(() => null);

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    res.status(200).send({ data: true });
  });
};
