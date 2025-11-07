import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.CLIENT_URL = 'http://localhost:3000';
  process.env.SERVER_URL = 'http://localhost:5000';
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_ACCESS_EXPIRATION = '15m';
  process.env.JWT_REFRESH_EXPIRATION = '7d';
  process.env.RECAPTCHA_SECRET = '';

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
