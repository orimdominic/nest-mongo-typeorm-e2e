import { Module, OnModuleDestroy } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './entities/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getTestDb } from './test-db';
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
              entities: [User],
            };
          },
        })
      : TypeOrmModule.forRoot({
          type: 'mongodb',
          host: 'localhost',
          port: 27017,
          database: 'mongo-typeorm-e2e',
          entities: [User],
        }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await mongod.stop(true);
  }
}
