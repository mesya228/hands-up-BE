import { IUser, User } from '../../models';
import { router } from '../router';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateToken, getUserPublicProps } from '../../utils';

const ROUTE_API = '/auth/';
const SALT: number | any = process.env.SALT;

export const initAuthRoutes = () => {
  /**
   * Sign in
   */
  router.post(ROUTE_API + 'sign-in', async (req, res) => {
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
  router.post(ROUTE_API + 'sign-up', async (req, res) => {
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
          roles: ['student'],
        }).catch(() => {
          res.status(400).json({
            errors: ['Помилка системи, спробуйте пізніше'],
          });
        });

        if (!newUser) {
          res.status(400).json({
            errors: ['Помилка системи, спробуйте пізніше'],
          });
        }

        res.status(201).json({
          data: getUserPublicProps(newUser as IUser),
        });
      });
    });
  });
};
