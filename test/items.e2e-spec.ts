import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from "../src/entities/item.entity";
import { User } from "../src/entities/user.entity";
import { MongoRepository, ObjectID } from "typeorm";
import { AppModule } from "../src/app.module";

describe("ItemController (e2e)", () => {
  let app: INestApplication,
    itemsRepo: MongoRepository<Item>,
    userRepo: MongoRepository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    itemsRepo = moduleFixture.get(getRepositoryToken(Item));
    userRepo = moduleFixture.get(getRepositoryToken(User));
  })

  afterAll(async () => {
    await app.close();
  });

  describe("POST /items", () => {
    afterEach(async () => {
      await itemsRepo.deleteMany({});
      await userRepo.deleteMany({});
    });

    it("creates an item", async () => {
      const user = await userRepo.save({ email: "demouser@email.com" })
      return request(app.getHttpServer())
        .post("/items")
        .send({
          name: "Demo item",
          owner: user._id.toString()
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            name: "Demo item",
            owner: user._id.toString(),
            _id: expect.any(String)
          });
        });
    })

    it("throws an error if user is not found", async () => {
      return request(app.getHttpServer())
        .post("/items")
        .send({
          name: "Demo item",
          owner: undefined
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toMatchObject({
            message: "Owner not found"
          });
        });
    })
  })

  describe("GET /items", () => {
    afterEach(async () => {
      await itemsRepo.deleteMany({});
      await userRepo.deleteMany({});
    });

    it("gets items", async () => {
      const user = await userRepo.save({ email: "demouser@email.com" })
      let createdItems = await itemsRepo.save([
        { name: "Plate", owner: user._id },
        { name: "Spoon", owner: user._id },
      ])
      const createdItemsResponse = createdItems.map((item) => ({
        _id: item._id.toString(), owner: item.owner, name: item.name
      }))

      const { body, status } = await request(app.getHttpServer()).get("/items").query({
        owner: user._id.toString()
      }).send()

      expect(status).toBe(200)
      expect(body.length).toBe(2)
      expect(body).toEqual(expect.arrayContaining(createdItemsResponse))
    })
  })


  afterAll(async () => {
    await app.close();
  });

})