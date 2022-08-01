import { getApp } from 'src/helpers';
import { User } from 'src/models';
import { UserToken } from 'src/models/token';
import { generateHashedPassword } from 'src/utils';
import request from 'supertest';

const app = getApp();

describe('Sign-in', function () {
  test('should return user on sign-in', async () => {
    const user = {
      uuid: 'test',
      name: 'Test',
      email: 'test',
      state: 'test',
      roles: [],
      password: await generateHashedPassword('test123'),
    };

    jest.spyOn(UserToken as any, 'create').mockResolvedValue({} as any);
    jest.spyOn(UserToken, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'findOne').mockResolvedValue(user as any);

    let res = await request(app).post('/auth/sign-in').send({ email: 'test', password: 'test123' });

    const response = JSON.parse(res.text);
    
    expect(res.statusCode).toBe(200);
    expect(response?.data?.user).toEqual({
      uuid: 'test',
      name: 'Test',
      email: 'test',
      state: 'test',
      roles: [],
    });
    expect(response?.data?.token).toBeTruthy();
  });

  test('should handle failed sign-in', async () => {
    let res = await request(app).post('/auth/sign-in').send({ email: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text)).toEqual({
      errors: ['Неправильні пошта або пароль'],
    });

    res = await request(app).post('/auth/sign-in').send({});

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text)).toEqual({
      errors: ['Неправильні пошта або пароль'],
    });
  });

  test('should handle empty fields sign-in', async () => {
    let res = await request(app).post('/auth/sign-in').send({ email: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text)).toEqual({
      errors: ['Неправильні пошта або пароль'],
    });

    res = await request(app).post('/auth/sign-in').send({});

    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.text)).toEqual({
      errors: ['Неправильні пошта або пароль'],
    });
  });
});
