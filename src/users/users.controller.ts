import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  handleCreateUser(@Body() user) {
    return this.usersService.createUser(user);
  }
}
