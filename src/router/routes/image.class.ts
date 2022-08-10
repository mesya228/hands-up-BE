import { router } from '../router';
import formidable from 'formidable';

const ROUTE_API = '/image/';

export const initImageRoutes = () => {
  router.post(ROUTE_API + 'upload', (req, res) => {

    res.status(200).send({
      errors: ['Amount is required'],
    });

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
      // var oldpath = files.filetoupload.filepath;
      // var newpath = 'C:/Users/Your Name/' + files.filetoupload.originalFilename;
      // fs.rename(oldpath, newpath, function (err) {
      // 	if (err) throw err;
      // 	res.write('File uploaded and moved!');
      // 	res.end();
      // });
    });
  });
};
