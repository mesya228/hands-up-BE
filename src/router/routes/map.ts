import { router } from "../router";

const ROUTE_API = '/map';

export const initMapRoutes = () => {
	router.get(ROUTE_API, (req, res) => {
		console.log(req.method);

		res.status(200).send({
			data: 'test',
		});
	});
};
