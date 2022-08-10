import { Response } from 'express';
import { RequestErrors } from 'src/enums';

const handlers = {
  [RequestErrors.SystemError]: 400,
  [RequestErrors.AccessDenied]: 400,
  [RequestErrors.DataLack]: 400,
  [RequestErrors.WrongLoginPassword]: 400,
  [RequestErrors.UserExist]: 400,
  [RequestErrors.UserLack]: 404,
  [RequestErrors.ClassExist]: 400,
  [RequestErrors.ClassLack]: 404,
  [RequestErrors.TokenLack]: 404,
};
export function reportError(res: Response, type: RequestErrors): void {
  const code = handlers[type];

  if (code) {
    res.status(code).send({ errors: [type] });
    return;
  }

  res.status(400).send({ errors: [type] });
}
