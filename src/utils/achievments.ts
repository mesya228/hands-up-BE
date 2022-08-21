import { AchievmentSchema, IAchievment } from '../models';
import { toType } from './toType';

export async function getAchievments(): Promise<IAchievment[]> {
  return toType<IAchievment[]>(
    await AchievmentSchema.find({})
      .lean()
      .catch(() => []),
  );
}
