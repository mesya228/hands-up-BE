import { router } from '../router';
import {
  getClassPublicProps,
  getSimplePublicProps,
  getUserPublicProps,
  toType,
  verifyAccessToken,
} from '../../utils';
import { IClass, ClassSchema, School, User, ISchool, IUser } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export class ClassRoutes {
  private readonly ROUTE_API = '/class';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getClasses.bind(this));
    router.get(`${this.ROUTE_API}/:id/users`, this.getUsersByClass.bind(this));
    router.post(`${this.ROUTE_API}`, this.createClass.bind(this));
  }

  /**
   * Get classes
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClasses(req: Request, res: Response) {
    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classes = toType<IClass[]>(await ClassSchema.find({}).catch(() => null));

    if (!classes) {
      res.status(404).send({ errors: ['Клас не знайдено'] });
      return;
    }

    res.status(200).send({
      data: (classes as IClass[]).map((classItem) =>
        getClassPublicProps(classItem)
      ),
    });
  }

  /**
   * Create class
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async createClass(req: Request, res: Response) {
    const { name, schoolId, students } = req.body || {};
    const parsedName = (name || '').trim();

    if (!name) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const foundClass = await ClassSchema.findOne({ name: parsedName, schoolId }).catch(() => {
      res.status(404).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (foundClass) {
      res.status(400).send({ errors: ['Клас з такою назвою вже існує'] });
      return;
    }

    const newClass = await ClassSchema.create({ id: uuidv4(), name, schoolId, students }).catch(() => {
      res.status(400).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (newClass) {
      res.status(200).send({ data: getSimplePublicProps(newClass) });
    }
  }

  /**
   * Find users by class id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getUsersByClass(req: Request, res: Response) {
    const classId = req.params.id;

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const school = toType<ISchool>(await School.findOne({ classes: classId }).catch(
      () => null
    ));


    const users = toType<IUser[]>(await User.find({
      classes: classId,
      school: school?.id,
    }).catch(() => null));

    if (!users?.length) {
      res.status(404).send({ errors: ['Користовачів не знайдено'] });
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

    res.status(200).send({ data: parsedUsers });
  }
}
