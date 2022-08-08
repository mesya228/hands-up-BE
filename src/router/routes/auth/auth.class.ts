import { IUser, User } from '../../../models';
import { router } from '../../router';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  generateAccessToken,
  generatePassword,
  generateToken,
  getUserPublicProps,
  toType,
  verifyAccessToken,
} from '../../../utils';
import { Request, Response } from 'express';

export class AuthRoutes {
  private readonly ROUTE_API = '/auth';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.post(`${this.ROUTE_API}/sign-in`, this.signIn.bind(this));
    router.post(`${this.ROUTE_API}/sign-up-start`, this.signUpStart.bind(this));
    router.patch(`${this.ROUTE_API}/sign-up-finish`, this.signUpFinish.bind(this));
  }

  /**
   * Sign in
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async signIn(req: Request, res: Response) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({
        errors: ['Не всі дані заповнено'],
      });

      return;
    }

    const user = await this.getUserByEmail(email);

    if (user) {
      const isPasswordsMatch = await this.comparePasswords(password, user.password);

      if (isPasswordsMatch) {
        await this.proceedSignIn(res, user);
        return;
      }

      res.status(400).json({
        errors: ['Неправильні пошта або пароль'],
      });

      return;
    }

    res.status(400).json({
      errors: ['Неправильні пошта або пароль'],
    });
  }

  /**
   * Start sign up
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async signUpStart(req: Request, res: Response) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({
        errors: ['Не всі дані заповнено'],
      });
      return;
    }

    const user = await this.getUserByEmail(email);

    if (user) {
      if (await this.handleSignUpPending(res, user, password)) {
        return;
      }

      res.status(400).json({
        errors: ['Користувач з такою поштою вже зареєстрований'],
      });
      return;
    }

    this.createNewUser(res, password, email);
  }

  /**
   * Finish sign up
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async signUpFinish(req: Request, res: Response) {
    const { name, surname, thirdname, school } = req.body || {};

    if (!name || !surname || !thirdname || !school) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res, {
      registrationState: true,
    });

    if (!decodedToken) {
      return;
    }

    const user = toType<IUser>(
      await User.findOneAndUpdate(
        { uuid: decodedToken.uuid },
        {
          name,
          surname,
          thirdname,
          school,
          state: 'registered',
        },
      ).catch(() => null),
    );

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    const token = await generateToken(user).catch(() => null);

    res.status(200).send({
      data: {
        user: getUserPublicProps(user),
        token,
      },
    });
  }

  /**
   * @param  {Response} res
   * @param  {string} password
   * @param  {string} email
   */
  private async createNewUser(res: Response, password: string, email: string) {
    const hashedPassword = await generatePassword(password);

    const newUser = toType<IUser>(
      await User.create({
        uuid: uuidv4(),
        email,
        password: hashedPassword,
        roles: ['teacher'],
      }).catch(() => null),
    );

    if (!newUser) {
      res.status(400).json({
        errors: ['Помилка системи, спробуйте пізніше'],
      });
      return;
    }

    this.getRegistrationData(newUser, res);
  }

  /**
   * @param  {string} email
   */
  private async getUserByEmail(email: string): Promise<IUser | null> {
    return toType<IUser>(await User.findOne({ email }).catch(() => null));
  }

  /**
   * @param  {Response} res
   * @param  {IUser} user
   */
  private async proceedSignIn(res: Response, user: IUser) {
    if (user.state === 'pending') {
      this.getRegistrationData(user, res);
      return;
    }

    const token = await generateToken(user).catch(() => null);

    if (token) {
      res.status(200).json({
        data: { user: getUserPublicProps(user), token },
      });

      return;
    }

    res.status(400).json({
      errors: ['Помилка системи, спробуйте пізніше!'],
    });
    return;
  }

  /**
   * @param  {string} password1
   * @param  {string=''} password2 ONLY hashed password!
   */
  private async comparePasswords(password: string, hashedPassword: string = ''): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * @param  {Response} res
   * @param  {IUser} user
   * @param  {string} password
   */
  private async handleSignUpPending(res: Response, user: IUser, password: string): Promise<boolean> {
    if (user.state !== 'pending') {
      return false;
    }

    const passwordsMatch = await this.comparePasswords(password, user.password);
    if (passwordsMatch) {
      this.getRegistrationData(user, res);
      return true;
    }

    return false;
  }

  /**
   * Get registration on progress state data
   *
   * @param  {IUser} user
   * @param  {Response} res
   */
  private getRegistrationData(user: IUser, res: Response) {
    const accessToken = generateAccessToken(user);

    const data = {
      completeRegister: true,
      user: {
        uuid: user.uuid,
      },
      token: { accessToken },
    };

    res.status(200).json({
      data,
    });

    return data;
  }
}