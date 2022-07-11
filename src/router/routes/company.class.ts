import { Company } from "../../models";
import { router } from "../router";

const ROUTE_API = "/company";

export const initCompanyRoutes = () => {
  router.post(ROUTE_API + `/getStatus`, (req, res) => {
    const { query } = req.body || {};

    Company.find(
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { data: { $regex: query, $options: "i" } },
        ],
      },
      {},
      { maxTimeMS: 2000 },
      (error, company) => {
        if (company) {
          res.status(200).send({ data: company });
          return;
        }

        if (error) {
          res.status(400).send({ error });
          return;
        }
      }
    );

    return;
  });
};

