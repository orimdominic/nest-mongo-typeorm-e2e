import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private usersRepo: MongoRepository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createUser(user: { name: string; email: string }): Promise<User> {
    return await this.usersRepo.save(user);
  }
}
