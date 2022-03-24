import { Module, OnModuleDestroy } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getTestDb } from './test-db';
import { ItemsModule } from './items/items.module';
import { join } from 'path';
let mongod: MongoMemoryServer;

@Module({
  imports: [
    process.env.NODE_ENV === 'test'
      ? TypeOrmModule.forRootAsync({
        useFactory: async () => {
          mongod = await getTestDb();
          return {
            url: mongod.getUri(),
            type: 'mongodb',
            host: 'localhost',
            database: 'mongo-typeorm-e2e',
            entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
          };
        },
      })
      : TypeOrmModule.forRoot({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        database: 'mongo-typeorm-e2e',
        entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      }),
    UsersModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleDestroy {
  async onModuleDestroy() {
    if(mongod) await mongod.stop(true);
  }
}
