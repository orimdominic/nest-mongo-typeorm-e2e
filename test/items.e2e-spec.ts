import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from '../src/entities/item.entity';
import { User } from '../src/entities/user.entity';
import { MongoRepository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { join } from 'path';

describe('ItemsController (e2e)', () => {
  let app: INestApplication,
    mongod: MongoMemoryServer,
    itemsRepo: MongoRepository<Item>,
    usersRepo: MongoRepository<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('TypeOrmModuleOptions')
      .useValue({
        url: mongod.getUri(),
        type: 'mongodb',
        entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    itemsRepo = moduleFixture.get(getRepositoryToken(Item));
    usersRepo = moduleFixture.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /items', () => {
    afterEach(async () => {
      await itemsRepo.deleteMany({});
      await usersRepo.deleteMany({});
    });

    it('creates an item', async () => {
      const user = await usersRepo.save({ email: 'demouser@email.com' });
      return request(app.getHttpServer())
        .post('/items')
        .send({
          name: 'Demo item',
          owner: user._id.toString(),
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: 'Demo item',
            owner: user._id.toString(),
            _id: expect.any(String),
          });
        });
    });

    it('throws an error if user is not found', async () => {
      return request(app.getHttpServer())
        .post('/items')
        .send({
          name: 'Demo item',
          owner: undefined,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: 'Owner not found',
          });
        });
    });
  });

  describe('GET /items', () => {
    afterEach(async () => {
      await itemsRepo.deleteMany({});
      await usersRepo.deleteMany({});
    });

    it('gets items', async () => {
      const user = await usersRepo.save({ email: 'demouser@email.com' });
      const createdItems = await itemsRepo.save([
        { name: 'Plate', owner: user._id },
        { name: 'Spoon', owner: user._id },
      ]);

      const { body, status } = await request(app.getHttpServer())
        .get('/items')
        .query({
          owner: user._id.toString(),
        })
        .send();

      expect(status).toBe(200);
      expect(body.length).toBe(2);
      const getStringPropArr = (arr, prop) =>
        arr.map((item) => item[prop].toString());
      expect(getStringPropArr(body, '_id')).toEqual(
        expect.arrayContaining(getStringPropArr(createdItems, '_id')),
      );
      expect(getStringPropArr(body, 'name')).toEqual(
        expect.arrayContaining(getStringPropArr(createdItems, 'name')),
      );
    });
  });

  afterAll(async () => {
    await mongod.stop();
    await app.close();
  });
});
