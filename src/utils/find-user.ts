import { IUser, UserSchema } from '../models';
import { toType } from './toType';

/**
 * @param  {any} queryObj
 */
export async function findUser(queryObj: any): Promise<IUser | null> {
  return toType<IUser>(await UserSchema.findOne(queryObj).catch(() => null));
}

/**
 * @param  {any} queryObj
 */
export async function findUsers(queryObj: any): Promise<IUser[]> {
  return toType<IUser[]>(await UserSchema.find(queryObj).catch(() => []));
}
