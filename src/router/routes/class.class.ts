import { router } from '../router';
import {
  getClassPublicProps,
  getSimplePublicProps,
  getUserPublicProps,
  reportError,
  toType,
  verifyAccessToken,
} from '../../utils';
import { IClass, ClassSchema, School, User, ISchool, IUser } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { RequestErrors } from '../../enums';

export class ClassRoutes {
  private readonly ROUTE_API = '/class';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getClasses.bind(this));
    router.get(`${this.ROUTE_API}/:id`, this.getClass.bind(this));
    router.post(`${this.ROUTE_API}`, this.createClass.bind(this));
  }

  /**
   * Get classes
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClasses(req: Request, res: Response) {
    const { query } = req.query || {};

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const classes = toType<IClass[]>(await ClassSchema.find({
      name: { $regex: query, $options: 'i' },
    }).catch(() => []));

    if (!classes.length) {
      reportError(res, RequestErrors.ClassLack);
      return;
    }

    res.status(200).send({
      data: classes.map((classItem) => getClassPublicProps(classItem)),
    });
  }

  /**
   * Create class
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async createClass(req: Request, res: Response) {
    const { name, schoolId } = req.body || {};
    const parsedName = (name || '').trim();

    if (!name) {
      reportError(res, RequestErrors.DataLack);
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const foundClass = await ClassSchema.findOne({ name: parsedName, schoolId }).catch(() => null);

    if (foundClass) {
      reportError(res, RequestErrors.ClassExist);
      return;
    }

    const newClass = await ClassSchema.create({ id: uuidv4(), name, schoolId }).catch(() => null);

    if (!newClass) {
      reportError(res, RequestErrors.SystemError);
      return;
    }

    if (newClass) {
      res.status(200).send({ data: getSimplePublicProps(newClass) });
    }
  }

  /**
   * Get class by id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClass(req: Request, res: Response) {
    const classId = req.params.id;

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classData = toType<IClass>(await ClassSchema.findOne({ id: classId }).catch(() => null));

    if (!classData) {
      return reportError(res, RequestErrors.ClassLack);
    }

    const school = toType<ISchool>(await School.findOne({ classes: classId }).catch(() => null));

    const users = toType<IUser[]>(
      await User.find({
        classes: classId,
        school: school?.id,
        role: 'student'
      }).catch(() => []),
    );

    if (!users?.length) {
      reportError(res, RequestErrors.UsersLack);
      return;
    }

    const parsedUsers: IUser[] = [];

    if (school) {
      users.forEach((user: any) => {
        const publicUser = getUserPublicProps(user);
        publicUser.school = getSimplePublicProps(school);

        parsedUsers.push(publicUser);
      });
    }

    res.status(200).send({
      data: {
        ...getClassPublicProps(classData),
        students: parsedUsers,
      },
    });
  }
}
