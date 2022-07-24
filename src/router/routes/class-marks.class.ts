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
    router.get(`${this.ROUTE_API}`, this.getClassMarks.bind(this));
    router.post(`${this.ROUTE_API}`, this.createClassMarks.bind(this));
    router.patch(`${this.ROUTE_API}/:id`, this.addClassMark.bind(this));
  }

  /**
   * Get marks by class id
   *
   * @param {Request} req
   * @param {Response} res
   */
  private async getClassMarks(req: Request, res: Response) {
    const { subjectId, classId } = req.query || {};

    if (!subjectId && !classId) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classMarks = (await ClassMarks.find({ $or: [{ subjectId }, { classId }] }).catch(
      () => null,
    )) as IClassMarks[];

    if (!classMarks.length) {
      res.status(404).send({ errors: ['Клас не знайдено'] });
      return;
    }

    res.status(200).send({
      data: getClassMarksProps(classMarks[0]),
    });
  }

  /**
   * Add class to teacher
   *
   * @param {Request} req
   * @param {Response} res
   */
  private async createClassMarks(req: Request, res: Response) {
    const { id, classId, subjectId } = req.body || {};

    if (!id || !classId || !subjectId) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res, { compareId: id })) {
      return;
    }

    const foundClassMarks = await ClassMarks.findOne({
      teachers: id,
      classId,
    }).catch(() => null);

    if (foundClassMarks) {
      res.status(400).send({ errors: ['Клас вже додано'] });
      return;
    }

    const newClassMarks = (await ClassMarks.create({
      id: uuidv4(),
      classId,
      subjectId,
      teachers: [id],
      marks: [],
    }).catch(() => null)) as IClassMarks | null;

    if (newClassMarks) {
      res.status(200).send({ data: getClassMarksProps(newClassMarks) });
      return;
    }

    res.status(400).send({ errors: ['Помилка системи, спробуйте пізніше!'] });
  }

  /**
   * Add class mark
   *
   * @param {Request} req
   * @param {Response} res
   */
  private async addClassMark(req: Request, res: Response) {
    const { id } = req.params || {};
    const { student, mark, date } = req.body || {};

    if (!id || !student || !mark || !date) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const foundClassMarks = (await ClassMarks.findOne({ id }).catch(() => null)) as IClassMarks;

    if (!foundClassMarks) {
      res.status(400).send({ errors: ['Клас відсутній'] });
      return;
    }

    if (!foundClassMarks.teachers.includes(decodedToken.uuid)) {
      res.status(400).send({ errors: ['У доступі відмовлено тест'] });
      return;
    }

    const parsedObject = getClassMarksProps(foundClassMarks);

    await ClassMarks.updateOne(
      { id },
      {
        ...parsedObject,
        marks: [...parsedObject.marks, { student, mark, date }],
      },
    );

    res.status(200).send({ data: ['Оцінку додано'] });
  }
}
