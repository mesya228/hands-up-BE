import { IUser, User } from '../../models';
import { router } from '../router';
import { getUserPublicProps, verifyAccessToken } from '../../utils';

const ROUTE_API = '/user';

export const initUserRoutes = () => {
  router.get(`${ROUTE_API}/:uuid`, async (req: any, res) => {
    const uuid = req.params.uuid;
    console.log('uuid', uuid);

    if (!verifyAccessToken(req.headers.bearer, res)) {
      return;
    }

    const user = await User.findOne({ uuid }).catch(() => {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
    });

    if (!user) {
      res.status(404).send({ errors: ['Користувача не знайдено'] });
      return;
    }

    res.status(200).send({ data: getUserPublicProps(user as IUser) });
  });

  router.post(`${ROUTE_API}/:id/start`, (req, res) => {
    const userId = req.params.id;

    User.findOne({ id: userId }, {}, {}, (error, user) => {
      if (error) {
        res.status(400).send({ error });
        return;
      }

      if (user) {
        return;
      }
    });
  });

  router.post(`${ROUTE_API}`, async (req, res) => {
    const { id, instagramLink } = req.body || {};

    User.findOne({ id }).then((user: any) => {
      if (!user) {
        User.create({ id, instagramLink })
          .then((newUser) => {
            res.status(200).send(newUser);
          })
          .catch((e) => {
            res.status(400).send({
              error: e,
            });
          });

        return;
      }

      User.updateOne({ id }, { instagramLink }).then((newUser: any) => {
        res.status(200).send(newUser);
      });
    });
  });

  router.post(`${ROUTE_API}/:id/locations`, (req, res) => {
    const userId = req.params.id;
    const { location } = req.body || {};

    User.updateOne(
      { id: userId },
      {
        $set: {
          'items.$.locations': location,
        },
      }
    );
  });
};
