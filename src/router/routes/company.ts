import { Company } from "../../models";
import { router } from "../router";

const ROUTE_API = "/company";

export const initCompanyRoutes = () => {
  router.post(ROUTE_API + `/getStatus`, (req, res) => {
    const { query } = req.body || {};

    console.log(query);

    // Company.updateMany( { data: '[]' }, { $unset: {data: [''] }}, { multi: true } ).then(res => {
    //   console.log(res);
    // });

    // res.status(200).send({ data: [] });

    // return;
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
          console.log("company", company);
          res.status(200).send({ data: company });
          return;
        }

        if (error) {
          console.log("error", error);
          res.status(400).send({ error });
          return;
        }
      }
    );

    return;
  });
};

