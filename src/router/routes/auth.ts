import { IUser, User } from '../../models';
import { router } from '../router';

const ROUTE_API = '/auth/';

export const initAuthRoutes = () => {
	router.post(ROUTE_API + 'sign-in', (req, res) => {
		const { login, password } = req.body || {};
		console.log(req);
		console.log(req.body);
		console.log('login', login);
		console.log('password', password);

		if (!login || !password) {
			res.status(400).send({
				data: 'Invalid login or password',
			});

			return;
		}

		User.find({ login }, (err, user: IUser) => {
			if (err) {
				res.status(400).send({
					data: 'DB error',
				});

				return;
			}

			console.log(user);
			if (user) {
				res.status(200).send({
					data: 'success',
				});

				return;
			}

			res.status(400).send({
				data: 'Invalid login or password',
			});
		});
	});

	router.post(ROUTE_API + 'sign-up', (req, res) => {
		const { email, login, password } = req.body || {};

		res.status(200).send({
			data: 'test',
		});
	});
};
