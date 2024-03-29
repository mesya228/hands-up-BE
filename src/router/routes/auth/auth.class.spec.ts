import { getApp } from 'src/helpers';
import { ClassSchema, UserSchema } from '../../../models';
import { UserToken } from 'src/models/token';
import { generateAccessToken, generatePassword } from 'src/utils';
import { AuthRoutes } from './auth.class';

import request from 'supertest';
import { RequestErrors } from '../../../enums';

describe('Auth', () => {
  const app = getApp();
  let authRoute: AuthRoutes;

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

    authRoute = new AuthRoutes();
    user.password = await generatePassword('test123');
  });

  describe('signIn', () => {
    it('should return user', async () => {
      jest.spyOn(UserToken as any, 'create').mockResolvedValue({} as any);
      jest.spyOn(UserToken, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(user as any);

      const res = await request(app).post('/auth/sign-in').send({ login: 'test', password: 'test123' });
      const parsedRes = JSON.parse(res.text);

      expect(res.statusCode).toBe(200);
      expect(parsedRes?.data?.user).toEqual({
        uuid: 'test',
        name: 'Test',
        email: 'test',
        state: 'test',
        roles: [],
      });
      expect(parsedRes?.data?.token).toBeTruthy();
    });

    it('should not proceed pending state user', async () => {
      user.state = 'pending';
      jest.spyOn(UserToken as any, 'create').mockResolvedValue({} as any);
      // jest.spyOn(UserToken, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(user as any);

      const res = await request(app).post('/auth/sign-in').send({ login: 'test', password: 'test123' });
      const parsedRes = JSON.parse(res.text);

      // expect(res.statusCode).toBe(200);
      expect(parsedRes?.data?.completeRegister).toBeTruthy();
      expect(parsedRes?.data?.user).toEqual({
        uuid: 'test',
      });
      expect(parsedRes?.data?.token).toBeTruthy();
    });

    it('should handle user dont exist', async () => {
      jest.spyOn(UserSchema, 'findOne').mockRejectedValue(null);

      const res = await request(app).post('/auth/sign-in').send({ login: 'test', password: 'test123' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.WrongLoginPassword],
      });
    });

    it('should handle wrong password', async () => {
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(user as any);

      const res = await request(app).post('/auth/sign-in').send({ login: 'test', password: 'test_123' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.WrongLoginPassword],
      });
    });

    it('should handle empty fields', async () => {
      let res = await request(app).post('/auth/sign-in').send({ email: '', password: '' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });

      res = await request(app).post('/auth/sign-in').send({});

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });
    });
  });

  describe('signUpStart', () => {
    it('should create new user', async () => {
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserSchema as any, 'create').mockResolvedValue(user);

      let res = await request(app).post('/auth/sign-up-start').send({ email: 'test', password: 'test123' });
      const parsedRes = JSON.parse(res.text);

      expect(res.statusCode).toBe(200);
      expect(parsedRes?.data.completeRegister).toBeTruthy();
      expect(parsedRes?.data.user).toEqual({
        uuid: user.uuid,
      });
      expect(parsedRes?.data.token).toBeTruthy();
    });

    it('should failed creating new user', async () => {
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(null);
      jest.spyOn(UserSchema as any, 'create').mockRejectedValue(null);

      let res = await request(app).post('/auth/sign-up-start').send({ email: 'test', password: 'test123' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.SystemError],
      });
    });

    it('should handle existing user', async () => {
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(user as any);

      let res = await request(app).post('/auth/sign-up-start').send({ email: 'test', password: 'test123' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.UserExist],
      });
    });

    it('should handle pending user', async () => {
      user.state = 'pending';
      jest.spyOn(UserSchema, 'findOne').mockResolvedValue(user as any);

      let res = await request(app).post('/auth/sign-up-start').send({ email: 'test', password: 'test123' });
      const parsedRes = JSON.parse(res.text);

      expect(res.statusCode).toBe(200);
      expect(parsedRes?.data.completeRegister).toBeTruthy();
      expect(parsedRes?.data.user).toEqual({
        uuid: user.uuid,
      });
      expect(parsedRes?.data.token).toBeTruthy();
    });

    it('should handle empty fields', async () => {
      let res = await request(app).post('/auth/sign-up-start').send({ email: '', password: '' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });

      res = await request(app).post('/auth/sign-up-start').send({});

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });
    });
  });

  describe('signUpFinish', () => {
    it('should finish sign up', async () => {
      delete user.password;
      const token = generateAccessToken(user);
      jest.spyOn(UserSchema, 'findOneAndUpdate').mockResolvedValue(user);

      let res = await request(app)
        .patch('/auth/sign-up-finish')
        .set('authorization', token)
        .send({ name: 'test', surname: 'test', thirdname: 'test', school: 1 });

      const parsedRes = JSON.parse(res.text);
      expect(res.statusCode).toBe(200);
      expect(parsedRes.data?.user).toEqual(user);
      expect(parsedRes.data?.token).toBeTruthy();
    });

    it('should handle user dont exist', async () => {
      const token = generateAccessToken(user);
      jest.spyOn(UserSchema, 'findOneAndUpdate').mockRejectedValue(null);

      let res = await request(app)
        .patch('/auth/sign-up-finish')
        .set('authorization', token)
        .send({ name: 'test', surname: 'test', thirdname: 'test', school: 1 });

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res.text)).toEqual({ errors: [RequestErrors.UserLack] });
    });

    it('should handle empty token', async () => {
      let res = await request(app)
        .patch('/auth/sign-up-finish')
        .send({ name: 'test', surname: 'test', thirdname: 'test', school: 1 });

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.TokenLack],
      });
    });

    it('should handle empty fields', async () => {
      let res = await request(app)
        .patch('/auth/sign-up-finish')
        .send({ email: '', password: '', thirdname: '', school: '' });

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });

      res = await request(app).patch('/auth/sign-up-finish').send({});

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });
    });
  });

  describe('addStudent', () => {
    it('should add student', async () => {
      const token = generateAccessToken(user);
      const newStudent = {
        name: 'testName', surname: 'testSurname'
      };

      jest.spyOn(UserSchema, 'findOne').mockResolvedValue({ school: 'test' });
      jest.spyOn(UserSchema, 'find').mockResolvedValue([{}]);
      jest.spyOn(ClassSchema, 'findOneAndUpdate').mockResolvedValue(null);
      jest.spyOn(UserSchema, 'create').mockResolvedValue({...newStudent} as never);

      let res = await request(app)
        .post('/auth/add-student')
        .set('authorization', token)
        .send({...newStudent, classId: 'testClass', subjectId: 'testSubject' });
        
      const parsedRes = JSON.parse(res.text);
      expect(res.statusCode).toBe(200);
      expect(parsedRes.data).toMatchObject(newStudent);
    });

    it('should handle empty token', async () => {
      const newStudent = {
        name: 'testName', surname: 'testSurname'
      };

      let res = await request(app)
        .post('/auth/add-student')
        .send({...newStudent, classId: 'testClass', subjectId: 'testSubject' });
        
        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res.text)).toEqual({
          errors: [RequestErrors.TokenLack],
        });
    });

    it('should handle create user system error', async () => {
      const token = generateAccessToken(user);
      const newStudent = {
        name: 'testName', surname: 'testSurname'
      };

      jest.spyOn(UserSchema, 'findOne').mockResolvedValue({ school: 'test' });
      jest.spyOn(UserSchema, 'find').mockResolvedValue([{}]);
      jest.spyOn(ClassSchema, 'findOneAndUpdate').mockResolvedValue(null);
      jest.spyOn(UserSchema, 'create').mockRejectedValue(null as never);

      let res = await request(app)
        .post('/auth/add-student')
        .set('authorization', token)
        .send({...newStudent, classId: 'testClass', subjectId: 'test' });
        
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.text)).toEqual({
          errors: [RequestErrors.SystemError],
        });
    });

    it('should handle empty fields', async () => {
      let res = await request(app).post('/auth/add-student').send({ name: '', surname: '', classId: '' });

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });

      res = await request(app).post('/auth/add-student').send(undefined);

      expect(res.statusCode).toEqual(400);
      expect(JSON.parse(res.text)).toEqual({
        errors: [RequestErrors.DataLack],
      });
    });
  });

  describe('comparePasswords', () => {
    it('should pass compare passwords', async () => {
      const hashedPassword = await generatePassword('test123');
      const isMatch = await authRoute['comparePasswords']('test123', hashedPassword);

      expect(isMatch).toBeTruthy();
    });

    it('should faile compare passwords', async () => {
      const hashedPassword = await generatePassword('test312');
      const isMatch = await authRoute['comparePasswords'](hashedPassword, 'test123');

      expect(isMatch).toBeFalsy();
    });
  });
});
