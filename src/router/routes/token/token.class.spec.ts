import { getApp } from 'src/helpers';
import { UserToken } from 'src/models/token';
import { generatePassword, generateToken } from 'src/utils';

import request from 'supertest';
import { TokenRoutes } from './token.class';

describe('Token', () => {
  const app = getApp();

  let user: any;

  beforeEach(async () => {
    user = {
      uuid: 'test',
      name: 'Test',
      email: 'test',
      state: 'test',
      roles: [],
      password: '',
    } as any;

    user.password = await generatePassword('test123');
    new TokenRoutes();
  });

  describe('refreshToken', () => {
    it('should return refreshed token', async () => {
      jest.spyOn(UserToken as any, 'create').mockResolvedValue({} as any);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue(null);
      const refreshToken = await generateToken(user);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue({ token: refreshToken.refreshToken });

      const res = await request(app).post('/token/refresh').send({ refreshToken });
      const parsedRes = JSON.parse(res.text);

      expect(res.statusCode).toBe(200);
      expect(parsedRes?.data?.accessToken).toBeTruthy();
    });

    it('should filter token dont exist', async () => {
      jest.spyOn(UserToken as any, 'create').mockResolvedValue({} as any);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue(null);
      const refreshToken = await generateToken(user);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue(null);

      const res = await request(app).post('/token/refresh').send({ refreshToken });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: ['Неправильний токен'],
      });
    });

    it('should filter emty token', async () => {
      const res = await request(app).post('/token/refresh').send({});

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: ['Токен відсутній'],
      });
    });
  });

  describe('deleteToken', () => {
    it('should filter token dont exist', async () => {
      jest.spyOn(UserToken, 'findOne').mockRejectedValue(null);
      const res = await request(app).delete('/token').send({ refreshToken: 'test' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: ['Токен відсутній'],
      });
    });

    it('should filter token dont exist', async () => {
      jest.spyOn(UserToken, 'remove').mockResolvedValue(true);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue({ remove: () => {} });
      const res = await request(app).delete('/token').send({ refreshToken: 'test' });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.text)).toEqual({
        data: { success: true },
      });
    });

    it('should catch error on token delete', async () => {
      jest.spyOn(UserToken, 'remove').mockResolvedValue(true);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue({});
      const res = await request(app).delete('/token').send({ refreshToken: 'test' });

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res.text)).toEqual({
        data: { success: false },
      });
    });

    it('should filter empty token', async () => {
      const res = await request(app).delete('/token').send({});

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: ['Токен відсутній'],
      });
    });
  });
});
