import { IUser, User } from '../../models';
import { router } from '../router';

const ROUTE_API = '/auth/';

export const initAuthRoutes = () => {
	router.post(ROUTE_API + 'sign-in', (req, res) => {
		const { email, password } = req.body || {};

		if (!email || !password) {
			res.status(400).send({
				errors: ['Invalid login or password'],
			});

			return;
		}

		User.findOne({ email, password })
			.then((user: IUser) => {
				if (user) {
					res.status(400).send({
						data: user,
					});
					return;
				}

				res.status(400).send({
					errors: ['Invalid login or password'],
				});
			})
			.catch(() => {
				res.status(400).send({
					errors: ['Invalid login or password'],
				});
			});
	});

	router.post(ROUTE_API + 'sign-up', (req, res) => {
		const { email, username, password } = req.body || {};

		if (!email || !username || !password) {
			res.status(400).send({
				errors: ['Please provide email, username and password!'],
			});
			return;
		}

		User.findOne({ email, username })
			.then((user: IUser) => {
				if (user) {
					res.status(400).send({
						errors: ['User with such email or username already exist'],
					});
					return;
				}

				User.create({ email, username, password })
					.then((createdUser) => {
						res.status(200).send({
							data: createdUser,
						});
					})
					.catch(() => {
						res.status(400).send({
							errors: ['Error during sign up. Please, try later'],
						});
					});
			})
			.catch(() => {
				res.status(400).send({
					errors: ['Error during sign up. Please, try later'],
				});
			});
	});
};
