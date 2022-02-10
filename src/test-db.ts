import { MongoMemoryServer } from 'mongodb-memory-server';

let testDb: MongoMemoryServer;
export async function getTestDb() {
  if (!testDb) {
    testDb = await MongoMemoryServer.create();
  }
  return testDb;
}
