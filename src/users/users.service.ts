import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { MongoRepository, ObjectID } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: MongoRepository<User>,
  ) { }

  async createUser(user: { name: string; email: string }): Promise<User> {
    return this.usersRepo.save(user);
  }

  async findOneByIdOrProps(query: string | Partial<User>) {
    const filter = typeof (query) === 'string' ? { _id: new ObjectId(query) } : query
    return this.usersRepo.findOne(filter)
  }

  async findOneOrThrow(query: string | Partial<User>) {
    const user = await this.usersRepo.findOne(query)
    if (!user) {
      throw new Error("USER_NOT_FOUND")
    }
  }
}
