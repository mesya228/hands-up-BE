import { router } from '../router';
import { getClassMarksProps, reportError, toType, verifyAccessToken } from '../../utils';
import { IClassMarks, ClassMarks, ClassSchema, IClass, User } from '../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { RequestErrors } from 'src/enums';

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
      reportError(res, RequestErrors.DataLack);
      return;
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classMarks = toType<IClassMarks[]>(
      await ClassMarks.find({ $or: [{ subjectId }, { classId }] }).catch(() => []),
    );

    if (!classMarks?.length) {
      reportError(res, RequestErrors.ClassLack);
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
      reportError(res, RequestErrors.DataLack);
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
      reportError(res, RequestErrors.ClassExist);
      return;
    }

    const newClassMarks = toType<IClassMarks>(
      await ClassMarks.create({
        id: uuidv4(),
        classId,
        subjectId,
        teachers: [id],
        marks: [],
      }).catch(() => null),
    );

    if (newClassMarks) {
      res.status(200).send({ data: getClassMarksProps(newClassMarks) });
    } else {
      reportError(res, RequestErrors.SystemError);
    }

    const foundClass = toType<IClass>(ClassSchema.find({ id: classId }).catch(() => null));

    foundClass.students.forEach(async (student) => {
      await User.findOneAndUpdate(
        {
          uuid: student,
        },
        {
          $addToSet: {
            subjects: subjectId,
          },
        },
      );
    });
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
      reportError(res, RequestErrors.DataLack);
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const foundClassMarks = toType<IClassMarks>(await ClassMarks.findOne({ id }).catch(() => null));

    if (!foundClassMarks) {
      reportError(res, RequestErrors.ClassLack);
      return;
    }

    if (!foundClassMarks.teachers.includes(decodedToken.uuid)) {
      reportError(res, RequestErrors.AccessDenied);
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
