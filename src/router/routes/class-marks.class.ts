import { router } from '../router';
import { getClassMarksProps, verifyAccessToken } from '../../utils';
import { IClassMarks, ClassMarks } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export class ClassMarksRoutes {
  private readonly ROUTE_API = '/class-marks';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}/:id`, this.getClassMarks.bind(this));
    router.post(`${this.ROUTE_API}`, this.createClassMarks.bind(this));
  }

  /**
   * Get marks by class id
   *
   * @param {Request} req
   * @param {Response} res
   */
  private async getClassMarks(req: Request, res: Response) {
    const { id } = req.params || {};

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classMarks = (await ClassMarks.find({ id }).catch(
      () => null
    )) as IClassMarks | null;

    if (!classMarks) {
      res.status(404).send({ errors: ['Клас не знайдено'] });
      return;
    }

    res.status(200).send({
      data: getClassMarksProps(classMarks),
    });
  }

  /**
   * Add class to teacher
   *
   * @param {Request} req
   * @param {Response} res
   */
  private async createClassMarks(req: Request, res: Response) {
    const { id, classId } = req.body || {};

    if (!id || !classId) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const foundClassMarks = await ClassMarks.findOne({
      class: classId,
    }).catch(() => null);

    if (foundClassMarks) {
      res.status(400).send({ errors: ['Клас вже додано'] });
      return;
    }

    const newClassMarks = (await ClassMarks.create({
      id: uuidv4(),
      teachers: [id],
      marks: [],
      class: classId,
    }).catch(() => null)) as IClassMarks | null;

    if (newClassMarks) {
      res.status(200).send({ data: getClassMarksProps(newClassMarks) });
      return;
    }

    res.status(400).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
  }
}
