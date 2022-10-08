import { IUser, UserSchema } from '../../../models';
import { router } from '../../router';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  findUser,
  generateAccessToken,
  generatePassword,
  generateToken,
  getUserPublicProps,
  reportError,
  toType,
  verifyAccessToken,
} from '../../../utils';
import { Request, Response } from 'express';
import { RequestErrors } from '../../../enums';

export class AuthRoutes {
  private readonly ROUTE_API = '/auth';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.post(`${this.ROUTE_API}/sign-in`, this.signIn.bind(this));
    router.patch(`${this.ROUTE_API}/restore-password`, this.resetPassword.bind(this));

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
    const { login, password } = req.body || {};

    if (!login || !password) {
      reportError(res, RequestErrors.DataLack);

      return;
    }

    const user = await findUser({ $or: [{ login }, { email: login }] });
    
    if (user) {
      const isPasswordsMatch = await this.comparePasswords(password, user.password);
      console.log(isPasswordsMatch);

      if (isPasswordsMatch) {
        await this.proceedSignIn(res, user);
        return;
      }

      reportError(res, RequestErrors.WrongLoginPassword);

      return;
    }

    reportError(res, RequestErrors.WrongLoginPassword);
  }

  /**
   * Reset password
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async resetPassword(req: Request, res: Response) {
    const { login, oldPassword, password } = req.body || {};

    if (!login || !oldPassword || !password) {
      reportError(res, RequestErrors.DataLack);

      return;
    }

    const user = (await findUser({ $or: [{ login }, { email: login }] })) as any;

    if (user) {
      const isTheSamePass = await this.comparePasswords(password, user.password);

      if (isTheSamePass) {
        reportError(res, RequestErrors.SamePassword);
        return;
      }

      const isPasswordsMatch = await this.comparePasswords(oldPassword, user.password);
      if (isPasswordsMatch) {
        const hashedPassword = await generatePassword(password);

        user
          .update({
            password: hashedPassword,
          })
          .catch(() => null);

        return;
      }

      reportError(res, RequestErrors.WrongLoginPassword);

      return;
    }

    reportError(res, RequestErrors.WrongLoginPassword);
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
      reportError(res, RequestErrors.DataLack);
      return;
    }

    const user = await findUser({ email });

    if (user) {
      if (await this.handleSignUpPending(res, user, password)) {
        return;
      }

      reportError(res, RequestErrors.UserExist);
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
      reportError(res, RequestErrors.DataLack);
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res, {
      registrationState: true,
    });

    if (!decodedToken) {
      return;
    }

    const user = toType<IUser>(
      await UserSchema.findOneAndUpdate(
        { uuid: decodedToken.uuid },
        {
          name,
          surname,
          thirdname,
          school,
          state: 'registered',
        },
      ).lean().catch(() => null),
    );

    if (!user) {
      reportError(res, RequestErrors.UserLack);
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
      await UserSchema.create({
        uuid: uuidv4(),
        email,
        password: hashedPassword,
        roles: ['teacher'],
      }).catch(() => null),
    );

    if (!newUser) {
      reportError(res, RequestErrors.SystemError);
      return;
    }

    this.getRegistrationData(newUser, res);
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

    reportError(res, RequestErrors.SystemError);
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
    } as any;

    if (user.roles.some((role) => role === 'student')) {
      data['setNewPassword'] = true;
      delete data.completeRegister;
    }

    res.status(200).json({
      data,
    });

    return data;
  }
}
