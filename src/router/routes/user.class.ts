import { Class, IClass, ISchool, IUser, School, User } from '../../models';
import { router } from '../router';
import {
  getClassPublicProps,
  getSchoolPublicProps,
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
        user.school = getSchoolPublicProps(school);
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
        user.school = getSchoolPublicProps(school);
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
    const uuid = req.params.uuid;

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = (await User.findOne({ uuid }).catch(() => null)) as IUser;

    if (!user) {
      res.status(404).send({ errors: ['Користовача не знайдено'] });
    }

    const classes = (await Class.find({
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
}
