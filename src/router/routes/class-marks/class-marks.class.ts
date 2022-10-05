import { router } from '../../router';
import { getAchievments, getClassMarksProps, reportError, toType, verifyAccessToken } from '../../../utils';
import { IClassMarks, ClassMarksSchema, ClassSchema, IClass, UserSchema, StatisticsSchema, IStatistics, IAchievment } from '../../../models';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { RequestErrors } from '../../../enums';

export class ClassMarksRoutes {
  private readonly ROUTE_API = '/class-marks';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getClassMarks.bind(this));
    router.post(`${this.ROUTE_API}`, this.createClassMarks.bind(this));
    router.patch(`${this.ROUTE_API}/add`, this.addClassMark.bind(this));
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
      await ClassMarksSchema.find({ $or: [{ subjectId }, { classId }] }).catch(() => []),
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

    const foundClassMarks = await ClassMarksSchema.findOne({
      teachers: id,
      classId,
    }).catch(() => null);

    if (foundClassMarks) {
      reportError(res, RequestErrors.ClassExist);
      return;
    }

    const newClassMarks = toType<IClassMarks>(
      await ClassMarksSchema.create({
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

    foundClass.students?.forEach(async (student) => {
      await UserSchema.findOneAndUpdate(
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
    const { subjectId, classId } = req.query || {};
    const { studentId, mark } = req.body || {};

    if (!subjectId || !classId || !studentId || !mark) {
      reportError(res, RequestErrors.DataLack);
      return;
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const foundClassMarks = toType<IClassMarks>(await ClassMarksSchema.findOne({ subjectId, classId, teachers: decodedToken.uuid }).catch(() => null));
    console.log(foundClassMarks);

    if (!foundClassMarks) {
      reportError(res, RequestErrors.ClassLack);
      return;
    }

    if (!foundClassMarks.teachers.includes(decodedToken.uuid)) {
      reportError(res, RequestErrors.AccessDenied);
      return;
    }

    const parsedObject = getClassMarksProps(foundClassMarks);

    await ClassMarksSchema.updateOne(
      { subjectId, classId },
      {
        ...parsedObject,
        marks: [...parsedObject.marks, { student: studentId, mark }],
      },
    );

    res.status(200).send({
      data: {
        success: true,
      },
    });

    this.updateStudentStatistics(studentId, parsedObject.subjectId, mark);
  }

  /**
   * Update user statistics expirience and level by subject
   * By conditions add achievments
   * @param  {string} studentId
   * @param  {string} subjectId
   * @param  {number} mark
   */
  private async updateStudentStatistics(studentId: string, subjectId: string, mark: number) {
    const userStatistics = toType<IStatistics>(await StatisticsSchema.findOne({ uuid: studentId }).catch(() => null));

    let updatedSubjects = this.getUpdatedSubjects(userStatistics.subjects, subjectId, mark);

    await this.updateAchievments(userStatistics, updatedSubjects.level, subjectId);

    await (userStatistics as any)
      .updateOne({
        subjects: updatedSubjects.subjects,
      })
      .catch(() => null);
  }

  /**
   * If conditions pass add new achievment to user statistics
   * @param  {any} userStatistics
   * @param  {number} level
   * @param  {string} subjectId
   */
  private async updateAchievments(userStatistics: any, level: number, subjectId: string) {
    const achievments = await getAchievments();
    const achievment = achievments.find((a: IAchievment) => Number(a?.level) === +level && a.subjectId === subjectId);

    if (achievment) {
      await userStatistics
        .updateOne({
          $addToSet: {
            achievments: achievment.id,
          },
        })
        .catch(() => null);
    }
  }

  /**
   * Return updated subject level and expirience statistics
   * @param  {any[]} subjects
   * @param  {string} subjectId
   * @param  {number} mark
   * @returns updatedLevel
   */
  private getUpdatedSubjects(subjects: any[], subjectId: string, mark: number): any {
    let updatedLevel: number = 1;
    let updatedSubjects = [];

    const updateSubject = (subjects: any[]) =>
      subjects.map((subject) => {
        if (subject.id === subjectId) {
          const updatedExpirience = (subject?.expirience || 0) + mark;

          updatedLevel = Math.floor(updatedExpirience / (12 + subject.level)) + 1;

          subject = {
            ...subject,
            expirience: Math.round(updatedExpirience),
            level: updatedLevel,
          };
        }

        return subject;
      });

    if (subjects?.length) {
      updatedSubjects = updateSubject(subjects);
    } else {
      updatedSubjects = updateSubject([
        {
          id: subjectId,
          expirience: 0,
          level: 0,
        },
      ]);
    }

    return { subjects: updatedSubjects, level: updatedLevel };
  }
}
