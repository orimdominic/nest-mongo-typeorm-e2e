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
    return this.itemRepo.find(this.generateQueryObject(query))
  }

  async findItemByIdOrProps(query: string | Partial<Item>) {
    const filter = typeof (query) === 'string' ? { _id: new ObjectId(query) } : this.generateQueryObject(query)
    return this.itemRepo.findOne(filter)
  }

  generateQueryObject(query: Partial<Item>) {
    const idProps = ["owner"]
    idProps.forEach((prop) => {
      query[prop] = new ObjectId(query[prop])
    })
    if (query.id) {
      query._id = new ObjectId(query.id)
      delete query.id
    }
    const filter = {}
    for (const key in query) {
      if (query[key]) {
        filter[key] = query[key]
      }
    }
    return filter
  }
}
