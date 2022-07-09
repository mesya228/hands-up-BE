import { router } from '../router';
import { getSchoolPublicProps, verifyAccessToken } from '../../utils';
import { IClass, Class } from '../../models';
import { v4 as uuidv4 } from 'uuid';

const ROUTE_API = '/class';

export const initClassRoutes = () => {
  router.get(`${ROUTE_API}`, async (req: any, res) => {
    if (!verifyAccessToken(req.headers.bearer, res)) {
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
  });

  router.post(`${ROUTE_API}`, async (req: any, res) => {
    const { name } = req.body || {};
    const parsedName = (name || '').trim();

    if (!name) {
      res.status(400).send({ errors: ['Не всі дані заповнено'] });
      return;
    }

    if (!verifyAccessToken(req.headers.bearer, res)) {
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
  });
};
