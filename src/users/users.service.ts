import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: MongoRepository<User>,
  ) {}

  async createUser(user: { name: string; email: string }): Promise<User> {
    return await this.usersRepo.save(user);
  }
}
