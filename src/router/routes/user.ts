import { ISchool, IUser, School, User } from '../../models';
import { router } from '../router';
import {
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
    router.get(`${this.ROUTE_API}/:uuid`, this.getUserById.bind(this));
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
}
