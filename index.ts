import express from 'express';
import { initRouters, router } from './src/router/router';
const app = express();

const port = process.env.PORT;

app.listen(port, () => {
	initRouters();
  app.use(express.json());
	app.use(router);
	console.log(`Server listening at http://localhost:${port}`);
});
