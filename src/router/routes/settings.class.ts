import { IUser, User } from '../../models';
import { router } from '../router';

import { getUserPublicProps, verifyAccessToken } from '../../utils';
import { Request, Response } from 'express';

export class SettingsRoutes {
  private readonly ROUTE_API = '/settings';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.patch(`${this.ROUTE_API}/:uuid`, this.updateUser.bind(this));
    router.patch(`${this.ROUTE_API}/:uuid/photo`, this.uploadPhoto.bind(this));
    router.patch(`${this.ROUTE_API}/:uuid/subject`, this.addUserSubject.bind(this));
  }

  /**
   * Update user info settings
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async updateUser(req: Request, res: Response) {
    const { uuid } = req.params || {};

    const { name, surname, thirdname, school, phone } = req.body || {};

    if (!name && !surname && !thirdname && !school && !phone) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = (await User.findOneAndUpdate(
      { uuid },
      {
        name,
        surname,
        thirdname,
        school,
        phone,
      },
    ).catch(() => null)) as IUser;

    if (!user) {
      res.status(404).send({ errors: ['Помилка системи'] });
      return;
    }

    res.status(200).send({
      user: getUserPublicProps(user),
    });
  }

  /**
   * Upload user photo
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async uploadPhoto(req: Request, res: Response) {
    const body = req.body || {};
    console.log(body);

    if (!body) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    res.status(400).send({ errors: ['Помилка системи'] });
  }

  /**
   * Add Subject to user
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async addUserSubject(req: Request, res: Response) {
    const { uuid } = req.params || {};

    const { subjectId } = req.body || {};

    if (!subjectId) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = (await User.findOneAndUpdate(
      { uuid },
      {
        $push: {
          subjects: subjectId,
        },
      },
    ).catch(() => null)) as IUser;

    if (!user) {
      res.status(404).send({ errors: ['Помилка системи'] });
      return;
    }

    res.status(200).send({
      user: getUserPublicProps(user),
    });
  }
}
