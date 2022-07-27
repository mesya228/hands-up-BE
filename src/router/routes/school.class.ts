import { router } from '../router';
import { getSimplePublicProps, toType, verifyAccessToken } from '../../utils';
import { ISchool, School } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export class SchoolRoutes {
  private readonly ROUTE_API = '/school';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getSchools.bind(this));
    router.post(`${this.ROUTE_API}`, this.createSchool.bind(this));
  }

  /**
   * Get schools
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getSchools(req: Request, res: Response) {
    const { query } = req.query || {};

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const schools = toType<ISchool[]>(
      await School.find({
        name: { $regex: query, $options: 'i' },
      }).catch(() => null),
    );

    if (!schools?.length) {
      res.status(404).send({ errors: ['Школу не знайдено'] });
      return;
    }

    res.status(200).send({
      data: schools.map((school) => getSimplePublicProps(school)),
    });
  }

  /**
   * Create school
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async createSchool(req: Request, res: Response) {
    const { name } = req.body || {};
    const parsedName = (name || '').trim();

    if (!name) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const school = await School.findOne({ name: parsedName }).catch(() => {
      res.status(404).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (school) {
      res.status(400).send({ errors: ['Школа з такою назвою вже існує'] });
      return;
    }

    const newSchool = await School.create({ id: uuidv4(), name }).catch(() => {
      res.status(400).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
    });

    if (newSchool) {
      res.status(200).send({ data: getSimplePublicProps(newSchool) });
    }
  }
}
