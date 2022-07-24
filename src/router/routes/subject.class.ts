import { router } from '../router';
import { getSimplePublicProps, verifyAccessToken } from '../../utils';
import { SubjectSchema } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export class SubjectRoutes {
  private readonly ROUTE_API = '/subject';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.post(`${this.ROUTE_API}`, this.createSubject.bind(this));
  }

  /**
   * Create class
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async createSubject(req: Request, res: Response) {
    const { name } = req.body || {};
    const parsedName = (name || '').trim();

    if (!name) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const foundSubject = await SubjectSchema.findOne({
      name: parsedName,
    }).catch(() => {
      res.status(404).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (foundSubject) {
      res.status(400).send({ errors: ['Предмет з такою назвою вже існує'] });
      return;
    }

    const newSubject = await SubjectSchema.create({ id: uuidv4(), name }).catch(
      () => {
        res
          .status(400)
          .send({ errors: ['Помилка системи, спробуйте пізніше!'] });
      }
    );

    if (newSubject) {
      res.status(200).send({ data: getSimplePublicProps(newSubject) });
    }
  }
}
