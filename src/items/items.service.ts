import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Item } from '../entities/item.entity';
import { UsersService } from '../users/users.service';
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
      if (!user) {
        throw new Error("USER_NOT_FOUND_ERROR")
      }
      return this.itemRepo.save({ name, owner: user._id })
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async find(query: Partial<Item>) {
    const filter = this.generateQueryObject(query)
    const items = await this.itemRepo.find(filter)
    return items
  }

  async findItemByIdOrProps(query: string | Partial<Item>) {
    const filter = typeof (query) === 'string' ? { _id: new ObjectId(query) } : this.generateQueryObject(query)
    return this.itemRepo.findOne(filter)
  }

  generateQueryObject(query: Partial<Item>) {
    const idProps = ["owner"]
    const queryClone = {...query}
    idProps.forEach((prop) => {
      queryClone[prop] = queryClone[prop] && new ObjectId(queryClone[prop])
    })
    if (queryClone.id) {
      queryClone._id = new ObjectId(queryClone.id)
      delete queryClone.id
    }
    const filter = {}
    for (const key in queryClone) {
      if (queryClone[key]) {
        filter[key] = queryClone[key]
      }
    }
    return filter
  }
}
