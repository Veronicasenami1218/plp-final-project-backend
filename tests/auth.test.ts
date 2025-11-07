import request from 'supertest';
import { expressApp } from '../src/test-app';
import { User } from '../src/models/User';

describe('Auth - Registration and Login', () => {
  const base = '/api/v1/auth';

  it('registers a user with email successfully', async () => {
    const res = await request(expressApp)
      .post(`${base}/register`)
      .send({
        email: 'test@example.com',
        password: 'Str0ng!Pass1',
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        acceptTerms: 'true',
        country: 'Nigeria',
      })
      .expect(201);

    expect(res.body?.success).toBe(true);
    expect(res.body?.data?.user?.email).toBe('test@example.com');
    expect(res.body?.data?.tokens?.access?.token).toBeDefined();
    expect(res.body?.data?.tokens?.refresh?.token).toBeDefined();
  });

  it('prevents duplicate registration for same email', async () => {
    await request(expressApp).post(`${base}/register`).send({
      email: 'dupe@example.com',
      password: 'Str0ng!Pass1',
      firstName: 'Dupe',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      acceptTerms: 'true',
    });

    const res = await request(expressApp)
      .post(`${base}/register`)
      .send({
        email: 'dupe@example.com',
        password: 'Str0ng!Pass1',
        firstName: 'Dupe',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        acceptTerms: 'true',
      })
      .expect(409);

    expect(res.body?.success).toBe(false);
  });

  it('blocks login before email verification', async () => {
    await request(expressApp).post(`${base}/register`).send({
      email: 'login@example.com',
      password: 'Str0ng!Pass1',
      firstName: 'Login',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      acceptTerms: 'true',
    });

    const res = await request(expressApp)
      .post(`${base}/login`)
      .send({ email: 'login@example.com', password: 'Str0ng!Pass1' })
      .expect(403);

    expect(res.body?.success).toBe(false);
  });
});
