import { IUser, User } from '../../models';
import { router } from '../router';

import {
  generateToken,
  getUserPublicProps,
  verifyAccessToken,
} from '../../utils';
import { Request, Response } from 'express';

export class SettingsRoutes {
  private readonly ROUTE_API = '/settings';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.patch(`${this.ROUTE_API}/:uuid`, this.updateUser.bind(this));
  }

  /**
   * Finish sign up
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async updateUser(req: Request, res: Response) {
    const { uuid } = req.params || {};
    console.log(uuid);

    const { name, surname, thirdname, school, phone } = req.body || {};

    if (!name && !surname && !thirdname && !school && !phone) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (
      !verifyAccessToken(req.headers.authorization, res)
    ) {
      console.log('VERIFY ACCESS');
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
      }
    ).catch(() => null)) as IUser;

    console.log(user);
    if (!user) {
      res.status(404).send({ errors: ['Помилка системи'] });
      return;
    }

    res.status(200).send({
      user: getUserPublicProps(user),
    });
  }
}
