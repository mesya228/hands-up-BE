import { ClassSchema, IClass, IUser, User, StatisticsSchema, IStatistics } from '../../../models';
import { router } from '../../router';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
  generateAccessToken,
  generatePassword,
  generateToken,
  getUserPublicProps,
  random,
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
    router.post(`${this.ROUTE_API}/add-student`, this.addStudent.bind(this));

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

    const user = await this.findUser({ $or: [{ login }, { email: login }] });

    if (user) {
      const isPasswordsMatch = await this.comparePasswords(password, user.password);

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

    const user = await this.findUser({ email });

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
   * Create student
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async addStudent(req: Request, res: Response) {
    const { name, surname, classId, subjectId } = req.body || {};

    if (!name || !surname || !classId || !subjectId) {
      reportError(res, RequestErrors.DataLack);
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const teacher = await this.findUser({ email: decodedToken.email });
    
    this.createNewStudent(res, { ...req.body, schoolId: teacher?.school });
  }

  /**
   * @param  {Response} res
   * @param  {string} password
   * @param  {string} email
   */
  private async createNewStudent(res: Response, body: any) {
    const { name, surname, classId, subjectId, schoolId } = body || {};

    if (!name || !surname || !classId || !subjectId || !schoolId) {
      reportError(res, RequestErrors.DataLack);
      return;
    }

    let { login, password } = this.getLoginAndPassword(name, surname);

    const existedUsers = await this.findUsers({ login: { $regex: login, $options: 'i' } });

    if (existedUsers.length) {
      login += existedUsers.length + 1;
    }

    const hashedPassword = await generatePassword(password);

    const newUser = toType<IUser>(
      await User.create({
        uuid: uuidv4(),
        login,
        name,
        surname,
        school: schoolId,
        subjects: [subjectId],
        classes: [classId],
        password: hashedPassword,
        roles: ['student'],
        state: 'registered',
      }).catch(() => null),
    );

    if (!newUser) {
      reportError(res, RequestErrors.SystemError);
      return;
    }

    res.status(200).json({
      data: { ...getUserPublicProps(newUser), password },
    });

    await this.addStudentToClass(classId, newUser.uuid);
    await this.createUserStatistics(newUser.uuid);
  }

  /**
   * Add student to class in DB
   * 
   * @param  {string} classId
   * @param  {string} userId
   */
  private async addStudentToClass(classId: string, userId: string) {
    return toType<IClass>(
      ClassSchema.findOneAndUpdate(
        { uuid: classId },
        {
          $push: {
            students: userId as any,
          },
        },
      ).catch(() => null),
    );
  }

  /**
   * Add student to class in DB
   * 
   * @param  {string} classId
   * @param  {string} userId
   */
  private async createUserStatistics(userId: string) {
    return toType<IStatistics>(
      StatisticsSchema.create(
        { uuid: userId },
      ).catch(() => null),
    );
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
      reportError(res, RequestErrors.SystemError);
      return;
    }

    this.getRegistrationData(newUser, res);
  }

  /*
   * Return generated from name and surname username and password
   */
  private getLoginAndPassword(name: string, surname: string): { login: string; password: string } {
    const namePass = name.slice(0, 1).toUpperCase();
    const splitSymbols = ['_', '.', '-'];
    const randomSymbol = splitSymbols[random(0, splitSymbols.length - 1)];
    const surnamePass = surname.charAt(0).toUpperCase() + surname.slice(1);
    const numbersPass = random(1000, 9999);
    let login = `${namePass}${surnamePass}`;

    const password = `${namePass}${surnamePass}${randomSymbol}${numbersPass}`;

    return { login, password };
  }

  /**
   * @param  {any} queryObj
   */
  private async findUser(queryObj: any): Promise<IUser | null> {
    return toType<IUser>(await User.findOne(queryObj).catch(() => null));
  }

  /**
   * @param  {any} queryObj
   */
  private async findUsers(queryObj: any): Promise<IUser[]> {
    return toType<IUser[]>(await User.find(queryObj).catch(() => []));
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
