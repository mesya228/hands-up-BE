import request from 'supertest';

import { ClassMarksRoutes } from './class-marks.class';
import { RequestErrors } from '../../../enums';
import { getApp, updateMock } from 'src/helpers';
import { generateAccessToken } from 'src/utils';
import { ClassMarksSchema, StatisticsSchema } from '../../../models';

describe('ClassMarksSchema', () => {
  const app = getApp();
  let user: any;

  beforeEach(async () => {
    user = {
      uuid: 'testUuid',
      name: 'Test',
      email: 'test',
      state: 'test',
      roles: ['teacher'],
    } as any;
    new ClassMarksRoutes();
  });

  describe('addClassMark', () => {
    it('should add class mark', async () => {
      jest.spyOn(ClassMarksSchema, 'findOne').mockResolvedValue({ teachers: ['testUuid'], marks: [] });
      jest.spyOn(ClassMarksSchema, 'updateOne').mockResolvedValue({} as any);
      jest.spyOn(StatisticsSchema, 'findOne').mockResolvedValue({ subjects: [], marks: [], updateOne: updateMock() });
      const token = generateAccessToken(user);

      const res = await request(app)
        .patch('/class-marks/test')
        .set('authorization', token)
        .send({ studentId: 'test', mark: 12, date: 'test' });

      expect(res.statusCode).toEqual(200);
      expect(JSON.parse(res.text)).toEqual({ data: { success: true } });
    });

    it('should filter empty body', async () => {
      const res = await request(app).patch('/class-marks/test').send(undefined);

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.text)).toEqual({ errors: [RequestErrors.DataLack] });
    });
  });
});
