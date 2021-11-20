import { Post, User, getNumber, posts } from '../../models';
import { router } from '../router';

const ROUTE_API = '/user';

export const initUserRoutes = () => {
	router.post(`/carplates`, (req, res) => {
		const carplates = getNumber();
		res.status(200).send(carplates);
		return;
	});
	
	router.post(`/carplates`, (req, res) => {
		const carplates = getNumber();
		res.status(200).send(carplates);
		return;
	});

	router.get(`/posts`, (req, res) => {
		res.status(200).send(posts);
		return;
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
						console.log(e);
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

	router.get(`${ROUTE_API}/:id`, async (req, res) => {
		const id = req.params.id;

		User.findOne({ id }).then((user: any) => {
			if (user) {
				res.status(200).send({ user });
				return;
			}

			res.status(404).send();
		});
	});

	router.post(`${ROUTE_API}/:id/locations`, (req, res) => {
		const userId = req.params.id;
		const { location } = req.body || {};
		console.log('location', location);

		User.updateOne(
			{ id: userId },
			{
				$set: {
					'items.$.locations': location,
				},
			}
		);
	});

	router.post(`${ROUTE_API}/:id/post`, (req, res) => {
		const userId = req.params.id;
		const { link, text } = req.body || {};
		console.log('link', link);
		console.log('text', text);

		Post.create({ userId, link, text })
			.then((post) => {
				res.status(200).send({ post });
			})
			.catch((e) => {
				console.log(e);
				res.status(400).send({
					error: e,
				});
			});
	});
};
