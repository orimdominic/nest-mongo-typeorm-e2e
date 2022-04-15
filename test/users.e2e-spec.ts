import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoRepository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { join } from 'path';

describe('UsersController (e2e)', () => {
  let app: INestApplication,
    mongod: MongoMemoryServer,
    usersRepo: MongoRepository<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider("TypeOrmModuleOptions")
      .useValue({
        url: mongod.getUri(),
        type: 'mongodb',
        entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    usersRepo = moduleFixture.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await mongod.stop()
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
