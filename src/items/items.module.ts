import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/entities/item.entity';
import { UsersModule } from 'src/users/users.module';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), UsersModule],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
