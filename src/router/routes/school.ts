import { router } from '../router';
import { getScroolPublicProps, verifyAccessToken } from '../../utils';
import { ISchool, School } from '../../models';
import { v4 as uuidv4 } from 'uuid';

const ROUTE_API = '/school';

export const initSchoolRoutes = () => {
  router.get(`${ROUTE_API}`, async (req: any, res) => {
    if (!verifyAccessToken(req.headers.bearer, res)) {
      return;
    }

    const schools = await School.find({}).catch(() => null);

    if (!schools) {
      res.status(404).send({ errors: ['Школу не знайдено'] });
      return;
    }

    res.status(200).send({
      data: (schools as ISchool[]).map((school) =>
        getScroolPublicProps(school)
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
      res.status(200).send({ data: getScroolPublicProps(newSchool) });
    }
  });
};
