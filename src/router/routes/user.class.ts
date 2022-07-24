import {
  ClassSchema,
  IClass,
  ISchool,
  ISubject,
  IUser,
  School,
  SubjectSchema,
  User,
} from '../../models';
import { router } from '../router';
import {
  getClassPublicProps,
  getSimplePublicProps,
  getUserPublicProps,
  verifyAccessToken,
} from '../../utils';
import { Request, Response } from 'express';

export class UserRoutes {
  private readonly ROUTE_API = '/user';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getUser.bind(this));
    router.get(`${this.ROUTE_API}/:uuid`, this.getUserById.bind(this));
    router.get(
      `${this.ROUTE_API}/:uuid/classes`,
      this.getClassesByUser.bind(this)
    );
    router.get(
      `${this.ROUTE_API}/:uuid/subjects`,
      this.getSubjectsByUser.bind(this)
    );
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

    const user = await User.findOne({ uuid: decodedToken.uuid }).catch(() => {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
    });

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    if (user.school) {
      const school = (await School.findOne({ id: user.school }).catch(
        () => null
      )) as ISchool;

      if (school) {
        user.school = getSimplePublicProps(school);
      }
    }

    res.status(200).send({ data: getUserPublicProps(user as IUser) });
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

    const user = await User.findOne({ uuid }).catch(() => {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
    });

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    if (user.school) {
      const school = (await School.findOne({ id: user.school }).catch(
        () => null
      )) as ISchool;

      if (school) {
        user.school = getSimplePublicProps(school);
      }
    }

    res.status(200).send({ data: getUserPublicProps(user as IUser) });
  }

  /**
   * Find classes by user id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClassesByUser(req: Request, res: Response) {
    const { uuid, subject } = req.query || {};

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = (await User.findOne({ uuid }).catch(() => null)) as IUser;

    if (!user) {
      res.status(404).send({ errors: ['Користовача не знайдено'] });
    }

    const subjects = (await SubjectSchema.find({ id: subject }).catch(
      () => null
    )) as ISubject[];

    const classes = (await ClassSchema.find({
      students: uuid,
    }).catch(() => null)) as IClass[];

    if (!classes.length) {
      res.status(404).send({ errors: ['Класи не знайдено'] });
      return;
    }

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

    const user = (await User.findOne({ uuid }).catch(() => null)) as IUser;

    if (!user) {
      res.status(404).send({ errors: ['Користовача не знайдено'] });
    }

    const subjects = (await SubjectSchema.find({
      id: {
        $in: user.subjects,
      },
    }).catch(() => null)) as ISubject[];

    if (!subjects.length) {
      res.status(404).send({ errors: ['Предмети не знайдено'] });
      return;
    }

    res.status(200).send({
      data: subjects.map((subject) => getSimplePublicProps(subject)),
    });
  }
}
