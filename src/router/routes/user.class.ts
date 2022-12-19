import {
  ClassMarksSchema,
  ClassSchema,
  IClass,
  IClassMarks,
  ISchool,
  IStatistics,
  ISubject,
  IUser,
  SchoolSchema,
  StatisticsSchema,
  SubjectSchema,
  UserSchema,
} from '../../models';
import { router } from '../router';
import {
  findUser,
  findUsers,
  generatePassword,
  getClassPublicProps,
  getSimplePublicProps,
  getUserPublicProps,
  random,
  reportError,
  toType,
  transcriptPassword,
  verifyAccessToken,
} from '../../utils';
import { Request, Response } from 'express';
import { RequestErrors } from '../../enums';
import { v4 as uuidv4 } from 'uuid';

export class UserRoutes {
  private readonly ROUTE_API = '/user';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getUser.bind(this));
    router.get(`${this.ROUTE_API}/student`, this.findStudents.bind(this));
    router.get(`${this.ROUTE_API}/:uuid`, this.getUserById.bind(this));
    router.get(`${this.ROUTE_API}/:uuid/classes`, this.getClassesByUser.bind(this));
    router.get(`${this.ROUTE_API}/:uuid/subjects`, this.getSubjectsByUser.bind(this));
    router.patch(`${this.ROUTE_API}/:uuid/regenerate-password`, this.regeneratePassword.bind(this));
    router.post(`${this.ROUTE_API}/add-student`, this.addStudent.bind(this));
    router.delete(`${this.ROUTE_API}/:uuid`, this.deleteStudent.bind(this));
  }

  /**
   * Find user from token
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getUser(req: Request, res: Response) {
    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const user = toType<IUser>(
      await UserSchema.findOne({ uuid: decodedToken.uuid }).catch(() => {
        res.status(404).send({ errors: ['Користувача не знайдено'] });
      }),
    );

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    if (user.school) {
      const school = toType<ISchool>(await SchoolSchema.findOne({ id: user.school }).catch(() => null));

      if (school) {
        user.school = getSimplePublicProps(school);
      }
    }

    res.status(200).send({ data: getUserPublicProps(user) });
  }

  /**
   * Find user from token
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async findStudents(req: Request, res: Response) {
    const { query } = req.query || {};
    const parsedQuery = ((query || '') as string).trim();

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const users = toType<IUser[]>(
      await UserSchema.find({
        roles: 'student',
        $or: [
          { name: { $regex: parsedQuery, $options: 'i' } },
          { surname: { $regex: parsedQuery, $options: 'i' } },
          { thirdname: { $regex: parsedQuery, $options: 'i' } },
        ],
      }).catch(() => {
        res.status(404).send({ errors: ['Користувачів не знайдено'] });
      }),
    );

    res.status(200).send({ data: users.map((user) => getUserPublicProps(user)) });
  }

  /**
   * Find user by uuid
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getUserById(req: Request, res: Response) {
    const uuid = req.params.uuid;

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = toType<IUser>(await UserSchema.findOne({ uuid }).catch(() => null));

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    if (user.school) {
      const school = toType<ISchool>(await SchoolSchema.findOne({ id: user.school }).catch(() => null));

      if (school) {
        user.school = getSimplePublicProps(school);
      }
    }

    res.status(200).send({ data: getUserPublicProps(user) });
  }

  /**
   * Find classes by user id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClassesByUser(req: Request, res: Response) {
    const { uuid } = req.params || {};
    const { subjectId } = req.query || {};

    if (!subjectId) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classMarks = toType<IClassMarks[]>(
      await ClassMarksSchema.find({ subjectId, teachers: uuid }).catch(() => []),
    );

    const classesId = classMarks?.map((c) => c.classId);

    const classes = toType<IClass[]>(
      await ClassSchema.find({
        id: classesId,
      }).catch(() => []),
    );

    res.status(200).send({
      data: classes.map((classItem) => getClassPublicProps(classItem)),
    });
  }

  /**
   * Find subjects by user id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getSubjectsByUser(req: Request, res: Response) {
    const uuid = req.params.uuid;

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = toType<IUser>(await UserSchema.findOne({ uuid }).catch(() => null));

    if (!user) {
      res.status(404).send({ errors: ['Користовача не знайдено'] });
    }

    const subjects = toType<ISubject[]>(
      await SubjectSchema.find({
        id: {
          $in: user?.subjects,
        },
      }).catch(() => []),
    );

    res.status(200).send({
      data: subjects.map((subject) => getSimplePublicProps(subject)),
    });
  }

  /**
   * Create student
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async deleteStudent(req: Request, res: Response) {
    const { uuid } = req.params || {};

    if (!uuid) {
      reportError(res, RequestErrors.DataLack);
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const user = toType<IUser>(await UserSchema.findOne({ uuid }));

    const classes = await ClassSchema.find({});
    classes.forEach(async (classItem) => {
      if (!user?.classes?.includes(classItem.id)) {
        return;
      }
      
      await ClassSchema.findOneAndUpdate(
        { id: classItem.id },
        {
          $pull: {
            students: uuid as any,
          }
        }
      );
    });

    await StatisticsSchema.findOneAndDelete({ uuid });
    
    await UserSchema.findOneAndDelete({ uuid });

    res.status(200).json({
      data: { success: true },
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

    const teacher = await findUser({ uuid: decodedToken.uuid });

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

    const existedUsers = await findUsers({ login: { $regex: login, $options: 'i' } });

    if (existedUsers.length) {
      login += existedUsers.length + 1;
    }

    const hashedPassword = await generatePassword(password);

    const newUser = toType<IUser>(
      await UserSchema.create({
        uuid: uuidv4(),
        login,
        name,
        surname,
        school: schoolId,
        subjects: [subjectId],
        classes: [classId],
        password: transcriptPassword(hashedPassword),
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

  /*
   * Return generated from name and surname username and password
   */
  private getLoginAndPassword(name?: string, surname?: string): { login: string; password: string } {
    if (!name || !surname) {
      return {
        login: '',
        password: '',
    };
  }

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
    return toType<IStatistics>(StatisticsSchema.create({ uuid: userId }).catch(() => null));
  }

  /**
   * Get student password
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async regeneratePassword(req: Request, res: Response) {
    const uuid = req.params.uuid;
    const { classId } = req.query || {};

    if (!classId || !uuid) {
      return reportError(res, RequestErrors.DataLack);
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const studentClass = toType<IClass>(await ClassSchema.findOne({ students: uuid }));

    if (!studentClass?.students?.includes(uuid)) {
      return reportError(res, RequestErrors.AccessDenied);
    }
    const teacher = await findUser({ uuid: decodedToken.uuid });
    if (!(teacher?.classes as string[]).includes(classId as string)) {
      return reportError(res, RequestErrors.AccessDenied);
    }

    const user = await UserSchema.findOne({ uuid }).catch(() => null);

    if (!user) {
      res.status(404).send({ errors: ['Користовача не знайдено'] });
      return;
    }

    const { password } = this.getLoginAndPassword(user?.name, user.surname);
    const hashedPass = await generatePassword(password);
    await UserSchema.updateOne({ uuid }, { password: hashedPass });
    res.status(200).send({ data: transcriptPassword(password) });
  }
}
