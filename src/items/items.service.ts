import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Item } from 'src/entities/item.entity';
import { UsersService } from 'src/users/users.service';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private itemRepo: MongoRepository<Item>,
    private userService: UsersService
  ) { }

  async create(name: string, owner: string) {
    try {
      const user = await this.userService.findOneByIdOrProps(owner)
      return this.itemRepo.save({ name, owner: user._id })
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getItems(item: Partial<Item>) {
    if(item.id){
      item._id = new ObjectId(item.id)
      delete item.id
    }
    return this.itemRepo.find(item)
  }

  async getItem(id: string){
    return this.itemRepo.findOne(id)
  }
}
