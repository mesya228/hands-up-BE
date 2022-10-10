import {
  AchievmentSchema,
  ClassSchema,
  IAchievment,
  IClass,
  IStatistics,
  ISubject,
  StatisticsSchema,
  SubjectSchema,
} from '../../models';
import { router } from '../router';
import {
  getAchievementsPublicProps,
  getStatisticsPublicProps,
  getSubjectStatisticsPublicProps,
  toType,
  verifyAccessToken,
} from '../../utils';
import { Request, Response } from 'express';
import { RequestErrors } from '../../enums';

export class StatisticsRoutes {
  private readonly ROUTE_API = '/statistics';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}/:uuid`, this.getUserStatistics.bind(this));
    router.get(`${this.ROUTE_API}/:classId/leaderboard`, this.getClassLeaderboard.bind(this));
  }

  /**
   * Get user statistics
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getUserStatistics(req: Request, res: Response) {
    const { uuid } = req.params || {};

    if (!uuid) {
      return reportError(RequestErrors.DataLack);
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const statistics = toType<IStatistics>(
      await StatisticsSchema.findOne({ uuid: decodedToken.uuid })
        .lean()
        .catch(() => null),
    );

    if (!statistics) {
      return reportError(RequestErrors.StatisticsLack);
    }

    const achievements = toType<IAchievment[]>(
      await AchievmentSchema.find({})
        .lean()
        .catch(() => []),
    ).reduce((obj: any, achievment) => {
      obj[achievment.id] = achievment;
      return obj;
    }, {});

    const subjects = toType<ISubject[]>(
      await SubjectSchema.find({})
        .lean()
        .catch(() => []),
    ).reduce((obj: any, subject) => {
      obj[subject.id] = subject;
      return obj;
    }, {});

    res.status(200).send({
      data: getStatisticsPublicProps({
        achievements: statistics.achievements.map((achievment: string) =>
          getAchievementsPublicProps(achievements[achievment]),
        ),
        subjects: statistics.subjects.map((subject) =>
          getSubjectStatisticsPublicProps({
            ...subject,
            ...subjects[subject.id],
            experienceGoal: subject.level * 10,
          }),
        ),
      }),
    });
  }

  /**
   * Get class leaderboard
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClassLeaderboard(req: Request, res: Response) {
    const { classId } = req.params || {};

    if (!classId) {
      return reportError(RequestErrors.DataLack);
    }

    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const foundClass = toType<IClass>(
      await ClassSchema.findOne({ id: classId })
        .lean()
        .catch(() => null),
    );

    if (!foundClass) {
      return reportError(RequestErrors.ClassLack);
    }

    const leaderboard = await Promise.all(
      foundClass.students.map(async (studentId) =>
        toType<IStatistics>(
          await StatisticsSchema.findOne({ uuid: studentId })
            .lean()
            .catch(() => null),
        ),
      ),
    );

    res.status(200).send({
      data: leaderboard.sort(),
    });
  }
}
