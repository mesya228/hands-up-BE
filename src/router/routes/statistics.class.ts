import { AchievmentSchema, IAchievment, IStatistics, ISubject, StatisticsSchema, SubjectSchema } from '../../models';
import { router } from '../router';
import { getAchievmentsPublicProps, getStatisticsPublicProps, getSubjectStatisticsPublicProps, toType, verifyAccessToken } from '../../utils';
import { Request, Response } from 'express';
import { RequestErrors } from '../../enums';

export class StatisticsRoutes {
  private readonly ROUTE_API = '/statistics';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}/:uuid`, this.getUserStatistics.bind(this));
  }

  /**
   * Find user from token
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

    const achievments = toType<IAchievment[]>(
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
        achievments: statistics.achievments.map((achievment: string) => getAchievmentsPublicProps(achievments[achievment])),
        subjects: statistics.subjects.map((subject) => getSubjectStatisticsPublicProps({ ...subject, ...subjects[subject.id] })),
      }),
    });
  }
}
