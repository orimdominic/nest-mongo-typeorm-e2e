import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: 'mongodb://127.0.0.1:27017/mongo-typeorm-e2e',
      type: 'mongodb',
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
    }),
    UsersModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
