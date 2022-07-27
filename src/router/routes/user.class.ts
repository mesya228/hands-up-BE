import {
  ClassMarks,
  ClassSchema,
  IClass,
  IClassMarks,
  ISchool,
  ISubject,
  IUser,
  School,
  SubjectSchema,
  User,
} from '../../models';
import { router } from '../router';
import { getClassPublicProps, getSimplePublicProps, getUserPublicProps, toType, verifyAccessToken } from '../../utils';
import { Request, Response } from 'express';

export class UserRoutes {
  private readonly ROUTE_API = '/user';

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    router.get(`${this.ROUTE_API}`, this.getUser.bind(this));
    router.get(`${this.ROUTE_API}/student`, this.findStudents.bind(this));
    router.get(`${this.ROUTE_API}/:uuid`, this.getUserById.bind(this));
    router.get(`${this.ROUTE_API}/:uuid/classes`, this.getClassesByUser.bind(this));
    router.get(`${this.ROUTE_API}/:uuid/subjects`, this.getSubjectsByUser.bind(this));
  }

  /**
   * Find user from token
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getUser(req: Request, res: Response) {
    const decodedToken = verifyAccessToken(req.headers.authorization, res);

    if (!decodedToken) {
      return;
    }

    const user = toType<IUser>(
      await User.findOne({ uuid: decodedToken.uuid }).catch(() => {
        res.status(404).send({ errors: ['Користувача не знайдено'] });
      }),
    );

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    if (user.school) {
      const school = toType<ISchool>(await School.findOne({ id: user.school }).catch(() => null));

      if (school) {
        user.school = getSimplePublicProps(school);
      }
    }

    res.status(200).send({ data: getUserPublicProps(user) });
  }

  /**
   * Find user from token
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async findStudents(req: Request, res: Response) {
    const { query } = req.query || {};
    const parsedQuery = ((query || '') as string).trim();

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const users = toType<IUser[]>(
      await User.find({
        roles: 'student',
        $or: [
          { name: { $regex: parsedQuery, $options: "i" } },
          { surname: { $regex: parsedQuery, $options: "i" } },
          { thirdname: { $regex: parsedQuery, $options: "i" } },
        ],
      }).catch(() => {
        res.status(404).send({ errors: ['Користувачів не знайдено'] });
      }),
    );
    console.log(users);

    if (!users?.length) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    res.status(200).send({ data: users.map((user) => getUserPublicProps(user)) });
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

    const user = toType<IUser>(
      await User.findOne({ uuid }).catch(() => {
        res.status(404).send({ errors: ['Користувача не знайдено'] });
      }),
    );

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    if (user.school) {
      const school = toType<ISchool>(await School.findOne({ id: user.school }).catch(() => null));

      if (school) {
        user.school = getSimplePublicProps(school);
      }
    }

    res.status(200).send({ data: getUserPublicProps(user) });
  }

  /**
   * Find classes by user id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getClassesByUser(req: Request, res: Response) {
    const { uuid } = req.params || {};
    const { subjectId } = req.query || {};

    if (!subjectId) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
    }

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const classMarks = toType<IClassMarks[]>(await ClassMarks.find({ subjectId, teachers: uuid }).catch(() => []));

    const classesId = classMarks?.map((c) => c.classId);

    const classes = toType<IClass[]>(
      await ClassSchema.find({
        id: classesId,
      }).catch(() => null),
    );

    if (!classes?.length) {
      res.status(404).send({ errors: ['Класи не знайдено'] });
      return;
    }

    res.status(200).send({
      data: classes.map((classItem) => getClassPublicProps(classItem)),
    });
  }

  /**
   * Find subjects by user id
   *
   * @param  {Request} req
   * @param  {Response} res
   */
  private async getSubjectsByUser(req: Request, res: Response) {
    const uuid = req.params.uuid;

    if (!verifyAccessToken(req.headers.authorization, res)) {
      return;
    }

    const user = toType<IUser>(await User.findOne({ uuid }).catch(() => null));

    if (!user) {
      res.status(404).send({ errors: ['Користовача не знайдено'] });
    }

    const subjects = toType<ISubject[]>(
      await SubjectSchema.find({
        id: {
          $in: user?.subjects,
        },
      }).catch(() => null),
    );

    if (!subjects?.length) {
      res.status(404).send({ errors: ['Предмети не знайдено'] });
      return;
    }

    res.status(200).send({
      data: subjects.map((subject) => getSimplePublicProps(subject)),
    });
  }
}
