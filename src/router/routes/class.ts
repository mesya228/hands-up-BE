import { router } from '../router';
import { getSchoolPublicProps, verifyAccessToken } from '../../utils';
import { IClass, Class } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export class ClassRoutes {
  private readonly ROUTE_API = '/class';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getClasses.bind(this));
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

    const classes = await Class.find({}).catch(() => null);

    if (!classes) {
      res.status(404).send({ errors: ['Клас не знайдено'] });
      return;
    }

    res.status(200).send({
      data: (classes as IClass[]).map((classItem) =>
        getSchoolPublicProps(classItem)
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
    const { name } = req.body || {};
    const parsedName = (name || '').trim();

    if (!name) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const foundClass = await Class.findOne({ name: parsedName }).catch(() => {
      res.status(404).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (foundClass) {
      res.status(400).send({ errors: ['Клас з такою назвою вже існує'] });
      return;
    }

    const newClass = await Class.create({ id: uuidv4(), name }).catch(() => {
      res.status(400).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (newClass) {
      res.status(200).send({ data: getSchoolPublicProps(newClass) });
    }
  }
}
