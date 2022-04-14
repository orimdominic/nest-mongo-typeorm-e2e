import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoRepository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication, usersRepo: MongoRepository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersRepo = moduleFixture.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    afterEach(async () => {
      await usersRepo.deleteMany({});
    });

    it('creates a new user', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Demo User',
          email: 'demo.user@mail.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: 'Demo User',
            email: 'demo.user@mail.com',
            _id: expect.any(String),
          });
        });
    });
  });
});
